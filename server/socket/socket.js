import { v4 as uuid } from "uuid";
import cookieParser from "cookie-parser";
import { Message } from "../models/Message.js";
import { getSockets } from "../lib/helper.js";
import { socketAuthenticator } from "../middlewares/auth.js";
import { EVENTS } from "./events.js";

const userSocketIDs = new Map();
const onlineUsers = new Set();

export const setupSocket = (io) => {
  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (err) => {
      await socketAuthenticator(err, socket, next);
    });
  });

  io.on(EVENTS.CONNECTION, (socket) => {
    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(EVENTS.NEW_MESSAGE, async ({ chatId, members, message }) => {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: { _id: user._id, name: user.name },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(EVENTS.NEW_MESSAGE, { chatId, message: messageForRealTime });
      io.to(membersSocket).emit(EVENTS.NEW_MESSAGE_ALERT, { chatId });

      try {
        await Message.create(messageForDB);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on(EVENTS.START_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(EVENTS.START_TYPING, { chatId });
    });

    socket.on(EVENTS.STOP_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(EVENTS.STOP_TYPING, { chatId });
    });

    socket.on(EVENTS.CHAT_JOINED, ({ userId, members }) => {
      onlineUsers.add(userId.toString());
      io.to(getSockets(members)).emit(EVENTS.ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(EVENTS.CHAT_LEAVED, ({ userId, members }) => {
      onlineUsers.delete(userId.toString());
      io.to(getSockets(members)).emit(EVENTS.ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(EVENTS.DISCONNECT, () => {
      userSocketIDs.delete(user._id.toString());
      onlineUsers.delete(user._id.toString());
      socket.broadcast.emit(EVENTS.ONLINE_USERS, Array.from(onlineUsers));
    });
  });
};

export { userSocketIDs };
