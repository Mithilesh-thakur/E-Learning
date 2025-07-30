// Get all users (for admin/testing)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.js";

// 🔹 Register Student/User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register.",
    });
  }
};

// 🔹 Register SuperAdmin
export const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "superAdmin",
    });

    return res.status(201).json({
      success: true,
      message: "SuperAdmin account created successfully.",
      user: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    console.error("SuperAdmin Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create SuperAdmin account.",
    });
  }
};

// 🔹 Login Student/User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
  
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed." });
  }
};

// 🔹 Logout
export const logout = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout.",
    });
  }
};

// 🔹 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId)
      .populate({
        path: 'enrolledCourses',
        populate: { path: 'creator', select: 'name photoUrl' }
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user.",
    });
  }
};

// 🔹 Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete old photo if exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }

    // Upload new photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, photoUrl: cloudResponse.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// 🔹 Create Instructor (SuperAdmin only)
export const createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const instructor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "instructor",
      createdBy: req.id, // Add the SuperAdmin who created this instructor
    });
    
    return res.status(201).json({
      success: true,
      message: "Instructor created successfully.",
      instructor: {
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
      },
    });
  } catch (error) {
    console.error("Create Instructor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create instructor.",
    });
  }
};

// Get all instructors (SuperAdmin only)
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select("-password");
    return res.status(200).json({
      success: true,
      instructors,
    });
  } catch (error) {
    console.error("Get All Instructors Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructors.",
    });
  }
};

// 🔹 Update User Role (for testing purposes)
export const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    
    if (!userId || !newRole) {
      return res.status(400).json({
        success: false,
        message: "User ID and new role are required.",
      });
    }

    const validRoles = ['student', 'instructor', 'superAdmin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be student, instructor, or superAdmin.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update User Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
};
