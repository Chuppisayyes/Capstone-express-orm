import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY;
const createToken = (data) => {
    let token = jwt.sign({data},key , { expiresIn: '5m', algorithm: "HS256" });
    return token;
};
const verifyToken = (token) => {
    return jwt.verify(token, key);
}
const decodeToken = (token) => {
    return jwt.decode(token);
}
export { decodeToken, verifyToken ,createToken }