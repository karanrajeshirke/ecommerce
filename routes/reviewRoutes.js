import express from "express"
import { averageOfReviews, createReviewController, getReviewsForProduct } from "../controllers/reviewController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";



const router=express.Router();




router.post('/create-review',requireSignIn,createReviewController)
router.get('/:pid',getReviewsForProduct)
router.get('/count/:pid',averageOfReviews)
export default router