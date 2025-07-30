import express from 'express';
import {
  getUserProfile,
  login,
  logout,
  register,
  registerSuperAdmin,
  updateProfile,
  getAllUsers,
  createInstructor,
  getAllInstructors,
  updateUserRole
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.js";

const router = express.Router();
// Get all users (for admin/testing)
router.get('/all', getAllUsers);

// 🔹 Regular user routes
router.route("/register").post(register);
router.route("/superadmin/register").post(registerSuperAdmin);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile);

// 🔹 SuperAdmin routes
router.route("/superadmin-dashboard").get(isAuthenticated, isSuperAdmin, (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to SuperAdmin Dashboard" });
});

router.post('/create-instructor', isAuthenticated, isSuperAdmin, createInstructor);
router.get('/instructors', isAuthenticated, isSuperAdmin, getAllInstructors);
router.put('/update-role', updateUserRole); // For testing purposes - no authentication required

export default router;
