
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError)
    return (
      <h1 className="text-center text-red-500 text-lg">
        Something went wrong while fetching courses.
      </h1>
    );

  return (
    <div className="bg-purple-800 dark:bg-[#141414] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-bold text-4xl text-center mb-12 text-white dark:text-white">
          Explore Free Courses
        </h2>

        {/* Horizontal scroll container */}
        <div className="flex gap-6 overflow-y-hidden ">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">

              </div>
            ))
            : data?.courses?.length > 0
              ? data.courses.map((course, index) => (
                <div key={index} className="flex-shrink-0">
                  <Course course={course} />
                </div>
              ))
              : (
                <p className="text-center text-gray-500 w-full">
                  No courses available.
                </p>
              )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
