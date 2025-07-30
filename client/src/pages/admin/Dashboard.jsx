// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
// import React from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

//   if (isLoading) return <h1>Loading...</h1>;
//   if (isError) return <h1 className="text-red-500">Failed to get purchased courses</h1>;

//   // Ensure fallback to empty array if undefined
//   const purchasedCourse = data?.purchasedCourse || [];

//   const courseData = purchasedCourse.map((course) => ({
//     name: course.courseId?.courseTitle || "Unknown",
//     price: course.courseId?.coursePrice || 0,
//   }));

//   const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
//   const totalSales = purchasedCourse.length;

//   return (
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Sales</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
//         </CardContent>
//       </Card>

//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Revenue</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
//         </CardContent>
//       </Card>

//       {/* Course Prices Chart */}
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-gray-700">Course Prices</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={courseData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//               <XAxis
//                 dataKey="name"
//                 stroke="#6b7280"
//                 angle={-30}
//                 textAnchor="end"
//                 interval={0}
//               />
//               <YAxis stroke="#6b7280" />
//               <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
//               <Line
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#4a90e2"
//                 strokeWidth={3}
//                 dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to fetch course data</h1>;

  const enrolledCourses = data?.purchasedCourse || [];

  // Group by course and count enrollments
  const courseEnrollments = enrolledCourses.reduce((acc, curr) => {
    const title = curr.courseId?.courseTitle || "Unknown";
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const courseData = Object.entries(courseEnrollments).map(([name, count]) => ({
    name,
    count,
  }));

  const totalEnrollments = enrolledCourses.length;
  const mostPopularCourse = courseData.reduce((max, curr) =>
    curr.count > max.count ? curr : max,
    { name: "N/A", count: 0 }
  );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Total Enrollments */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{totalEnrollments}</p>
        </CardContent>
      </Card>

      {/* Most Popular Course */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Most Enrolled Course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-gray-700">
            {mostPopularCourse.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {mostPopularCourse.count} Enrollments
          </p>
        </CardContent>
      </Card>

      {/* Enrollments by Course - Bar Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Enrollments by Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courseData.length === 0 ? (
            <p className="text-muted-foreground text-center">No enrollment data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" />
                <Tooltip formatter={(value) => `${value} Enrollments`} />
                <Bar dataKey="count" fill="#4ade80" barSize={30} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
