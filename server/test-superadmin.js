import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test function to create a superAdmin and instructor
const testSuperAdminFunctionality = async () => {
  try {
    // Create a test superAdmin
    const superAdmin = await User.create({
      name: 'Test SuperAdmin',
      email: 'superadmin@test.com',
      password: 'password123',
      role: 'superAdmin'
    });
    
    console.log('Created superAdmin:', superAdmin);
    
    // Create an instructor with the superAdmin as creator
    const instructor = await User.create({
      name: 'Test Instructor',
      email: 'instructor@test.com',
      password: 'password123',
      role: 'instructor',
      createdBy: superAdmin._id
    });
    
    console.log('Created instructor:', instructor);
    
    // Test querying instructors by superAdmin
    const instructorsBySuperAdmin = await User.find({
      role: 'instructor',
      createdBy: superAdmin._id
    }).populate('createdBy', 'name email');
    
    console.log('Instructors created by superAdmin:', instructorsBySuperAdmin);
    
    // Clean up test data
    await User.deleteOne({ _id: superAdmin._id });
    await User.deleteOne({ _id: instructor._id });
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
connectDB().then(() => {
  testSuperAdminFunctionality();
}); 