import mongoose from "mongoose";
import { schools, classes, mealTypes, schoolShifts, divisons } from "../constants/data.js";

export function validateObjectID(id, type = "Object ID") {
  if (!id) return type + " shouldn't be empty";
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) return "Invalid " + type;
  return null;
}
export function validateEmptyValue(value, type) {
  if ( !value || value.toString().length <= 0 || value.toString().trim().length <= 0 ) return type +" Value shouldn't be empty";
  return null;
}
export function validateBoolean(value, type) {
  if (typeof value !== "boolean") return type + " should be boolean type";
  return null;
}
export function validateName(value, type) {
  if (!value || value.trim().length === 0) return type + "Name shouldn't be empty";
  if (value.includes(" ")) return type + "Name shouldn't contain empty space";
  if (value.includes("  ")) return type + "Name shouldn't contain consecutive spaces";
  if (/[0-9]/.test(value)) return type + "Name should not contain any numbers";
  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) return type + "Name shouldn't contain special characters";
  if (!/^[a-zA-Z]+$/.test(value)) return type + "Name should contain only alphabets";
  return null;
}
export function validateFullName(name, type = "Name") {
  if (!name || name.trim().length === 0) return `${type} shouldn't be empty`;
  if (name.includes("  ")) return `${type} shouldn't contain consecutive spaces`;
  if (/[0-9]/.test(name)) return `${type} should not contain any numbers`;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(name)) return `${type} shouldn't contain special characters`;
  return null;
}
export function validateUserName(value, type) {
  if (!value || value.trim().length === 0) return type + " shouldn't be empty";
  if (value.includes("  ")) return type + " shouldn't contain consecutive spaces";
  if (/[!$%^&*(),?":{}|<>]/.test(value)) return type + " shouldn't contain special characters except (@,#,_,-,.)";
  return null;
}
export function validatePhone(value) {
  if (!value || value.trim().length === 0) return "Phone number shouldn't be empty";
  if (value.trim().length !== 12) return "Phone number should be 12 digits long";
  if (!/^[0-9]+$/.test(value)) return "Phone number should contain only numbers";
  if (!value.startsWith("91")) return "Phone number should start with 91";
  return null;
}
export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const ipRegex = /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,}|(\.\d{1,3}){3})$/;
  if (!email || email.trim().length === 0) return "Email shouldn't be empty";
  const parts = email.split("@");
  if (parts.length !== 2) return "Email should contain exactly one '@' character";
  const localPart = parts[0];
  const domainPart = parts[1];
  if (!localPart || localPart.length > 64) return "Email should be between 1 to 64 characters";
  if (localPart.endsWith(".") || localPart.startsWith(".")) return "Email shouldn't start or end with a dot";
  if (/\.{2,}/.test(localPart)) return "Email shouldn't have consecutive dots";
  if (!ipRegex.test(domainPart)) return "Email domain should be valid";
  if (!emailRegex.test(email)) return "Email should be valid";
  if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) return "Email should be valid";
  return null;
}
export function validateDescription(value, type) {
  if (!value || value.trim().length === 0) return type + " shouldn't be empty";
  if (value.length > 3000) return type + " shouldn't exceed from 3000 length. Max 300 length allowed";
  return null;
}
export function validatePassword(password) {
  const passwordPattern = /^[a-zA-Z0-9\W_]+$/;
  if (!password || password.trim().length === 0) return "Password cannot be empty.";
  if (!passwordPattern.test(password)) return "Password should contain Alphabets, Numbers and special character";
  if (password.trim().length < 5 || password.trim().length > 15) return "Password must be between 5 and 15 characters long.";
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-])[A-Za-z\d@$!%*?&#_-]{5,15}$/.test(password)) return "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character";
  return null;
}
export function validateAmount(value, type = "Amount") {
  if (typeof value !== "number") return type + " value should be a number";
  if (value <= 0) return type + " value should be greater than 0";

  const newValue = value.toString();
  if (!newValue || newValue.trim().length === 0) return type + " value shouldn't be empty";
  // if (!/^[0-9]+$/.test(newValue)) return type + " value should contain only numbers";
  return null;
}
export function validateDate(value) {
  if (!value || value.trim().length === 0) return "Date shouldn't be empty";
  const date = new Date(value);
  if (date.toString() === "Invalid Date") return "Invalid date format";
  if (isNaN(date.getTime())) return "Invalid date format";
  return null;
}
export function validateSchool(value) {
  if (!value || value.trim().length === 0) return "School shouldn't be empty";
  if (!schools.includes(value)) return "Invalid school name";
  return null;
}
export function validateClass(value) {
  if (!value || value.trim().length === 0) return "Class shouldn't be empty";
  if (!classes.includes(value)) return "Invalid class name";
  return null;
}
export function validateMealType(value) {
  if (!value || value.trim().length === 0) return "Meal type shouldn't be empty";
  if (!mealTypes.includes(value)) return "Invalid meal type";
  return null;
}
export function validateSchoolShift(value) {
  if (!value || value.trim().length === 0) return "School shift shouldn't be empty";
  if (!schoolShifts.includes(value)) return "Invalid school shift";
  return null;
}
export function validateDivison(value) {
  if (!value || value.trim().length === 0) return "Divison shouldn't be empty";
  if (!divisons.includes(value)) return "Invalid divison";
  return null;
}

export const validateUser = (validationType="NEW", firstName, lastName, userName, password) => {
  const isFirstName = validateName(firstName, "First");
  const isLastName = validateName(lastName, "Last");
  const isUserName = validateUserName(userName, "UserName");
  const isPassword = validationType === "NEW" ? validatePassword(password) : validationType === "UPDATE" ? password ? validatePassword(password) : null : null;
  if (isFirstName !== null) return isFirstName;
  if (isLastName !== null) return isLastName;
  if (isUserName !== null) return isUserName;
  if (isPassword !== null) return isPassword;
  return null;
};
export const validateParent = (name, surName, phone, email) => {
  const isName = validateName(name, " ");
  const isSurName = validateName(surName, "Sur");
  const isPhone = validatePhone(phone);
  const isEmail = validateEmail(email);
  if (isName !== null) return isName;
  if (isSurName !== null) return isSurName;
  if (isPhone !== null) return isPhone;
  if (isEmail !== null) return isEmail;
  return null;
};
export const validateChild = (name, dob, school, className, divison, mealType, shift) => {
  const isName = validateFullName(name, "Child name");
  const isDOB = validateDate(dob);
  const isSchool = validateSchool(school);
  const isClassName = validateClass(className);
  const isDivison = validateDivison(divison);
  const isMealType = validateMealType(mealType);
  const isShift = validateSchoolShift(shift);
  if (isName !== null) return isName;
  if (isDOB !== null) return isDOB;
  if (isSchool !== null) return isSchool;
  if (isClassName !== null) return isClassName;
  if (isDivison !== null) return isDivison;
  if (isMealType !== null) return isMealType;
  if (isShift !== null) return isShift;
  return null;
};
export const validateMenuItem = (date,meal,price) =>{
  const isDate = validateDate(date);
  const isMeal = validateDescription(meal, "Meal");
  const isPrice = validateAmount(price, "Price");
  if (isDate !== null) return isDate;
  if (isMeal !== null) return isMeal;
  if (isPrice !== null) return isPrice;
  return null;
}
export const validateMeal = (parent, child, menuIDs, price, isPaid) => {
  const isParent = validateObjectID(parent, "Parent");
  const isChild = validateObjectID(child, "Child");
  const isPrice = validateAmount(price, "Price");
  const isIsPaid = validateBoolean(isPaid, "IsPaid");
  if(!Array.isArray(menuIDs)) return "MealIDs should be an formate of array"
  if (menuIDs.length > 0) {
    for (const _id of menuIDs) {
      const isMealID = validateObjectID(_id, "MealID");
      if (isMealID !== null) return isMealID;
    }
  }
  if (menuIDs.length <= 0) return "MealIDs shouldn't be empty";
  if (isParent !== null) return isParent;
  if (isChild !== null) return isChild;
  if (isPrice !== null) return isPrice;
  if (isIsPaid !== null) return isIsPaid;
  return null;
};