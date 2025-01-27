"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

const BadgeDialog = ({ participant, badgeType = "J'y serai" }) => {
  const [loading, setLoading] = useState(true);
  const [badgeURL, setBadgeURL] = useState("");
  const frameLink =
    badgeType === "J'y serai"
      ? process.env.NEXT_PUBLIC_BADGE_WILL_LINK
      : process.env.NEXT_PUBLIC_BADGE_IS_LINK;

  const generateBadge = async () => {
    try {
      const response = await fetch("/api/generate-badge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frameLink,
          participantImageURL: participant.imageURL,
          isPresenceBadge: badgeType === "J'y suis",
          participantCell: participant.cell,
          participantName: participant.name,
        }),
      });

      if (!response.ok) throw new Error("Badge generation failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBadgeURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger onClick={generateBadge} asChild>
        <div className="w-full font-normal hover:bg-accent px-2 py-2 text-sm cursor-pointer rounded-md">
          Voir le badge: {badgeType}
        </div>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Badge "{badgeType}"
          </DialogTitle>
          <DialogDescription>
            Vous pouvez voir le badge du participant et le télécharger.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <Skeleton className="w-full h-[400px] bg-foreground/50" />
        ) : (
          <div className="w-full place-content-center overflow-y-auto max-h-[70vh]">
            {badgeURL ? (
              <img src={badgeURL} alt="Badge" className="max-w-full" />
            ) : (
              <span className="text-destructive">Erreur!!</span>
            )}
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button
            disabled={!Boolean(badgeURL)}
            onClick={() => {
              downloadImage(badgeURL, `${participant.name}_badge_${badgeType}`);
            }}
            type="button"
          >
            Télécharger le badge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeDialog;

async function generateMergedImage(backgroundSrc, innerSrc) {
  return new Promise((resolve) => {
    const backgroundImage = new Image();
    backgroundImage.src = backgroundSrc;

    backgroundImage.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = backgroundImage.naturalWidth;
      canvas.height = backgroundImage.naturalHeight;
      ctx.drawImage(backgroundImage, 0, 0);

      const innerImage = new Image();
      innerImage.src = innerSrc;

      innerImage.onload = () => {
        // Transparency detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let top = null,
          bottom = null,
          left = null,
          right = null;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const alpha = pixels[index + 3];
            if (alpha === 0) {
              if (top === null || y < top) top = y;
              if (bottom === null || y > bottom) bottom = y;
              if (left === null || x < left) left = x;
              if (right === null || x > right) right = x;
            }
          }
        }

        const margin = 1;
        left = Math.max(0, left - margin);
        right = Math.min(canvas.width, right + margin);
        top = Math.max(0, top - margin);
        bottom = Math.min(canvas.height, bottom + margin);

        const transparentWidth = right - left;
        const transparentHeight = bottom - top;

        // Dimensions computing for "object-fit: cover"
        const ratioInner = innerImage.naturalWidth / innerImage.naturalHeight;
        const ratioTransparent = transparentWidth / transparentHeight;

        let drawWidth, drawHeight;
        if (ratioInner > ratioTransparent) {
          drawWidth = transparentHeight * ratioInner;
          drawHeight = transparentHeight;
        } else {
          drawWidth = transparentWidth;
          drawHeight = transparentWidth / ratioInner;
        }

        // Simulation of object-position: top (top of the empty area)
        const centerX = left + transparentWidth / 2 - drawWidth / 2;
        const centerY = top; // Alignment to the area top

        // Images drawing
        ctx.drawImage(innerImage, centerX, centerY, drawWidth, drawHeight);
        ctx.drawImage(backgroundImage, 0, 0);

        // Merged image to dataURL
        const dataUrl = canvas.toDataURL("image/png");
        resolve({
          dataUrl,
          realWidth: canvas.width,
          realHeight: canvas.height,
        });
      };
    };
  });
}

function downloadImage(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
