import { User } from '../models/user.model.js';

// Get superAdmin dashboard data
export const getSuperAdminDashboard = async (req, res) => {
  try {
    const { id, role } = req; // From authentication middleware
    const { superAdminId } = req.query; // From URL parameter

    console.log('🔍 Dashboard Request Debug:', {
      userId: id,
      userRole: role,
      requestedSuperAdminId: superAdminId,
      query: req.query,
      headers: req.headers
    });

    if (role !== 'superAdmin') {
      console.log('❌ Access denied: User role is not superAdmin');
      return res.status(403).json({
        success: false,
        message: "Access denied. SuperAdmin only."
      });
    }

    // Check if superAdmin is accessing their own dashboard
    if (id !== superAdminId) {
      console.log('❌ Access denied: User trying to access another superAdmin dashboard');
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own dashboard."
      });
    }

    console.log('✅ SuperAdmin dashboard access granted');

    // Get instructors created by this superAdmin
    const instructors = await User.find({
      role: 'instructor',
      createdBy: id
    }).select('-password');

    // Get total counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalSuperAdmins = await User.countDocuments({ role: 'superAdmin' });

    // Get recent users (last 5)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalInstructors,
        totalSuperAdmins,
        myInstructors: instructors,
        recentUsers,
        studentGrowth: 5.2,
        instructorGrowth: 3.1,
        courseGrowth: 8.4,
        batchGrowth: -2.5
      }
    });
  } catch (err) {
    console.error('SuperAdmin dashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all instructors (filtered by superAdmin who created them)
export const getInstructors = async (req, res) => {
  try {
    const { id, role } = req; // From authentication middleware

    let query = { role: 'instructor' };

    // If superAdmin, only show instructors they created
    if (role === 'superAdmin') {
      query.createdBy = id;
    }

    const instructors = await User.find(query).select('-password').populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      instructors: instructors,
      count: instructors.length
    });
  } catch (err) {
    console.error('Get instructors error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create instructor (with superAdmin ID)
export const createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { id, role } = req; // From authentication middleware

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Only superAdmin can create instructors
    if (role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only superAdmin can create instructors."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create instructor with superAdmin ID
    const instructor = await User.create({
      name,
      email,
      password,
      role: 'instructor',
      createdBy: id // Set the superAdmin who created this instructor
    });

    res.status(201).json({
      success: true,
      data: instructor
    });
  } catch (err) {
    console.error('Create instructor error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};