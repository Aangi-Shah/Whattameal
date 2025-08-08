import { CustomError } from "./errorHandler.js";

export const checkAccess = (permisions) => {
  return (req, res, next) => {
    if ((req.user && req.user.role && permisions.includes(req.user.role)) || (req.query && req.query.masterKey && req.query.masterKey === process.env.USER_SECRET_MASTER_KEY)) next();
    else return next(new CustomError(403,"You do not have permission to perform this action"));
  };
};
