import { CustomError } from '../middleware/errorHandler.js';
import { Menu } from '../models/Menu.model.js';
import { customResponse } from '../utils/customResponse.js';
import { getEMenuModel } from '../utils/model.helper.js';
import { validateMenuItem, validateObjectID } from '../utils/validations.js';
import { formatDate, getFullNameByDoc } from '../utils/data.helper.js';
import { getMonthMeal, getNextMeal } from '../repo/repo.methods.js';

export const handleGetallMenuDataReq = async (req, res, next) => {
  try {
    const { reqMonth } = req.query;
    const menus = await getMonthMeal(reqMonth)
    const updatedData = menus.map((item) => {
      return { ...item._doc, date: formatDate(item.date) };
    });
    res.status(200).json(customResponse(true, "Menu's all data fetched successfully.", { data: updatedData }));
  } catch (error) {
    next(error);
  }
};
export const handleGetMenuItemDataByIDReq = async (req, res, next) => {
  try {
    const id = req.params.itemID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const data = await Menu.findById(id);
    if (!data) throw new CustomError(404, "No such menu item exists.");
    res.status(200).json(customResponse(true, "Menu item data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const handleGetNextMealMenuItemDataByIDReq = async (req, res, next) => {
  try {
    const data = await getNextMeal();
    if (!data) throw new CustomError(404, "No such menu item exists.");
    res.status(200).json(customResponse(true, "Menu item data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.fileData || !Array.isArray(req.fileData)) throw new CustomError(400, "File processing failed");
    if (req.fileData.length <= 0) throw new CustomError(400, "File is empty");
    const userID = req.user._id;
    const userName = getFullNameByDoc(req.user);
    const filteredData = req.fileData.filter((item) => !validateMenuItem(item.date,item.meal,item.price));
    const insertData = filteredData.map((item) => (getEMenuModel(item.date,item.meal,item.price,userID,userName,userID,userName)));
    const menuData = await Menu.insertMany(insertData);
    return res.status(200).json(customResponse(true, "File Uploaded successfully", { data: menuData, rawFile: req.fileData }));
  } catch (error) {
    next(error);
  }
};
export const handleNewMenuItem = async (req, res, next) => {
  try {
    const { date, meal, price } = req.body;
    const isValidItem = validateMenuItem(date,meal,price)
    if (!isValidItem) throw new CustomError(400, "Invalid menu item data.");
    const dateFormat = new Date(date)
    if(dateFormat == "Invalid Date") throw new CustomError(400, "Invalid date format. Please provide date in YYYY-MM-DD format.");
    const isItemExist = await Menu.findOne({ date: dateFormat });
    if (isItemExist) throw new CustomError(409, "Menu item already exists. You can update it instead.");
    const userID = req.user._id;
    const userName = getFullNameByDoc(req.user);
    const model = getEMenuModel(dateFormat,meal,price,userID,userName,userID,userName)
    const data = await Menu.create(model);
    if (!data) throw new CustomError(500, "Something went wrong while creating menu item.");
    res.status(201).json(customResponse(true, "Menu item created successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const handleUpdateMenuItem = async (req, res, next) => {
  try {
    const id = req.params.itemID;
    const { date, meal, price } = req.body;
    console.log("Update Menu Request",id)
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const isValidItem = validateMenuItem(date,meal,price)
    if (!isValidItem) throw new CustomError(400, "Invalid menu item data.");
    const model = await Menu.findById(id);
    if (!model) throw new CustomError(404, "No such menu item exists.");
    // model.date = new Date(date);
    model.meal = meal;
    model.price = price;
    model.updatedBy = req.user._id;
    model.updatedByName = getFullNameByDoc(req.user);
    await model.save();
    res.status(200).json(customResponse(true, "Menu item updated successfully.", { data: model }));
  } catch (error) {
    next(error);
  }
};
export const handleDeleteMenuItem = async (req, res, next) => {
  try {
    const id = req.params.itemID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const data = await Menu.findByIdAndDelete(id);
    if (!data) throw new CustomError(404, "No such menu item exists.");
    res.status(200).json(customResponse(true, "Menu item deleted successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
