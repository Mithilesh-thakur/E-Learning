import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test function to check current users
const checkCurrentUsers = async () => {
  try {
    console.log('🔍 Checking current users in database...\n');

    // Get all users
    const allUsers = await User.find({}).select('name email role createdAt');
    
    console.log('📊 All Users:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
    });

    // Check for superAdmins specifically
    const superAdmins = await User.find({ role: 'superAdmin' }).select('name email role createdAt');
    
    console.log('\n👑 SuperAdmins:');
    if (superAdmins.length === 0) {
      console.log('❌ No superAdmin users found!');
      console.log('\n💡 To create a superAdmin, you can:');
      console.log('1. Use the registration endpoint: POST /api/v1/user/superadmin/register');
      console.log('2. Or manually update a user in the database:');
      console.log('   db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "superAdmin" } })');
    } else {
      superAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email}) - Created: ${admin.createdAt}`);
      });
    }

    // Check for regular users
    const regularUsers = await User.find({ role: 'student' }).select('name email role createdAt');
    
    console.log('\n👤 Regular Users:');
    if (regularUsers.length === 0) {
      console.log('No regular users found');
    } else {
      regularUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Created: ${user.createdAt}`);
      });
    }

    // Check for instructors
    const instructors = await User.find({ role: 'instructor' }).select('name email role createdAt createdBy');
    
    console.log('\n🎓 Instructors:');
    if (instructors.length === 0) {
      console.log('No instructors found');
    } else {
      instructors.forEach((instructor, index) => {
        console.log(`${index + 1}. ${instructor.name} (${instructor.email}) - Created by: ${instructor.createdBy || 'N/A'} - Created: ${instructor.createdAt}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
connectDB().then(() => {
  checkCurrentUsers();
}); 