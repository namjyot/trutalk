import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      default: "Simple Chat",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dfsjlew69/image/upload/v1710947382/imresizer-1710946709804_ajnr35.jpg",
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", schema);
