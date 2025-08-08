import bcrypt from "bcrypt";
import { CustomError } from "../middleware/errorHandler.js";
import { User } from "../models/User.model.js";
import { customResponse } from "../utils/customResponse.js";
import { getEUserModel } from "../utils/model.helper.js";
import { validateObjectID, validateUser } from "../utils/validations.js";

export const getUserHandle = async (req, res, next) => {
  try {
    const data = await User.find().select("-password");
    if (!data) throw new CustomError(404, "No such user data found.");
    res.status(200).json(customResponse(true, "User's all data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getLoggedinUserHandle = async (req, res, next) => {
  try {
    const data = req.user;
    data.password = undefined;
    res.status(200).json(customResponse(true, "Currenctly loggedin user fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const getUserByIDHandle = async (req, res, next) => {
  try {
    const { userID } = req.params;
    if (!userID || validateObjectID(userID) !== null) throw new CustomError(400, "Please provide a valid userID.");
    const data = await User.findById(userID).select("-password");
    if (!data) throw new CustomError(404, "Unable to find requested user.");
    data.password = undefined;
    res.status(200).json(customResponse(true, "Requested user data fetched successfully.", { data }));
  } catch (error) {
    next(error);
  }
};
export const newUserHandle = async (req, res, next) => {
  try {
    const { firstName, lastName, userName, password } = req.body;
    const isValidUserData = validateUser( "NEW", firstName, lastName, userName, password );
    if (isValidUserData) throw new CustomError(400, isValidUserData);
    const isUserExist = await User.findOne({ userName });
    if (isUserExist) throw new CustomError(409, "Requested user was already registered with same userName.");
    const hasedPassword = await bcrypt.hash(password, 10);
    const model = getEUserModel();
    model.firstName = firstName;
    model.lastName = lastName;
    model.userName = userName;
    model.password = hasedPassword;
    const user = await User.create(model);
    user.password = undefined;
    res.status(201).json(customResponse(true, "New user created successfully.", { data: user }));
  } catch (error) {
    next(error);
  }
};
export const createFirstSuperUserHandle = async (req, res, next) => {
  try {
    const { firstName, lastName, userName, password, f_s_u_c_key } = req.body;
    if(f_s_u_c_key !== process.env.USER_SECRET_MASTER_KEY) throw new CustomError(400, "Invalid key, please contact admin.");
    const isValidUserData = validateUser( "NEW", firstName, lastName, userName, password );
    if (isValidUserData) throw new CustomError(400, isValidUserData);
    const isUserExist = await User.findOne({ userName });
    if (isUserExist) throw new CustomError(409, "Requested user was already registered with same userName.");
    const hasedPassword = await bcrypt.hash(password, 10);
    const model = getEUserModel();
    model.firstName = firstName;
    model.lastName = lastName;
    model.userName = userName;
    model.password = hasedPassword;
    const user = await User.create(model);
    user.password = undefined;
    res.status(201).json(customResponse(true, "New user created successfully.", { data: user }));
  } catch (error) {
    next(error);
  }
};
export const updateUserHandle = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const { firstName, lastName, userName, password } = req.body;
    if (!userID || validateObjectID(userID) !== null) throw new CustomError(400, "Invalid User ID.");
    const isValidUserData = validateUser( "UPDATE", firstName, lastName, userName, password );
    if (isValidUserData) throw new CustomError(400, isValidUserData);
    const user = await User.findById(userID);
    if (!user) throw new CustomError(404, "Unable to find requested user.");
    if(user.userName !== userName){
      const isUserExist = await User.findOne({ userName });
      if (isUserExist) throw new CustomError(409, `userName '${userName}' was already taken, please try another.`);
    }
    if (firstName && firstName !== user.firstName) user.firstName = firstName;
    if (lastName && lastName !== user.lastName) user.lastName = lastName;
    if (userName && userName !== user.userName) user.userName = userName;
    if (password) {
      const hasedPassword = await bcrypt.hash(password, 10);
      user.password = hasedPassword;
    }
    await user.save()
    user.password = undefined;
    res.status(200).json(customResponse(true, "User updated successfully.", { data: user }));
  } catch (error) {
    next(error);
  }
};
export const deleteUserHandle = async (req, res, next) => {
  try {
    const { userID } = req.params;
    if (!userID || validateObjectID(userID) !== null) throw new CustomError(400, "Invalid User ID.");
    const user = await User.findById(userID);
    if (!user) throw new CustomError(404, "Unable to find requested user.");
    const userleft = await User.find();
    if(userleft.length <= 1) throw new CustomError(400, "You can't delete all users, please create new user first.");
    await user.deleteOne();
    res.status(200).json(customResponse(true, "User deleted successfully.", { data: user }));
  } catch (error) {
    next(error);
  }
};
