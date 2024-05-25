import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.json({ success: false, message: "Login required" });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        res.json({ success: false, message: "Login required" });
      } else {
        req.user = decoded;
        next();
      }
    }
  } catch (error) {
    res.json({ success: false, message: `Something went wrong ${error}` });
  }
};
