
import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Search, Filter as FilterIcon, Grid, List, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [sortBy, setSortBy] = useState("relevance"); // "relevance", "date"
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories
  });

  const isEmpty = !isLoading && data?.courses?.length === 0;
  const hasResults = !isLoading && data?.courses?.length > 0;

  // Update search when query changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleFilterChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ query: searchInput.trim() });
    }
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy("relevance");
  };

  const getSortedCourses = () => {
    if (!data?.courses) return [];
    
    const courses = [...data.courses];
    
    switch (sortBy) {
      case "date":
        return courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return courses;
    }
  };

  const sortedCourses = getSortedCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-violet-50">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-20 py-4 text-base md:text-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm md:text-base"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Search Results Header */}
        {query && (
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 md:mb-6">
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  Search Results for "{query}"
                </h1>
                                  {hasResults && (
                    <p className="text-sm md:text-base text-gray-600">
                      Found <span className="font-semibold text-purple-600">{data.courses.length}</span> courses
                      {selectedCategories.length > 0 && (
                        <span className="ml-2">
                          in <span className="font-semibold">{selectedCategories.join(", ")}</span>
                        </span>
                      )}
                    </p>
                  )}
              </div>
              
              {/* View Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="date">Newest First</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3 py-1"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3 py-1"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>

                {/* Filter Toggle - Mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 lg:hidden"
                >
                  <FilterIcon className="w-4 h-4" />
                  Filters
                  {selectedCategories.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-700">
                      {selectedCategories.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || sortBy !== "relevance") && (
              <div className="flex items-center gap-2 mb-4 md:mb-6 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs">
                    {category}
                    <button
                      onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {sortBy !== "relevance" && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs">
                    Sorted by {sortBy}
                    <button
                      onClick={() => setSortBy("relevance")}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`xl:w-80 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="sticky top-4">
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="xl:hidden"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Filter handleFilterChange={handleFilterChange} selectedCategories={selectedCategories} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-4 md:space-y-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <CourseSkeleton key={idx} viewMode={viewMode} />
                ))}
              </div>
            ) : isEmpty ? (
              <CourseNotFound query={query} />
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
                  : "space-y-4 md:space-y-6"
              }>
                {sortedCourses.map((course) => (
                  <SearchResult key={course._id} course={course} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// 🔹 Course Not Found
const CourseNotFound = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 md:min-h-80 bg-white rounded-lg shadow-lg border p-6 md:p-8">
      <AlertCircle className="text-red-500 h-12 w-12 md:h-16 md:w-16 mb-4" />
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 text-center">
        No courses found for "{query}"
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-6 text-center max-w-md">
        Try adjusting your search terms or browse our courses.
      </p>
      <Link to="/">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
          Browse All Courses
        </Button>
      </Link>
    </div>
  );
};

// ✅ Skeleton Loader
const CourseSkeleton = ({ viewMode }) => {
  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden">
        <div className="p-4 md:p-5">
          <Skeleton className="h-40 md:h-48 w-full rounded-lg mb-3 md:mb-4" />
          <Skeleton className="h-5 md:h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3 md:mb-4" />
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-20 md:w-24 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Skeleton className="h-24 md:h-32 w-full lg:w-48 lg:h-40 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 md:space-y-3">
          <Skeleton className="h-5 md:h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <Skeleton className="h-6 w-20 md:w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
};
