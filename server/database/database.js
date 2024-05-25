import mongoose from "mongoose";

export const connectToDB = () => {
  mongoose
    .connect(process.env.CONN_STR, {
      dbName: "Chat-Application",
    })
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(`Something went wrong: ${err}`);
    });
};
