import { decodeToken, verifyToken } from "../Config/jwtConfig.js";


export const authenticateJWT = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
      return res.status(401).send('Authorization header is missing');
    }

    const token = authorizationHeader.replace('Bearer ', '');
    verifyToken(token);
    const user = decodeToken(token);
    req.user = user.data;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
      //lấy token từ FE client
      let { token } = req.headers;

      // kiểm tra token
      checkToken(token);
  
      // nếu hợp lệ
      next();
    } catch (err) {
      // nếu không hợp lệ
      errorCode(res, "Access denied.");
    }
};
