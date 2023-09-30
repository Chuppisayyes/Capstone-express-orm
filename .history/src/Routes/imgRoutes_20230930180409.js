import express from 'express';
import { authenticateJWT } from '../Middlewares/jwtAuthMiddleware.js';
import { createImg, deleteImg, getImg, getImgById, getImgByUserId, updateImg, upload, uploadImg } from '../Controllers/imgController.js';


const imgRoutes = express.Router();

    imgRoutes.get('/get-img',authenticateJWT, getImg);
    imgRoutes.get("/get-image/:imageId",authenticateJWT, getImgById);
    imgRoutes.get('/get-img-by-user-id/:userId', authenticateJWT, getImgByUserId);
    imgRoutes.post("/create-image", authenticateJWT, createImg);
    imgRoutes.put("/update-image", authenticateJWT, updateImg);
    imgRoutes.delete("/delete-image", authenticateJWT, deleteImg);
    imgRoutes.post("/upload-image", authenticateJWT, upload, uploadImg);

export default imgRoutes;
