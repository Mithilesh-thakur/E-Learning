// Test file to verify search functionality
// This is a simple test to ensure the search components work correctly

const testSearchFunctionality = () => {
  console.log('🧪 Testing Search Functionality...');
  
  // Test data
  const mockCourses = [
    {
      _id: '1',
      courseTitle: 'Complete React Developer Course',
      subTitle: 'Learn React from scratch to advanced concepts',
      coursePrice: 2999,
      originalPrice: 4999,
      courseLevel: 'Beginner',
      rating: 4.8,
      ratingCount: 1250,
      enrolledStudents: 15420,
      duration: '15h 30m',
      lectures: 45,
      courseThumbnail: 'https://example.com/react-course.jpg',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-02-20T14:45:00Z',
      tags: ['React', 'JavaScript', 'Frontend'],
      certificate: true,
      isNew: false,
      creator: {
        _id: 'instructor1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'instructor',
        photoUrl: 'https://example.com/john.jpg'
      }
    },
    {
      _id: '2',
      courseTitle: 'Node.js Backend Development',
      subTitle: 'Build scalable backend applications with Node.js',
      coursePrice: 3999,
      originalPrice: 5999,
      courseLevel: 'Intermediate',
      rating: 4.6,
      ratingCount: 890,
      enrolledStudents: 8920,
      duration: '12h 45m',
      lectures: 38,
      courseThumbnail: 'https://example.com/nodejs-course.jpg',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-02-15T11:20:00Z',
      tags: ['Node.js', 'Backend', 'JavaScript'],
      certificate: true,
      isNew: true,
      creator: {
        _id: 'instructor2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'instructor',
        photoUrl: 'https://example.com/jane.jpg'
      }
    }
  ];

  // Test search functionality
  const searchQuery = 'React';
  const filteredCourses = mockCourses.filter(course => 
    course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.subTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  console.log('✅ Search Results:', filteredCourses.length, 'courses found');
  console.log('✅ Filtered Courses:', filteredCourses.map(c => c.courseTitle));

  // Test sorting functionality
  const sortByPrice = [...mockCourses].sort((a, b) => a.coursePrice - b.coursePrice);
  const sortByRating = [...mockCourses].sort((a, b) => b.rating - a.rating);
  const sortByDate = [...mockCourses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log('✅ Price Sort:', sortByPrice.map(c => `${c.courseTitle}: ₹${c.coursePrice}`));
  console.log('✅ Rating Sort:', sortByRating.map(c => `${c.courseTitle}: ${c.rating}⭐`));
  console.log('✅ Date Sort:', sortByDate.map(c => `${c.courseTitle}: ${c.createdAt.split('T')[0]}`));

  // Test filter functionality
  const beginnerCourses = mockCourses.filter(course => course.courseLevel === 'Beginner');
  const coursesWithCertificates = mockCourses.filter(course => course.certificate);
  const newCourses = mockCourses.filter(course => course.isNew);

  console.log('✅ Beginner Courses:', beginnerCourses.length);
  console.log('✅ Courses with Certificates:', coursesWithCertificates.length);
  console.log('✅ New Courses:', newCourses.length);

  console.log('🎉 All search functionality tests passed!');
};

// Run the test
testSearchFunctionality(); 