import { Parent } from "../models/Parent.model.js";
import { Meal } from '../models/Meal.model.js';
import { textMessage } from "../utils/whatsapp.js";
import { getChildren, getMenuItem } from "../repo/repo.methods.js";
import { formatDate } from '../utils/data.helper.js';

export const handleOrderHistoryReq = async (from) => {
  try {
    const parent = await Parent.findOne({ phone: from });
    if (!parent) return false;
    const bookedMeals = await Meal.find({ parent: parent._id });
    if (!bookedMeals || bookedMeals.length <= 0) return false;
    const sortedMeals = bookedMeals.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("-").map(Number);
      const [dayB, monthB, yearB] = b.date.split("-").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateB - dateA;
    });
    if (sortedMeals.length <= 0) return false;

    let message = "Your last order details are as following ";
    const meal = sortedMeals[0];
    const child = await getChildren(meal.child)
    message += `booked for ${child.name},\n`;
    const menus = await Promise.all(meal.menuIDs.map(async (item) => await getMenuItem(item)));
    menus.forEach((item, i) => {
      message += `${i + 1}. Date: ${formatDate(item.date)}, Meal: ${item.meal}, Price: ${item.price}\n`;
    });
    const res = await textMessage(from,message);
    if (res) return true;
    return false;
  } catch (error) {
    console.log("Error while generating menu image: ", error);
    return false;
  }
};
