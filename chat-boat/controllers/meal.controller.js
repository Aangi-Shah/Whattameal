import { CustomError } from "../middleware/errorHandler.js";
import { customResponse } from "../utils/customResponse.js";
import { validateMeal, validateObjectID } from "../utils/validations.js";
import { Meal } from '../models/Meal.model.js';
import { Menu } from '../models/Menu.model.js';
import { getEMealModel } from '../utils/model.helper.js';
import { getFullNameByDoc } from '../utils/data.helper.js';
import { Parent } from '../models/Parent.model.js';
import { Child } from '../models/Child.model.js';

export const getMealHandle = async (req, res, next) => {
  try {
    const data = await Meal.find();
    if (!data) throw new CustomError(404, "No such meal data found.");
    res.status(200).json(customResponse(true, "Meal's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getMealByIDHandle = async (req, res, next) => {
  try {
    const id = req.params.mealID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const data = await Meal.findById(id);
    if (!data) throw new CustomError(404, "No such meal exists.");
    res.status(200).json(customResponse(true, "Meal's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const createMealHandle = async (req, res, next) => {
  try {
    const { parent, child, menuIDs, price, isPaid } = req.body;
    const isDataValid = validateMeal(parent, child, menuIDs, price, isPaid)
    if (isDataValid) throw new CustomError(400, isDataValid);
    const isParent = await Parent.findById(parent);
    if (!isParent) throw new CustomError(404, "No such parent exists.");
    const isChild = await Child.findById(child);
    if (!isChild) throw new CustomError(404, "No such child exists.");
    const isChildBelongsToParent = await Parent.findOne({ _id: parent, children: { $in: [child] } });
    if (!isChildBelongsToParent) throw new CustomError(404, "Child doesn't belong to the specified parent.");
    const menus = await Menu.find({ _id: { $in: menuIDs } });
    if (menus.length !== menuIDs.length) throw new CustomError(404, "One or more menu items not found from menu.");
    const totalPrice = menus.reduce((acc, menu) => acc + menu.price, 0);
    const userID = req.user._id;
    const userName = getFullNameByDoc(req.user);
    const model = getEMealModel()
    model.parent = parent;
    model.child = child;
    model.menuIDs = menuIDs;
    model.price = totalPrice;
    model.isPaid = isPaid;
    model.createdBy = userID || null;
    model.createdByName = userName || "";
    const data = await Meal.create(model);
    if (!data) throw new CustomError(500, "Something went wrong while creating meal.");
    res.status(201).json(customResponse(true, "Meal created successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const updateMealHandle = async (req, res, next) => {
  try {
    const { mealID } = req.params;
    const { parent, child, menuIDs, price, isPaid } = req.body;
    const isDataValid = validateMeal(parent, child, menuIDs, price, isPaid)
    if (isDataValid) throw new CustomError(400, isDataValid);
    if (validateObjectID(mealID)) throw new CustomError(400, "Invalid Meal ID.");
    const isMealEsist = await Meal.findById(mealID);
    if (!isMealEsist) throw new CustomError(404, "No such meal exists.");
    if (phone != isMealEsist.phone) {
      const isPhoneExist = await Meal.findOne({ phone });
      if (isPhoneExist) throw new CustomError(409, "Meal with this phone number already exists.");
    }
    const data = await Meal.findByIdAndUpdate(mealID, { parent, child, menuIDs, price, isPaid }, { new: true });
    if (!data) throw new CustomError(500, "Something went wrong while updating meal.");
    res.status(200).json(customResponse(true, "Meal updated successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const deleteMealHandle = async (req, res, next) => {
  try {
    const { mealID } = req.params;
    if (validateObjectID(mealID)) throw new CustomError(400, "Invalid Meal ID.");
    const data = await Meal.findByIdAndDelete(mealID)
    if (!data) throw new CustomError(500, "Something went wrong while deleting meal.");
    res.status(200).json(customResponse(true, "Meal deleted successfully.", { data }));
  } catch (error) {
    next(error);
  }
};