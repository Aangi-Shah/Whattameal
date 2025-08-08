import { u_STATES, schools, classes, divisons, mealTypes, schoolShifts } from "../constants/data.js"
import { customResponse } from "../utils/customResponse.js";

export const getUserStateDDHandle = async (req, res, next) => {
  try {
    const data = Object.keys(u_STATES).map((state) => ({ label: u_STATES[state], value: u_STATES[state] }));
    res.status(200).json(customResponse(true, "Dropdown data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getSchoolsDDHandle = async (req, res, next) => {
  try {
    const data = schools.map((school) => ({ label: school, value: school }));
    res.status(200).json(customResponse(true, "Dropdown data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getClassesDDHandle = async (req, res, next) => {
  try {
    const data = classes.map((class_) => ({ label: class_, value: class_ }));
    res.status(200).json(customResponse(true, "Dropdown data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getDivisionsDDHandle = async (req, res, next) => {
  try {
    const data = divisons.map((division) => ({ label: division, value: division }));
    res.status(200).json(customResponse(true, "Dropdown data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getMealTypesDDHandle = async (req, res, next) => {
  try {
    const data = mealTypes.map((mealType) => ({ label: mealType, value: mealType }));
    res.status(200).json(customResponse(true, "Dropdown data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getSchoolShiftsDDHandle = async (req, res, next) => {
  try {
    const data = schoolShifts.map((schoolShift) => ({ label: schoolShift, value: schoolShift }));
    res.status(200).json(customResponse(true, "Dropdown data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};