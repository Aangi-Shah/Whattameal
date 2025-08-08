import bcrypt from "bcrypt";
import { CustomError } from "../middleware/errorHandler.js";
import { User } from "../models/User.model.js";
import generateAuthToken from "../utils/authToken.js";
import { customResponse } from "../utils/customResponse.js";
import { validatePassword, validateUserName } from "../utils/validations.js";

export const handleLogin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const isUserNameValid = validateUserName(userName);
    const isRawPasswordValid = validatePassword(password);
    if (isUserNameValid !== null || isRawPasswordValid !== null) throw new CustomError(400, "Please enter valid credentials to login.");
    const user = await User.findOne({ userName });
    if (!user) throw new CustomError(404,"Requested user not registered yet. please try with another Credentials or Register.");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new CustomError(400,"Entered Password is not correct. please try with another one.");
    const authToken = generateAuthToken(user._id, user.userName);
    user.password = undefined;
    res.status(200).json(customResponse(true, "User logged in successfully.", { token: authToken, userID: user._id, data:user }));
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (req, res, next) => {
  try {
    res.status(200).json(customResponse(true, "user logged out successfully.", { data: req.user }));
  } catch (error) {
    next(error);
  }
};
