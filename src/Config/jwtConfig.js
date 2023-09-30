import jwt from 'jsonwebtoken';
const createToken = (data) => {
    let token = jwt.sign({data},process.env.SECRET_KEY, { expiresIn: '1h', algorithm: "HS256" });
    return token;
};
const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
}
const decodeToken = (token) => {
    return jwt.decode(token);
}
export { decodeToken, verifyToken ,createToken }