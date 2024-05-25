import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  logout,
  findUser,
  authUser,
  getUserId,
  editUsername,
  editAbout,
} from "../controller/user.js";
import { authentication } from "../middlewares/authentication.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    return cb(null, Date.now() + ".jpeg");
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);

router.post("/login", loginUser);

router.get("/authUser", authentication, authUser);

router.get("/getUser", authentication, getUser);

router.post("/findUser", authentication, findUser);

router.get("/getUserId", authentication, getUserId);

router.put("/editUsername", authentication, editUsername);

router.put("/editAbout", authentication, editAbout);

router.get("/logout", logout);

export default router;
