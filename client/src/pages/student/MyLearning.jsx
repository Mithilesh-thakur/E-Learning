import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white dark:bg-[#1c0f2f] min-h-screen transition-all duration-300">
      {/* Heading Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-300 tracking-tight">
          📚 My Learning
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
          Welcome to your learning dashboard! Here, you can access all the courses you're enrolled in. Stay consistent, keep learning, and track your progress as you grow your skills.
        </p>
      </div>

      {/* Main Content */}
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 text-lg mt-20">
            <p className="mb-2">🚫 You are not enrolled in any course yet.</p>
            <p>
              Head over to the courses page and pick something you're excited to learn. The first step is the most important!
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-md">
              You are currently enrolled in <strong>{myLearning.length}</strong> {myLearning.length === 1 ? "course" : "courses"}. Keep up the good work!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myLearning.map((course, index) => (
                <Course key={index} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton loader
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-2xl h-52 animate-pulse"
      />
    ))}
  </div>
);
