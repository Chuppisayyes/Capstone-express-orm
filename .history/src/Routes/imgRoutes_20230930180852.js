import express from 'express';
import { authenticateJWT } from '../Middlewares/jwtAuthMiddleware.js';
import { createImg, deleteImg, getImg, getImgById, getImgByUserId, updateImg, uploadImg } from '../Controllers/imgController.js';

const storage = multer.diskStorage({
    destination: (req, file, callback) =>
      callback(null, process.cwd() + "/public/img"),
    filename: (req, file, callback) => {
      let newName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_"); // Xóa khoảng trắng thay bằng '_'
      callback(null, newName);
    },
  });
const upload = multer({ storage });


const imgRoutes = express.Router();

    imgRoutes.get('/get-img',authenticateJWT, getImg);
    imgRoutes.get("/get-image/:imageId",authenticateJWT, getImgById);
    imgRoutes.get('/get-img-by-user-id/:userId', authenticateJWT, getImgByUserId);
    imgRoutes.post("/create-image", authenticateJWT, createImg);
    imgRoutes.put("/update-image", authenticateJWT, updateImg);
    imgRoutes.delete("/delete-image", authenticateJWT, deleteImg);
    imgRoutes.post("/upload-image", authenticateJWT, upload.single("file"), uploadImg);

export default imgRoutes;
