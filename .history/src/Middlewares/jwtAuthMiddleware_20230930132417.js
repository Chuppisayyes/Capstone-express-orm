import { decodeToken, verifyToken } from "../Config/jwtConfig.js";


export const authenticateJWT = async (req, res, next) => {
  try {
    //lấy token từ FE client
    let { token } = req.headers;

    // kiểm tra token
    checkToken(token);

    // nếu hợp lệ
    next();
  } catch (err) {
    // nếu không hợp lệ
    res.status
  }
  
};
