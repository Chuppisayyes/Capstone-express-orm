import express from 'express';
import userRoutes from './userRoutes';
import saveImgRoutes from './saveImgRoutes';
import reviewRoutes from './reviewRoutes';
import imgRoutes from './imgRoutes';




const rootRoutes = express.Router();
rootRoutes.use("/user", userRoutes);
rootRoutes.use("/review", reviewRoutes);
rootRoutes.use("/save-image", saveImgRoutes);
rootRoutes.use("/img", imgRoutes);

export default rootRoutes;

