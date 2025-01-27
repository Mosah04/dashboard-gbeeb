import fs from "fs";
import path from "path";

async function setupFontConfig() {
  // const fontsDir = path.resolve("./public/fonts");
  const fontsDir = process.cwd();

  const fontConfigContent = `
    <?xml version="1.0"?>
    <!DOCTYPE fontconfig SYSTEM "fonts.dtd">
    <fontconfig>
      <dir>${fontsDir}</dir>
    </fontconfig>
  `;

  // const fontConfigPath = path.join(fontsDir, "fonts.conf");
  const fontConfigPath = "fonts.conf";

  await fs.promises.writeFile(fontConfigPath, fontConfigContent, "utf-8");
  console.log("fonts.conf créé :", fontConfigPath);

  process.env.FONTCONFIG_PATH = fontsDir;
  return fontsDir;
}

export default setupFontConfig;
