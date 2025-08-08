import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { validateObjectID } from "../utils/validations.js";
import { CustomError } from "./errorHandler.js";

export const auth = async(req, res, next) => {
  try {
    let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    if (!token) token = req.headers.Authorization ? req.headers.Authorization.split(" ")[1] : null;
    if (!token) throw new CustomError(401, "Token is required for this request");
    const decodedJWT = jwt.verify( token, process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
        throw new CustomError(401, "Status Unauthorized");
        }
        return decoded;
      }
    );
    if (!decodedJWT) throw new CustomError(401, "Status Unauthorized");
    const isIDValid = validateObjectID(decodedJWT._id)
    if(isIDValid !== null) throw new CustomError(400, isIDValid);
    const user = await User.findById(decodedJWT._id)
    if (!user) throw new CustomError(401, "Status Unauthorized. Unable to find requesting user on server");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
