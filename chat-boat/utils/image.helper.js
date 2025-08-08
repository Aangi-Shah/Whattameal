import dotenv from "dotenv";
import fsSync from "fs";
import { createRequire } from "module";
import { deleteFile } from "../middleware/multer.middleware.js";
import { formatDate } from "./data.helper.js";
const require = createRequire(import.meta.url);
const Jimp = require("jimp");

dotenv.config()

const DIR_DAILY = "public/assets/img/daily"
const DIR_MONTHLY = "public/assets/img/monthly"

export const generateMenuImage = async ({ data, type = "single" }) => {
  if (!fsSync.existsSync(DIR_DAILY)) {
    fsSync.mkdirSync(DIR_DAILY, { recursive: true });
  }
  if (!fsSync.existsSync(DIR_MONTHLY)) {
    fsSync.mkdirSync(DIR_MONTHLY, { recursive: true });
  }

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  
  const templatePath = type === "single" ? `./public/assets/templates/single-menu.jpg` : "./public/assets/templates/month-menu.jpg";
  const fileName = type === "single" ? `${formatDate(data.date)}.jpeg` : `${month}-${year}.jpeg`;
  const outputPath = type === "single" ? `./${DIR_DAILY}/${fileName}` : `./${DIR_MONTHLY}/${fileName}`;

  await deleteFile(outputPath);

  try {
    const image = await Jimp.read(templatePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

    if (type === "single") {
      image.print(font, 780, 200, `${formatDate(data.date)} :`);
      image.print(font, 1180, 200, `${data.meal}`);

      await image.writeAsync(outputPath);
      return `/${DIR_DAILY}/${fileName}`;

    } else if (type === "month") {

      await data.forEach((item, index) => {
        const y = 200 + index * 108;
        image.print(font, 780, y, `${formatDate(item.date)} :`);
        image.print(font, 1180, y, `${item.meal}`);
      });
      
      await image.writeAsync(outputPath);
      return `/${DIR_MONTHLY}/${fileName}`;

    } else return null;
    
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
