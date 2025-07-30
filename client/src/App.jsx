import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedRoute, SuperAdminDashboardRoute, AuthenticatedUser } from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { AdminRoute } from "./components/ProtectedRoutes";

// Pages
import Login from "./pages/Login";
import SocialSuccess from "./pages/SocialSuccess";
import Content from "./pages/student/Content";
import Course from "./pages/student/Course";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import Courses from "./pages/student/Courses";
import ElearnCards from "./pages/student/ElearnCards";
import Filter from "./pages/student/Filter";
import Footer from "./pages/student/Footer";
import HeroSection from "./pages/student/HeroSection";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import SearchPage from "./pages/student/SearchPage";
import SearchResult from "./pages/student/SearchResult";
import ThreeScene from "./pages/student/ThreeScene";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Sidebar from "./pages/admin/Sidebar";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import Instructor from "./pages/admin/instructor";

// Layout
import MainLayout from "./layout/MainLayout";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Content />
            <Courses />
            <ElearnCards />
            <Footer />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "social-success",
        element: <SocialSuccess />,
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ErrorBoundary>
              <Profile />
            </ErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "superadmin-dashboard/:superAdminId",
        element: (
          <SuperAdminDashboardRoute>
            <SuperAdminDashboard />
          </SuperAdminDashboardRoute>
        ),
        children: [
          {
            path: "instructor",
            element: <Instructor />,
          },
        ],
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <ErrorBoundary>
              <CourseDetail />
            </ErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <ErrorBoundary>
                <CourseProgress />
              </ErrorBoundary>
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },

    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <ErrorBoundary>
          <RouterProvider router={appRouter} />
        </ErrorBoundary>
      </ThemeProvider>
    </main>
  );
}

export default App;