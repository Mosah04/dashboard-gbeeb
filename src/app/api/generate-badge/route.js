import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { createAdminClient } from "@/lib/appwrite.config";
import setupFontConfig from "@/lib/setupFontConfig";

export const runtime = "nodejs";

async function fetchImage(url) {
  console.log(`Fetching image from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  console.log(`Image fetched successfully, size: ${buffer.length} bytes`);
  return buffer;
}

async function fetchFont(url) {
  try {
    console.log(`Fetching font from AppWrite: ${url}`);
    const { storage } = await createAdminClient();
    const bucketId = url.split("/")[url.split("/").indexOf("files") - 1];
    const fileId = url.split("/")[url.split("/").indexOf("files") + 1];
    const buffer = await storage.getFileView(bucketId, fileId);

    if (!(buffer instanceof ArrayBuffer)) {
      throw new Error("Invalid font data received from AppWrite");
    }

    const fontBuffer = Buffer.from(buffer);
    console.log(`Font fetched successfully, size: ${fontBuffer.length} bytes`);
    return fontBuffer;
  } catch (error) {
    console.error("Font fetch error:", error);
    throw error;
  }
}

async function generateMergedImage(
  frameBuffer,
  innerBuffer,
  textParams,
  fontBuffer
) {
  const fontConfigPath = path.join(process.cwd(), "fonts", "fonts.conf");
  const fontPath = path.join(process.cwd(), "fonts", "Viga-Regular.ttf");

  sharp.cache(false);
  if (process.env.NODE_ENV === "production") {
    process.env.FONTCONFIG_PATH = "/var/task/fonts";
    process.env.LD_LIBRARY_PATH = "/var/task";
  }
  console.log("Starting image generation process");
  const frame = sharp(frameBuffer);
  const inner = sharp(innerBuffer);

  const { width, height } = await frame.metadata();
  if (!width || !height) throw new Error("Invalid frame image");
  console.log(`Frame dimensions: ${width}x${height}`);

  // Find the transparent area in the frame image
  const { data, info } = await frame
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let top = height,
    bottom = 0,
    left = width,
    right = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4 + 3;
      if (data[idx] === 0) {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }

  const transparentWidth = right - left;
  const transparentHeight = bottom - top;
  const margin = 2;
  console.log(
    `Transparent area: ${transparentWidth}x${transparentHeight} at (${left},${top})`
  );

  // Resize the inner image to fit the transparent area
  const resizedInner = await inner
    .resize({
      width: transparentWidth + margin,
      height: transparentHeight + margin,
      fit: "cover",
      position: "top",
    })
    .toBuffer();
  console.log("Inner image resized");

  // Create a blank canvas of the frame size
  const canvas = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  // Composite the images: first the resized inner image, then the frame
  let compositeImage = await canvas
    .composite([
      { input: resizedInner, top: top, left: left },
      { input: frameBuffer, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();
  console.log("Base image composited");

  try {
    // const fontPath = await setupFontConfig();
    // Save the font file temporarily
    // const tempFontPath = path.join(fontPath, "custom-font.ttf");
    // await fs.writeFile(tempFontPath, fontBuffer);
    // console.log(`Font saved temporarily at: ${tempFontPath}`);

    // Generate SVG for text overlays
    const svgText = textParams
      .map((param) => {
        const verticalOffset = param.fontSize / 3;
        const padding = param.padding || 0;

        return `
        <rect
          x="${param.x - param.width / 2}"
          y="${param.y - param.height / 2}"
          width="${param.width}"
          height="${param.height}"
          fill="${param.backgroundColor}"
          rx="${param.borderRadius}"
          ry="${param.borderRadius}"
        />
        <text
          x="${param.x}"
          y="${param.y + verticalOffset - padding}"
          font-family="CustomFont, sans-serif"
          font-size="${param.fontSize}px"
          font-weight="600"
          fill="${param.color}"
          text-anchor="middle"
          dominant-baseline="middle"
        >${param.text}</text>
      `;
      })
      .join("");

    // Convert font to base64 for embedding
    const fontBase64 = fontBuffer.toString("base64");

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style type="text/css">
          @font-face {
            font-family: 'CustomFont';
            src: url(data:font/truetype;charset=utf-8;base64,${fontBase64}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        </style>
      </defs>
      ${svgText}
    </svg>`;

    // await fs.writeFile("debug.svg", svg);
    // console.log("Debug SVG saved");

    // Create a new sharp instance with the SVG
    const svgBuffer = Buffer.from(svg);
    const svgImage = sharp(svgBuffer);

    // Composite the SVG on top of the existing image
    compositeImage = await sharp(compositeImage)
      .composite([
        {
          input: await svgImage.png().toBuffer(),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
    console.log("Text overlay composited");

    // Clean up the temporary font file
    // await fs.unlink(tempFontPath);
    console.log("Temporary font file cleaned up");
  } catch (error) {
    console.error("Error processing text overlay:", error);
    // If text overlay fails, return the image without text
    return compositeImage;
  }

  return compositeImage;
}

const textParams = [
  {
    x: 630,
    y: 515,
    width: 300,
    height: 30,
    fontSize: 28,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "#130fb0",
    text: "John Doe",
  },
  {
    x: 630,
    y: 550,
    width: 300,
    height: 30,
    fontSize: 25,
    borderRadius: 0,
    backgroundColor: "rgba(0, 0, 255, 0)",
    color: "#FFFFFF",
    text: "Developer",
  },
];

export async function POST(req) {
  try {
    console.log("POST request received");
    const {
      frameLink,
      participantImageURL,
      isPresenceBadge,
      participantCell,
      participantName,
    } = await req.json();
    console.log("Request body parsed:", {
      frameLink,
      participantImageURL,
      isPresenceBadge,
      participantCell,
      participantName,
    });

    const fontURL = process.env.FONT_LINK;
    if (!fontURL) {
      throw new Error("Font URL is not defined in environment variables");
    }
    console.log("Font URL:", fontURL);

    if (isPresenceBadge) {
      textParams[0].text = participantName;
      textParams[1].text = participantCell;
    }
    console.log("Text params:", textParams);

    const [frameBuffer, innerBuffer, fontBuffer] = await Promise.all([
      fetchImage(frameLink),
      fetchImage(participantImageURL),
      fetchFont(fontURL),
    ]);
    console.log("All resources fetched");

    const mergedImageBuffer = await generateMergedImage(
      frameBuffer,
      innerBuffer,
      isPresenceBadge ? textParams : [],
      fontBuffer
    );
    console.log("Merged image generated");

    return new NextResponse(mergedImageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Image processing failed: " + error.message },
      { status: 500 }
    );
  }
}
