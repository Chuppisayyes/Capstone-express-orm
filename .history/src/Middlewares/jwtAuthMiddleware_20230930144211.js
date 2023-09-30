import { verifyToken } from "../Config/jwtConfig.js";


export const authenticateJWT = async (req, res, next) => {
  try {
    //lấy token từ FE client
    let { token } = req.headers;

    // kiểm tra token
    checkToken(token);

    // nếu hợp lệ
    next();
  } catch (error) {
        res.status(403).json("Không có quyền truy cập");
  }
};
