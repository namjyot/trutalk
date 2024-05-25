import jwt from "jsonwebtoken";

export const getJwtToken = (id) => {
  const token = jwt.sign({ _id: id }, process.env.JWT_SECRET);
  return token;
};
