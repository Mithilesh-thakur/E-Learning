import express from 'express';
import { createInstructor, getInstructors, getSuperAdminDashboard } from '../controllers/instructor.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isSuperAdmin from '../middlewares/isSuperAdmin.js';

const router = express.Router();

// Apply authentication to all routes
router.use(isAuthenticated);

// Get superAdmin dashboard data
router.get('/admin/dashboard', isSuperAdmin, getSuperAdminDashboard);

// Get instructors (superAdmin can only see their own)
router.get('/instructor', getInstructors);

// Create instructor (only superAdmin)
router.post('/instructor', isSuperAdmin, createInstructor);

export default router;
