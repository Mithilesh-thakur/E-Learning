import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Test function to verify superAdmin creation and login
const testSuperAdminLogin = async () => {
  try {
    console.log('🧪 Testing SuperAdmin Creation and Login...\n');

    // Create a test superAdmin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const superAdmin = await User.create({
      name: 'Test SuperAdmin',
      email: 'superadmin@test.com',
      password: hashedPassword,
      role: 'superAdmin'
    });
    
    console.log('✅ Created SuperAdmin:', {
      id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role
    });

    // Test login (simulate the login process)
    const loginUser = await User.findOne({ email: 'superadmin@test.com' });
    if (!loginUser) {
      throw new Error('SuperAdmin not found');
    }

    const isMatch = await bcrypt.compare('password123', loginUser.password);
    if (!isMatch) {
      throw new Error('Password does not match');
    }

    console.log('✅ Login successful');

    // Test token generation
    const token = jwt.sign(
      {
        userId: loginUser._id,
        role: loginUser.role
      },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    console.log('✅ Token generated successfully');
    console.log('Token payload:', {
      userId: loginUser._id,
      role: loginUser.role
    });

    // Test token verification
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('✅ Token verified successfully');
    console.log('Decoded token:', decoded);

    // Test that the role is correct
    if (decoded.role !== 'superAdmin') {
      throw new Error('Role is not superAdmin');
    }

    console.log('✅ Role verification passed');

    // Clean up test data
    await User.deleteOne({ _id: superAdmin._id });
    console.log('\n🧹 Cleaned up test data');
    console.log('\n🎉 All tests PASSED! SuperAdmin creation and login is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
connectDB().then(() => {
  testSuperAdminLogin();
}); 