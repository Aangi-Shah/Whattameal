import { CustomError } from "../middleware/errorHandler.js";
import { Child } from "../models/Child.model.js";
import { Parent } from "../models/Parent.model.js";
import { customResponse } from "../utils/customResponse.js";
import { eChildModel } from "../utils/model.helper.js";
import { validateChild, validateObjectID } from "../utils/validations.js";

export const getChildrenByParentHandle = async (req, res, next) => {
  try {
    const data = await Child.find();
    if (!data) throw new CustomError(404, "No such child data found.");
    res.status(200).json(customResponse(true, "Children's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getChildByIDHandle = async (req, res, next) => {
  try {
    const id = req.params.childID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const data = await Child.findById(id);
    if (!data) throw new CustomError(404, "No such child exists.");
    res.status(200).json(customResponse(true, "Child's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getChildrenByParentIDHandle = async (req, res, next) => {
  try {
    const id = req.params.parentID;
    if (validateObjectID(id)) throw new CustomError(400, "Invalid ID.");
    const isParentEsist = await Parent.findById(id);
    if (!isParentEsist) throw new CustomError(404, "No such parent exists.");
    const data = await Child.find({ parent: id });
    if (!data) throw new CustomError(404, "No such child exists.");
    res.status(200).json(customResponse(true, "Child's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const createChildHandle = async (req, res, next) => {
  try {
    const { parent, name, dob, school, className, divison, mealType, shift } = req.body;
    if (validateObjectID(parent)) throw new CustomError(400, "Invalid Parent ID.");
    const isParentEsist = await Parent.findById(parent);
    if (!isParentEsist) throw new CustomError(404, "No such parent exists.");
    const isDataValid = validateChild(name, dob, school, className, divison, mealType, shift)
    if (isDataValid) throw new CustomError(400, isDataValid);
    const isChildEsist = await Child.findOne({ name });
    if (isChildEsist) throw new CustomError(409, "Child already exists with this name.");
    const model = eChildModel();
    model.parent = parent;
    model.name = name;
    model.dob = dob;
    model.school = school;
    model.className = className;
    model.divison = divison;
    model.mealType = mealType;
    model.shift = shift;
    const data = await Child.create(model);
    if (!data) throw new CustomError(500, "Something went wrong while creating child.");
    await Parent.findByIdAndUpdate(data.parent,{ $push: { children: data._id } },{ new: true });
    res.status(201).json(customResponse(true, "Child created successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const updateChildHandle = async (req, res, next) => {
  try {
    const { childID } = req.params;
    const { parent, name, dob, school, className, divison, mealType, shift } = req.body;
    if (validateObjectID(childID)) throw new CustomError(400, "Invalid Child ID.");
    const isChildEsist = await Child.findById(childID);
    if (!isChildEsist) throw new CustomError(404, "No such child exists.");
    const isDataValid = validateChild(name, dob, school, className, divison, mealType, shift)
    if (isDataValid) throw new CustomError(400, isDataValid);
    const data = await Child.findByIdAndUpdate(childID, { parent, name, dob, school, className, divison, mealType, shift }, { new: true });
    if (!data) throw new CustomError(500, "Something went wrong while updating child.");
    res.status(200).json(customResponse(true, "Child updated successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const deleteChildHandle = async (req, res, next) => {
  try {
    const { childID } = req.params;
    if (validateObjectID(childID)) throw new CustomError(400, "Invalid Child ID.");
    const data = await Child.findByIdAndDelete(childID)
    if (!data) throw new CustomError(500, "Something went wrong while deleting child.");
    const parent = await Parent.findById(data.parent);
    if (!parent) throw new CustomError(500, "Something went wrong while deleting child from parent.");
    const index = parent.children.indexOf(childID);
    if (index !== -1) {
      parent.children.splice(index, 1);
      await parent.save();
    }
    res.status(200).json(customResponse(true, "Child deleted successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
