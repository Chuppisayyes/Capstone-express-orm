import express from "express";
import { getSaveImage, handleImage } from "../Controllers/saveImgController.js";
import { authenticateJWT } from "../Middlewares/jwtAuthMiddleware.js";


const saveImgRoutes = express.Router();

saveImgRoutes.post("/save-image", handleImage);
saveImgRoutes.get("/get-save", authenticateJWT, getSaveImage);


export default saveImgRoutes;
