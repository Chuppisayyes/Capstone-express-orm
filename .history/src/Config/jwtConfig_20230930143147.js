import jwt from 'jsonwebtoken';
const createToken = (data) => {
    let token = jwt.sign({data},process.env.SECRET_KEY, { expiresIn: '5m', algorithm: "HS256" });
    return token;
};
const verifyToken = (token) => {
    let verifyToken = jwt.verify(token, process.env.VALID_KEY);

    return verifyToken;
}
const decodeToken = (token) => {
    return jwt.decode(token);
}
export { decodeToken, verifyToken ,createToken }