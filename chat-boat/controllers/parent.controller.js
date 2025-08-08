import { CustomError } from "../middleware/errorHandler.js";
import { Parent } from "../models/Parent.model.js";
import { customResponse } from "../utils/customResponse.js";
import { eParentModel } from "../utils/model.helper.js";
import { validateObjectID, validateParent } from "../utils/validations.js";
import { Child } from './../models/Child.model.js';
import { Feedback } from '../models/FeedBack.model.js';

export const getParentHandle = async (req, res, next) => {
  try {
    const data = await Parent.find();
    if (!data) throw new CustomError(404, "No such parent data found.");
    res.status(200).json(customResponse(true, "Parent's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getParentsFeedbacksHandle = async (req, res, next) => {
  try {
    const data = await Feedback.find();
    if (!data || data.length === 0) throw new CustomError(404, "No such feedback data found.");
    // if (!data || data.length === 0) throw new CustomError(404, "No such parent feedback data found.");
    res.status(200).json(customResponse(true, "Parent's all feedback data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getParentByIDHandle = async (req, res, next) => {
  try {
    const id = req.params.parentID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const data = await Parent.findById(id);
    if (!data) throw new CustomError(404, "No such parent exists.");
    res.status(200).json(customResponse(true, "Parent's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getParentByChildIDHandle = async (req, res, next) => {
  try {
    const id = req.params.childID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const isChildEsist = await Child.findById(id);
    if (!isChildEsist) throw new CustomError(404, "No such child exists.");
    const data = await Parent.find({ _id: isChildEsist.parent });
    if (!data) throw new CustomError(404, "No such parent exists.");
    res.status(200).json(customResponse(true, "Parent's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const createParentHandle = async (req, res, next) => {
  try {
    const { name, surName, phone, email } = req.body;
    const isDataValid = validateParent(name, surName, phone, email)
    if (isDataValid) throw new CustomError(400, isDataValid);
    const isParentEsist = await Parent.findOne({ phone });
    if (isParentEsist) throw new CustomError(409, "Parent with this phone number already exists.");
    const model = eParentModel(phone);
    model.name = name;
    model.surName = surName;
    model.phone = phone;
    model.email = email;
    const data = await Parent.create(model);
    if (!data) throw new CustomError(500, "Something went wrong while creating parent.");
    res.status(201).json(customResponse(true, "Parent created successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const updateParentHandle = async (req, res, next) => {
  try {
    const { parentID } = req.params;
    const { name, surName, phone, email } = req.body;
    const isDataValid = validateParent(name, surName, phone, email)
    if (isDataValid) throw new CustomError(400, isDataValid);
    if (validateObjectID(parentID)) throw new CustomError(400, "Invalid Parent ID.");
    const isParentEsist = await Parent.findById(parentID);
    if (!isParentEsist) throw new CustomError(404, "No such parent exists.");
    if (phone != isParentEsist.phone) {
      const isPhoneExist = await Parent.findOne({ phone });
      if (isPhoneExist) throw new CustomError(409, "Parent with this phone number already exists.");
    }
    const data = await Parent.findByIdAndUpdate(parentID, { name, surName, phone, email }, { new: true });
    if (!data) throw new CustomError(500, "Something went wrong while updating parent.");
    res.status(200).json(customResponse(true, "Parent updated successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const deleteParentHandle = async (req, res, next) => {
  try {
    const { parentID } = req.params;
    if (validateObjectID(parentID)) throw new CustomError(400, "Invalid Parent ID.");
    const data = await Parent.findByIdAndDelete(parentID)
    if (!data) throw new CustomError(500, "Something went wrong while deleting parent.");
    const child = await Child.deleteMany({ parent: data._id });
    if (!child) throw new CustomError(500, "Something went wrong while deleting children of this parent.");
    res.status(200).json(customResponse(true, "Parent deleted successfully.", { data }));
  } catch (error) {
    next(error);
  }
};