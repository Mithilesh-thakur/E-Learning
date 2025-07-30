import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// ✅ Create new course (free)
router.route("/").post(isAuthenticated, createCourse);

// ✅ Search course (no price sorting now)
router.route("/search").get(isAuthenticated, searchCourse);

// ✅ Get published course for all users (public)
router.route("/published-courses").get(getPublishedCourse);

// ✅ Get courses created by current user
router.route("/").get(isAuthenticated, getCreatorCourses);

// ✅ Edit a course (no coursePrice expected)
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse)
  .get(isAuthenticated, getCourseById)
  .patch(isAuthenticated, togglePublishCourse); // publish/unpublish

// ✅ Lecture routes
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router
  .route("/:courseId/lecture/:lectureId")
  .post(isAuthenticated, editLecture);

// ✅ Single lecture
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);

export default router;
