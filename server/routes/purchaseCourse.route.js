import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  enrollInCourse,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// ✅ Free enrollment — no payment needed
router.post("/enroll", isAuthenticated, enrollInCourse);

// ✅ Get course details along with user's enrollment status
router.get("/course/:courseId/detail-with-status", isAuthenticated, getCourseDetailWithPurchaseStatus);

// ✅ Get all enrolled (free) courses for a user
router.get("/", isAuthenticated, getAllPurchasedCourse);

export default router;
