import express from 'express';
import { authenticateJWT } from '../Middlewares/jwtAuthMiddleware.js';
import { createReview, deleteReview, getReviewByImageId, updateReview } from '../Controllers/reviewController.js';


const reviewRoutes = express.Router();

    reviewRoutes.get("/get-review-by-image-id/:imageId",authenticateJWT, getReviewByImageId);
    reviewRoutes.post("/create-review/:userId", authenticateJWT, createReview);
    reviewRoutes.put("/update-review", authenticateJWT, updateReview);
    reviewRoutes.delete("/delete-review", authenticateJWT, deleteReview);

export default reviewRoutes;