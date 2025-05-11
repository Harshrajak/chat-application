import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import cloudinary from "../config/cloudinary.js";
import { getBase64, getSockets } from "../lib/helper.js";
import { JWT_SECRET, CHATTER_BOX_TOKEN, COOKIE_OPTIONS } from "../constants/index.js";

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, JWT_SECRET);

  return res.status(code).cookie(CHATTER_BOX_TOKEN, token, COOKIE_OPTIONS).json({
    success: true,
    user,
    message,
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};

const uploadFilesToCloudinary = async (files = []) => {
  if (!files.length) return [];

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary", err);
  }
};

const deletFilesFromCloudinary = async (public_ids) => {
  if (!public_ids.length) return;

  try {
    await cloudinary.api.delete_resources(public_ids);
  } catch (error) {
    throw new Error("Error deleting files from cloudinary", error);
  }
};

export {
  sendToken,
  emitEvent,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
};
