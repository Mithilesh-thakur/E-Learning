// import { Course } from "../models/course.model.js";
// import { CoursePurchase } from "../models/coursePurchase.model.js";
// import { Lecture } from "../models/lecture.model.js";
// import { User } from "../models/user.model.js";

// // ✅ Enroll in course (Free)
// export const enrollInCourse = async (req, res) => {
//   try {
//     const userId = req.id; // ✅ comes from isAuthenticated middleware
//     const { courseId } = req.body;

//     if (!courseId) {
//       return res.status(400).json({ message: "Course ID is required." });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found!" });
//     }

//     const alreadyPurchased = await CoursePurchase.findOne({ userId, courseId });
//     if (alreadyPurchased) {
//       return res.status(400).json({ message: "You already enrolled in this course." });
//     }

//     // ✅ Create course purchase record with status "completed" and amount 0
//     await CoursePurchase.create({
//       userId,
//       courseId,
//       amount: 0,
//       status: "completed",
//     });

//     // ✅ Optionally mark all lectures as free preview
//     if (course.lectures?.length > 0) {
//       await Lecture.updateMany(
//         { _id: { $in: course.lectures } },
//         { $set: { isPreviewFree: true } }
//       );
//     }

//     // ✅ Update enrolledCourses array in User
//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { enrolledCourses: course._id } },
//       { new: true }
//     );

//     // ✅ Update enrolledStudents array in Course
//     await Course.findByIdAndUpdate(
//       course._id,
//       { $addToSet: { enrolledStudents: userId } },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Enrolled successfully!",
//       redirectUrl: `/course-progress/${courseId}`,
//     });
//   } catch (error) {
//     console.error("Enrollment Error:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // ✅ Get single course detail with enrollment status
// export const getCourseDetailWithPurchaseStatus = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.id;

//     if (!courseId) {
//       return res.status(400).json({ message: "Course ID is required." });
//     }

//     const course = await Course.findById(courseId)
//       .populate("creator")
//       .populate("lectures");

//     if (!course) {
//       return res.status(404).json({ message: "Course not found!" });
//     }

//     const purchased = await CoursePurchase.findOne({ userId, courseId });

//     return res.status(200).json({
//       course,
//       purchased: !!purchased,
//     });
//   } catch (error) {
//     console.error("Get course detail error:", error.message);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // ✅ Get all enrolled (purchased) courses for a user
// export const getAllPurchasedCourse = async (req, res) => {
//   try {
//     const userId = req.id;

//     const purchasedCourses = await CoursePurchase.find({
//       userId,
//       status: "completed",
//     }).populate("courseId");

//     return res.status(200).json({
//       purchasedCourses,
//     });
//   } catch (error) {
//     console.error("Get all purchases error:", error.message);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

// ✅ Free Enroll: Directly enroll user in the course
export const enrollInCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // Check if already enrolled
    const isAlreadyEnrolled = course.enrolledStudents.includes(userId);
    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    // ✅ Add user to course
    course.enrolledStudents.push(userId);
    await course.save();

    // ✅ Add course to user
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: course._id } },
      { new: true }
    );

    // ✅ Optionally mark lectures as free preview
    if (course.lectures?.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully!",
      redirectUrl: `/course-progress/${courseId}`,
    });
  } catch (error) {
    console.error("Enrollment Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get single course detail with enrollment status (no CoursePurchase)
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const isEnrolled = course.enrolledStudents.includes(userId);

    return res.status(200).json({
      course,
      purchased: isEnrolled,
    });
  } catch (error) {
    console.error("Get course detail error:", error.message);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all enrolled courses for a user (no CoursePurchase used)
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;

    const courses = await Course.find({ enrolledStudents: userId });

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Get all enrolled courses error:", error.message);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
