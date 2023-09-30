import express from "express";
import { getSaveImage, handleImage } from "../Controllers/saveImgController";
import { authenticateJWT } from "../Middlewares/jwtAuthMiddleware";


const saveImgRoutes = express.Router();

saveImgRoutes.post("/save", handleImage);
saveImgRoutes.get("/get-save", authenticateJWT, getSaveImage);


export default saveImgRoutes;
