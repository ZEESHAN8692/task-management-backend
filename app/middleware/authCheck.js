import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import roles from "../middleware/Roll/roles.js";

export const hsahePassword = (password) => {
  try {
    const salt = 10;
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
};
export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const AuthCheck = (req, res, next) => {
  const token =
    req?.body?.token || req?.query?.token || req?.headers["x-access-token"];
  if (!token) {
    return res.status(400).json({
      message: "Token is required for access this page",
    });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY
    );
    console.log("before login data", req.user);
    req.user = decoded;
    console.log("afetr login data", req.user);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  return next();
};

export const adminCheck = (req, res, next) => {
  const token =
    req?.body?.token || req?.query?.token || req?.headers["x-access-token"];
  if (!token) {
    return res.status(400).json({
      message: "Token is required for access this page",
    });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY
    );
    req.user = decoded;
    console.log("afetr login data", req.user);
    if (req.user.role !== "admin") {
      return res.status(400).json({
        message: "You are not admin",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
  return next();
};

// export const rollBaseWork = (action) => {
//   return (req, res, next) => {
//     const userRole = req?.user.role;
//     const permissions = roles[userRole];

//     if (permissions && permissions.includes(action)) {
//       console.log(`User with role ${userRole} has permission to ${action}`);
//       return next();
//     } else {
//       return res.status(403).json({
//         message: "You don't have permission to perform this action",
//       });
//     }
//   };
// };
