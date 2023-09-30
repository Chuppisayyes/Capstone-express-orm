import {  verifyToken } from "../Config/jwtConfig.js";


export const authenticateJWT = async (req, res, next) => {
  try {
    //lấy token từ FE client
    const { token } = req.headers;

    // kiểm tra token
    verifyToken(token);

    // nếu hợp lệ
    next();
  } catch (err) {
    // nếu không hợp lệ
    res.status(403).send("Không có quyền truy cập");
  }
  
};
