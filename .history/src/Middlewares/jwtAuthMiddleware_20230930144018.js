import { verifyToken } from "../Config/jwtConfig.js";


export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    verifyToken(token);
    const user = decodeToken(token);
    req.user = user.data;
    next();
  } catch (error) {
        res.status(403).send(e,"Không có quyền truy cập");

  }
  
};
