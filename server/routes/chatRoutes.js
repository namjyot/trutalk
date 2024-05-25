import express from "express";
import {
  createChat,
  fetchMessages,
  getChat,
  sendMessage,
  sendGroupMessage,
  createGroup,
  getGroups,
  fetchGroupMessages,
  removeFromGroup,
} from "../controller/chat.js";
import { authentication } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/createChat", authentication, createChat);

router.get("/getChat", authentication, getChat);

router.post("/sendMessage", authentication, sendMessage);

router.post("/sendGroupMessage", authentication, sendGroupMessage);

router.post("/fetchMessages", authentication, fetchMessages);

router.post("/createGroup", authentication, createGroup);

router.get("/getGroups", authentication, getGroups);

router.post("/fetchGroupMessages", authentication, fetchGroupMessages);

router.post("/removeFromGroup", authentication, removeFromGroup);

export default router;
