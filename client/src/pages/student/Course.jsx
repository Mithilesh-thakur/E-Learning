import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`} className="block group">
      <Card className="overflow-hidden rounded-2xl bg-white dark:bg-[#2a1745] border border-purple-200 dark:border-purple-700 shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
        <div className="relative">
          <img
            src={course.courseThumbnail || "https://via.placeholder.com/300x160"}
            alt="Course Thumbnail"
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="px-4 py-3 space-y-3">
          <h1 className="text-lg font-semibold text-purple-900 dark:text-white truncate group-hover:underline">
            {course.courseTitle}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
                  alt={course.creator?.name || "Creator"}
                />
                <AvatarFallback>
                  {course.creator?.name?.[0] || "C"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {course.creator?.name || "Unknown"}
              </span>
            </div>

            <Badge className="bg-purple-700 text-white text-xs px-3 py-1 rounded-full">
              {course.courseLevel || "Beginner"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
