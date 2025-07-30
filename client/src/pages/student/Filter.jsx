import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Filter as FilterIcon, X } from "lucide-react";

const categories = [
  { id: "javascript", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "nodejs", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "html", label: "HTML/CSS" },
  { id: "mongodb", label: "MongoDB" },
  { id: "web development", label: "Web Development" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "backend development", label: "Backend Development" },
];

const levels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const Filter = ({ handleFilterChange, selectedCategories = [] }) => {
  const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories);
  const [selectedLevels, setSelectedLevels] = useState([]);

  // Sync with parent component
  useEffect(() => {
    setLocalSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryChange = (categoryId) => {
    const newCategories = localSelectedCategories.includes(categoryId)
      ? localSelectedCategories.filter((id) => id !== categoryId)
      : [...localSelectedCategories, categoryId];

    setLocalSelectedCategories(newCategories);
    handleFilterChange(newCategories);
  };

  const handleLevelChange = (levelId) => {
    const newLevels = selectedLevels.includes(levelId)
      ? selectedLevels.filter((id) => id !== levelId)
      : [...selectedLevels, levelId];

    setSelectedLevels(newLevels);
  };

  const clearAllFilters = () => {
    setLocalSelectedCategories([]);
    setSelectedLevels([]);
    handleFilterChange([]);
  };

  const hasActiveFilters = localSelectedCategories.length > 0 || selectedLevels.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4 text-purple-600" />
          <h3 className="font-semibold text-base text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-purple-600 hover:text-purple-700 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card className="border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-purple-800">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={localSelectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="text-purple-600 border-purple-300 focus:ring-purple-500"
              />
              <Label 
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Course Level */}
      <Card className="border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-purple-800">Course Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {levels.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <Checkbox
                id={level.id}
                checked={selectedLevels.includes(level.id)}
                onCheckedChange={() => handleLevelChange(level.id)}
                className="text-purple-600 border-purple-300 focus:ring-purple-500"
              />
              <Label 
                htmlFor={level.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
              >
                {level.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Active Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {localSelectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {localSelectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="bg-purple-200 text-purple-800 text-xs">
                    {categories.find(c => c.id === category)?.label}
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {selectedLevels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedLevels.map((level) => (
                  <Badge key={level} variant="secondary" className="bg-purple-200 text-purple-800 text-xs">
                    {levels.find(l => l.id === level)?.label}
                    <button
                      onClick={() => handleLevelChange(level)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Filter;
