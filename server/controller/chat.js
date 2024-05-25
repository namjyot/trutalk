import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";

export const createChat = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const selfId = req.user._id;
    if (otherUserId !== selfId) {
      const chat = await Chat.find({
        $and: [
          { users: { $in: [otherUserId] } },
          { users: { $in: [selfId] } },
          { isGroupChat: false },
        ],
      }).populate({
        path: "users",
        match: { _id: { $not: { $eq: selfId } } },
        select: "username email about avatar",
      });
      if (chat.length !== 0) {
        res.json({ success: true, chat: chat });
      } else {
        const newChat = await Chat.create({
          users: [selfId, otherUserId],
        });
        if (!newChat) {
          res.json({
            success: false,
            message: "Something went wrong while creating new chat",
          });
        } else {
          const filteredChat = await newChat.populate({
            path: "users",
            match: { _id: { $not: { $eq: selfId } } },
            select: "username email about avatar",
          });
          if (!filteredChat) {
            res.json({
              success: false,
              message: "Something went wrong while populating users in chat",
            });
          } else {
            res.json({ success: true, chat: filteredChat });
          }
        }
      }
    } else {
      res.json({ success: false, message: "Both users are same!" });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const getChat = async (req, res) => {
  try {
    const selfId = req.user._id;
    const chats = await Chat.find({
      $and: [{ users: { $in: [selfId] } }, { isGroupChat: false }],
    }).populate({
      path: "users",
      match: { _id: { $not: { $eq: selfId } } },
      select: "username email about avatar",
    });
    if (chats.length === 0) {
      res.json({
        success: false,
        message: "Start Chatting Now",
      });
    } else {
      res.json({ success: true, chats: chats });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const selfId = req.user._id;
    const { chatId, message } = req.body;
    const result = await Message.create({
      sender: selfId,
      content: message,
      chat: chatId,
    });
    if (!result) {
      res.json({
        success: false,
        message: `Something went wrong while sending message`,
      });
    } else {
      const lastMessageUpdate = await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message,
      });

      res.json({ success: true, message: result });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const selfId = req.user._id;
    const { chatId, message } = req.body;
    const result = await Message.create({
      sender: selfId,
      content: message,
      chat: chatId,
    });
    if (!result) {
      res.json({
        success: false,
        message: `Something went wrong while sending message`,
      });
    } else {
      const lastMessageUpdate = await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message,
      });
      const msg = await result.populate({
        path: "sender",
        select: "username email about avatar",
      });

      res.json({
        success: true,
        message: msg,
      });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.body;
    const messages = await Message.find({ chat: chatId });
    res.json({ success: true, messages: messages });
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const createGroup = async (req, res) => {
  try {
    const selfId = req.user._id;
    const { groupName, userArr, groupImage } = req.body;
    if (userArr.length === 0) {
      res.json({
        success: false,
        message: "Cannot create group without any user",
      });
    } else {
      userArr.push(selfId);
      const group = await Chat.create({
        chatName: groupName,
        isGroupChat: true,
        users: userArr.map((id) => id),
        avatar: groupImage,
      });
      res.json({ success: true, group: group });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const getGroups = async (req, res) => {
  try {
    const selfId = req.user._id;
    const groups = await Chat.find({
      $and: [{ users: { $in: [selfId] } }, { isGroupChat: true }],
    }).populate({
      path: "users",
      match: { _id: { $not: { $eq: selfId } } },
      select: "username email about avatar",
    });
    res.json({ success: true, groups: groups });
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const fetchGroupMessages = async (req, res) => {
  try {
    const { chatId } = req.body;
    const messages = await Message.find({ chat: chatId }).populate({
      path: "sender",
      select: "username email avatar about",
    });
    res.json({ success: true, messages: messages });
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const removeFromGroup = async (req, res) => {
  const selfId = req.user._id;
  const { chatId } = req.body;
  try {
    const users = await Chat.updateOne(
      { _id: chatId },
      { $pull: { users: selfId } }
    );
    res.json({ success: true, message: `Left the Group` });
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};
