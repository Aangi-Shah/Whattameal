import { CustomError } from "../middleware/errorHandler.js";
import { getMonthMeal, getNextMeal } from "../repo/repo.methods.js";
import { generateMenuImage } from "../utils/image.helper.js";
import { imgMessage } from "../utils/whatsapp.js";

export const handleFullMenuReq = async (from) => {
  try {
    const menus = await getMonthMeal(null)
    if (menus.length <= 0) return { success: false, message: "No such menus found. Please try again after some time." };

    const image = await generateMenuImage({ data: menus, type: "month" });
    if (image !== null) {
      const imgUrl = `${process.env.LOCAL_BE_DOMAIN_URI}${image}`;
      console.log("Full Menu Image URL :- ", imgUrl);
      const res = await imgMessage(from, imgUrl);
      if (res) return { success: true, data:res }
      else return { success: false, message: "Something went wrong. Please try again after some time." }
    } else return { success: false, message: "Something went wrong. Please try again after some time." }

  } catch (error) {
    console.log("Error while generating menu image: ", error);
    return null;
  }
};

export const handleNextMealMenuReq = async (from) => {
  try {
    const nextMeal = await getNextMeal()
    if (!nextMeal) return { success: false, message: "No such next meal found. Please try again after some time." }

    const image = await generateMenuImage({ data: nextMeal, type: "single" });
    if (image !== null) {
      const imgUrl = `${process.env.LOCAL_BE_DOMAIN_URI}${image}`;
      console.log("Next Meal Menu Image URL :- ", imgUrl);
      const res = await imgMessage(from, imgUrl);
      if (res) return { success: true, data:res }
      else return { success: false, message: "Something went wrong. Please try again after some time." }
    } else return { success: false, message: "Something went wrong. Please try again after some time." }
    
  } catch (error) {
    console.log("Error while generating menu image: ", error);
    return false;
  }
};
