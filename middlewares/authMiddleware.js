import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    // FIX: Normalize the user ID so controllers always get req.user.id
    req.user = {
      id: decoded.id || decoded._id,   // <-- 🔥 IMPORTANT FIX
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
