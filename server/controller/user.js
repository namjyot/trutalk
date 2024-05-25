import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { getJwtToken } from "../middlewares/getJwtToken.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import sharp from "sharp";

const uploadImage = async (req) => {
  const name = Date.now();
  if (!req.file) {
    return "https://res.cloudinary.com/dfsjlew69/image/upload/v1710686569/wlci1nkljxgbneawtywp.jpg";
  } else {
    try {
      const resize = await sharp(req.file.path)
        .resize(400, 400)
        .toFile(process.cwd() + `/uploads/resized-${name}.jpeg`);
      sharp.cache(false);
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.log(error);
    }
    const result = await cloudinary.uploader.upload(
      `uploads/resized-${name}.jpeg`
    );
    fs.unlinkSync(`${process.cwd()}/uploads/resized-${name}.jpeg`);
    return result.secure_url;
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = await uploadImage(req);
  try {
    const isExists = await User.findOne({
      email: email.toLowerCase(),
    });
    if (isExists) {
      res.json({ success: false, message: "User already exists!" });
    } else {
      const encryptedPass = bcrypt.hashSync(password, 10);
      const user = await User.create({
        username,
        email,
        password: encryptedPass,
        avatar,
      });
      if (!user) {
        res.json({
          success: false,
          message: "Something went wrong while registering the user",
        });
      } else {
        const token = getJwtToken(user._id);
        res
          .cookie("token", token, {
            path: "/",
            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({ success: true, message: "Registered Successfully" });
      }
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.json({ success: false, message: "Invalid Email or Password" });
    } else {
      const isPassMatch = bcrypt.compareSync(password, user.password);
      if (!isPassMatch) {
        res.json({ success: false, message: "Invalid Email or Password" });
      } else {
        const token = getJwtToken(user._id);

        res
          .cookie("token", token, {
            path: "/",
            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({ success: true, message: "Logged in Successfully" });
      }
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "username email about avatar"
    );
    if (!user) {
      res.json({
        sucess: false,
        message: `Something went wrong while getting user details`,
      });
    } else {
      res.json({ success: true, user });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const findUser = async (req, res) => {
  try {
    const selfId = req.user._id;
    const { email } = req.body;
    if (!email) {
      res.json({ success: false, message: "Email not found" });
    } else {
      const users = await User.find({
        $and: [
          { email: { $regex: email, $options: "i" } },
          { _id: { $not: { $eq: selfId } } },
        ],
      }).select("username email about avatar");
      if (users.length !== 0) {
        res.json({ success: true, users: users });
      } else {
        res.json({ success: false, messages: "User Doesn't exist" });
      }
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const getUserId = (req, res) => {
  try {
    const selfId = req.user._id;
    res.json({ success: true, id: selfId });
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const authUser = (req, res) => {
  res.json({ success: true, message: "Authentic User" });
};

export const editUsername = async (req, res) => {
  const selfId = req.user._id;
  const { username } = req.body;
  try {
    const result = await User.findByIdAndUpdate(selfId, { username: username });
    if (!result) {
      res.json({ success: false, message: `Something went wrong` });
    } else {
      res.json({ success: true, messsage: result });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const editAbout = async (req, res) => {
  const selfId = req.user._id;
  const { about } = req.body;
  try {
    const result = await User.findByIdAndUpdate(selfId, { about: about });
    if (!result) {
      res.json({ success: false, message: `Something went wrong` });
    } else {
      res.json({ success: true, messsage: result });
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("token", '', {
            path: "/",
            expires: 0,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          }).json({success: true, message: `Logged Out`});
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};
