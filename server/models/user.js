import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "Think and live positive.",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
