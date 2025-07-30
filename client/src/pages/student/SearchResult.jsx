import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star, Clock, User } from "lucide-react";
import PropTypes from "prop-types";

const SearchResult = ({ course, viewMode = "list" }) => {
  const user = course.creator;

  // Calculate rating display
  const rating = course.rating || 4.5;
  const ratingCount = course.ratingCount || 128;

  // Grid View
  if (viewMode === "grid") {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
        <div className="relative">
          <img
            src={course.courseThumbnail || `https://ui-avatars.com/api/?name=${course.courseTitle}&size=300&background=8b5cf6&color=fff`}
            alt={course.courseTitle}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <Badge className="bg-purple-600 text-white px-2 sm:px-3 py-1 text-xs font-medium">
              {course.courseLevel}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4 sm:p-5">
          <div className="space-y-3 sm:space-y-4">
            {/* Course Title */}
            <Link to={`/course-detail/${course._id}`}>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                {course.courseTitle}
              </h3>
            </Link>
            
            {/* Subtitle */}
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {course.subTitle}
            </p>
            
            {/* Creator Name - Simplified */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium truncate">{user?.name || "Unknown Instructor"}</span>
            </div>
            
            {/* Course Stats */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{rating}</span>
                <span className="hidden sm:inline">({ratingCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{course.duration || '2h 30m'}</span>
              </div>
            </div>
            
            {/* Action Button */}
            <Button
              asChild
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              <Link to={`/course-detail/${course._id}`}>
                Start Learning
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List View
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Course Image */}
          <div className="relative flex-shrink-0">
            <img
              src={course.courseThumbnail || `https://ui-avatars.com/api/?name=${course.courseTitle}&size=300&background=8b5cf6&color=fff`}
              alt={course.courseTitle}
              className="w-full lg:w-64 h-32 sm:h-40 lg:h-40 object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <Badge className="bg-purple-600 text-white px-2 sm:px-3 py-1 text-xs font-medium">
                {course.courseLevel}
              </Badge>
            </div>
            
          </div>
          
          {/* Course Content */}
          <div className="flex-1 space-y-3 sm:space-y-4">
            {/* Header */}
            <div className="space-y-1 sm:space-y-2">
              <Link to={`/course-detail/${course._id}`}>
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                  {course.courseTitle}
                </h3>
              </Link>
              <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm sm:text-base">
                {course.subTitle}
              </p>
            </div>
            
            {/* Creator Name - Simplified */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium">{user?.name || "Unknown Instructor"}</span>
            </div>
            
            {/* Course Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-sm text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{rating}</span>
                <span>({ratingCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration || '2h 30m'}</span>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex flex-col items-start lg:items-end justify-center">
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              <Link to={`/course-detail/${course._id}`}>
                Start Learning
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

SearchResult.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    courseTitle: PropTypes.string,
    subTitle: PropTypes.string,
    courseThumbnail: PropTypes.string,
    courseLevel: PropTypes.string,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    duration: PropTypes.string,
    creator: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
  }).isRequired,
  viewMode: PropTypes.oneOf(["list", "grid"]),
};

export default SearchResult;
