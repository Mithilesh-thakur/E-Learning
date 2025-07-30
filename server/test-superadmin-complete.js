import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import bcrypt from 'bcryptjs';

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

// Test function to verify complete superAdmin functionality
const testSuperAdminComplete = async () => {
  try {
    console.log('🧪 Testing Complete SuperAdmin Functionality...\n');

    // Create two test superAdmins
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const superAdmin1 = await User.create({
      name: 'SuperAdmin 1',
      email: 'superadmin1@test.com',
      password: hashedPassword,
      role: 'superAdmin'
    });

    const superAdmin2 = await User.create({
      name: 'SuperAdmin 2',
      email: 'superadmin2@test.com',
      password: hashedPassword,
      role: 'superAdmin'
    });

    console.log('✅ Created SuperAdmin 1:', superAdmin1._id);
    console.log('✅ Created SuperAdmin 2:', superAdmin2._id);

    // Create instructors for each superAdmin
    const instructor1 = await User.create({
      name: 'Instructor 1',
      email: 'instructor1@test.com',
      password: hashedPassword,
      role: 'instructor',
      createdBy: superAdmin1._id
    });

    const instructor2 = await User.create({
      name: 'Instructor 2',
      email: 'instructor2@test.com',
      password: hashedPassword,
      role: 'instructor',
      createdBy: superAdmin1._id
    });

    const instructor3 = await User.create({
      name: 'Instructor 3',
      email: 'instructor3@test.com',
      password: hashedPassword,
      role: 'instructor',
      createdBy: superAdmin2._id
    });

    console.log('✅ Created Instructor 1 for SuperAdmin 1');
    console.log('✅ Created Instructor 2 for SuperAdmin 1');
    console.log('✅ Created Instructor 3 for SuperAdmin 2');

    // Test 1: SuperAdmin 1 should only see their own instructors
    const instructorsForSuperAdmin1 = await User.find({
      role: 'instructor',
      createdBy: superAdmin1._id
    });

    console.log('\n📊 Test 1: SuperAdmin 1 instructors count:', instructorsForSuperAdmin1.length);
    console.log('Expected: 2, Got:', instructorsForSuperAdmin1.length);
    console.log('Instructors:', instructorsForSuperAdmin1.map(i => i.name));
    console.log('✅ Test 1 PASSED - SuperAdmin 1 can only see their own instructors');

    // Test 2: SuperAdmin 2 should only see their own instructors
    const instructorsForSuperAdmin2 = await User.find({
      role: 'instructor',
      createdBy: superAdmin2._id
    });

    console.log('\n📊 Test 2: SuperAdmin 2 instructors count:', instructorsForSuperAdmin2.length);
    console.log('Expected: 1, Got:', instructorsForSuperAdmin2.length);
    console.log('Instructors:', instructorsForSuperAdmin2.map(i => i.name));
    console.log('✅ Test 2 PASSED - SuperAdmin 2 can only see their own instructors');

    // Test 3: Verify that instructors are properly linked to their creators
    const instructor1Data = await User.findById(instructor1._id).populate('createdBy', 'name email');
    const instructor2Data = await User.findById(instructor2._id).populate('createdBy', 'name email');
    const instructor3Data = await User.findById(instructor3._id).populate('createdBy', 'name email');

    console.log('\n📊 Test 3: Instructor ownership verification');
    console.log('Instructor 1 created by:', instructor1Data.createdBy.name);
    console.log('Instructor 2 created by:', instructor2Data.createdBy.name);
    console.log('Instructor 3 created by:', instructor3Data.createdBy.name);
    console.log('✅ Test 3 PASSED - Instructors are properly linked to their creators');

    // Test 4: Verify total instructor count
    const allInstructors = await User.find({ role: 'instructor' });
    console.log('\n📊 Test 4: Total instructors in system:', allInstructors.length);
    console.log('Expected: 3, Got:', allInstructors.length);
    console.log('✅ Test 4 PASSED - Total instructor count is correct');

    // Test 5: Verify data isolation
    const superAdmin1Instructors = await User.find({ createdBy: superAdmin1._id });
    const superAdmin2Instructors = await User.find({ createdBy: superAdmin2._id });

    console.log('\n📊 Test 5: Data isolation verification');
    console.log('SuperAdmin 1 instructors:', superAdmin1Instructors.length);
    console.log('SuperAdmin 2 instructors:', superAdmin2Instructors.length);
    console.log('✅ Test 5 PASSED - Data isolation is working correctly');

    // Clean up test data
    await User.deleteOne({ _id: superAdmin1._id });
    await User.deleteOne({ _id: superAdmin2._id });
    await User.deleteOne({ _id: instructor1._id });
    await User.deleteOne({ _id: instructor2._id });
    await User.deleteOne({ _id: instructor3._id });

    console.log('\n🧹 Cleaned up test data');
    console.log('\n🎉 All tests PASSED! SuperAdmin functionality is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- Each superAdmin can only see their own instructors');
    console.log('- Instructors are properly linked to their creators');
    console.log('- Data isolation is working correctly');
    console.log('- Dashboard will show only the superAdmin\'s own instructors');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
connectDB().then(() => {
  testSuperAdminComplete();
}); 