import jwt from "jsonwebtoken";

const generateAuthToken = (_id, userName) => jwt.sign({ _id, userName }, process.env.JWT_SECRET, { expiresIn: "24h" });

export default generateAuthToken;
