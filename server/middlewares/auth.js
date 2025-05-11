import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import { JWT_SECRET, ADMIN_SECRET_KEY, CHATTER_BOX_ADMIN_TOKEN, CHATTER_BOX_TOKEN } from "../constants/index.js";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies[CHATTER_BOX_TOKEN];
  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  const decodedData = jwt.verify(token, JWT_SECRET);

  req.user = decodedData._id;

  next();
});

const isAdmin = (req, res, next) => {
  const token = req.cookies[CHATTER_BOX_ADMIN_TOKEN];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, JWT_SECRET);

  const isMatched = secretKey === ADMIN_SECRET_KEY;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[CHATTER_BOX_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, isAdmin, socketAuthenticator };
