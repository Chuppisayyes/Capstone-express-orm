import jwt from 'jsonwebtoken';
const key = process.env.SECRET_KEY;
const createToken = (data) => {
    let token = jwt.sign(
      { data }, // data : object
      {key}, // private key : node
      {
        expiresIn: "1h", // exp : 5 hours
        algorithm: "HS256", // algorithm : HS256
      }
    );
    return token;
  };
const verifyToken = (token) => {
    return jwt.verify(token, key);
}
const decodeToken = (token) => {
    return jwt.decode(token);
}
export { decodeToken, verifyToken ,createToken }