import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation, matchPath, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineClipboardCheck,
  HiOutlineUserAdd,
  HiOutlineChevronRight,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineArrowUp,
  HiOutlineArrowDown
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useGetSuperAdminDashboardQuery, useUpdateUserRoleMutation } from '../../features/api/authApi';

// Register Chart.js components only once
if (!ChartJS.registry.controllers.line) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );
}

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { superAdminId } = useParams();
  const { user, isAuthenticated, role } = useSelector((store) => store.auth);
  const isNestedRoute = matchPath('/superadmin-dashboard/:superAdminId/:child', location.pathname) && location.pathname !== `/superadmin-dashboard/${superAdminId}`;
  const [timeframe, setTimeframe] = useState('monthly');

  // Role-based access control
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (role !== 'superAdmin') {
      console.log('❌ Access denied: User role is not superAdmin');
      navigate('/');
      return;
    }

    if (user?._id !== superAdminId) {
      console.log('❌ Access denied: SuperAdmin trying to access another dashboard');
      navigate('/');
      return;
    }
  }, [isAuthenticated, role, user?._id, superAdminId, navigate]);

  // Use RTK Query hook for dashboard data with superAdmin ID
  const { data: dashboardData, isLoading, error, refetch } = useGetSuperAdminDashboardQuery(
    { timeframe, superAdminId },
    { 
      skip: !isAuthenticated || role !== 'superAdmin' || user?._id !== superAdminId 
    }
  );

  // Role update functionality
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [roleChangeUserId, setRoleChangeUserId] = useState('');
  const [newRole, setNewRole] = useState('student');

  const handleRoleChange = async () => {
    if (!roleChangeUserId || !newRole) {
      alert('Please enter both User ID and select a role');
      return;
    }

    try {
      await updateUserRole({ userId: roleChangeUserId, newRole }).unwrap();
      alert(`User role updated to ${newRole} successfully!`);
      setRoleChangeUserId('');
      setNewRole('student');
    } catch (error) {
      alert(`Failed to update role: ${error.data?.message || error.message}`);
    }
  };

  // Debug logging
  console.log('🔍 SuperAdmin Dashboard Debug:', {
    superAdminId,
    timeframe,
    isLoading,
    error,
    dashboardData,
    hasData: !!dashboardData,
    dataKeys: dashboardData ? Object.keys(dashboardData) : null
  });

  const stats = dashboardData?.data || {
    totalStudents: 0,
    totalInstructors: 0,
    totalSuperAdmins: 0,
    myInstructors: [],
    recentUsers: [],
    studentGrowth: 5.2,
    instructorGrowth: 3.1,
    courseGrowth: 8.4,
    batchGrowth: -2.5
  };

  const handleRefresh = async () => {
    refetch();
  };

  // Dynamic chart data based on timeframe
  const getLabels = () => {
    if (timeframe === 'weekly') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (timeframe === 'monthly') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else {
      return ['2020', '2021', '2022', '2023', '2024', '2025'];
    }
  };

  // Sample data for charts
  const lineChartData = {
    labels: getLabels().slice(0, 6),
    datasets: [
      {
        label: 'Student Registrations',
        data: timeframe === 'weekly'
          ? [65, 59, 80, 81, 56, 55, 72]
          : timeframe === 'monthly'
            ? [65, 59, 80, 81, 56, 55]
            : [120, 250, 380, 440, 510, 620],
        fill: false,
        borderColor: 'rgb(168, 85, 247)',
        tension: 0.1
      }
    ]
  };

  const barChartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Course Enrollments',
        data: timeframe === 'weekly'
          ? [12, 19, 3, 5, 2, 3, 9]
          : timeframe === 'monthly'
            ? [30, 45, 22, 18, 36, 41, 28, 19, 25, 33, 40, 50]
            : [220, 350, 420, 510, 650, 720],
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1
      }
    ]
  };

  const pieChartData = {
    labels: ['Web Dev', 'Mobile Dev', 'Data Science', 'UI/UX', 'DevOps'],
    datasets: [
      {
        label: 'Course Distribution',
        data: [30, 20, 25, 15, 10],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(109, 40, 217, 0.8)',
          'rgba(91, 33, 182, 0.8)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center" role="alert">
          <HiOutlineExclamationCircle className="w-6 h-6 mr-2" />
          <span className="block sm:inline">Failed to load dashboard data. Please try again later.</span>
          <button
            onClick={handleRefresh}
            className="ml-auto bg-red-200 hover:bg-red-300 text-red-800 py-1 px-3 rounded flex items-center"
          >
            <HiOutlineRefresh className="w-4 h-4 mr-1" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    isNestedRoute ? (
      <Outlet />
    ) : (
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your instructors and view platform analytics</p>
          </div>
          <Link
            to={`/superadmin-dashboard/${superAdminId}/instructor`}
            className="flex items-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 shadow transition-colors duration-200"
          >
            <HiOutlineUserAdd className="mr-3 h-6 w-6" />
            Create New Instructor
          </Link>
        </div>

        {/* Role Change Section - For Testing */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔧 Role Change Tool (Testing)</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-yellow-700 mb-1">User ID:</label>
              <input
                type="text"
                value={roleChangeUserId}
                onChange={(e) => setRoleChangeUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-yellow-700 mb-1">New Role:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="superAdmin">SuperAdmin</option>
              </select>
            </div>
            <button
              onClick={handleRoleChange}
              disabled={isUpdatingRole}
              className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingRole ? 'Updating...' : 'Change Role'}
            </button>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            💡 Use this tool to change user roles for testing. Current user ID: {user?._id}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white shadow rounded-lg p-6 transition-all duration-200"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-purple-500">{stats.totalStudents}+</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-green-600 flex items-center">
                    <HiOutlineArrowUp className="w-3 h-3 mr-1" />
                    {stats.studentGrowth}% growth
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <HiOutlineUsers className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white shadow rounded-lg p-6 transition-all duration-200"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">My Instructors</p>
                <p className="text-3xl font-bold text-purple-500">{stats.myInstructors.length}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-green-600 flex items-center">
                    <HiOutlineArrowUp className="w-3 h-3 mr-1" />
                    {stats.instructorGrowth}% growth
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <HiOutlineUserGroup className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to={`/superadmin-dashboard/${superAdminId}/instructor`} className="text-sm text-purple-600 hover:text-purple-500 flex items-center">
                View My Instructors
                <HiOutlineChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white shadow rounded-lg p-6 transition-all duration-200"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold text-purple-500">0+</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-green-600 flex items-center">
                    <HiOutlineArrowUp className="w-3 h-3 mr-1" />
                    {stats.courseGrowth}% growth
                  </span>
                </div>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <HiOutlineBookOpen className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white shadow rounded-lg p-6 transition-all duration-200"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Verifications</p>
                <p className="text-3xl font-bold text-purple-500">0+</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-red-600 flex items-center">
                    <HiOutlineArrowDown className="w-3 h-3 mr-1" />
                    {Math.abs(stats.batchGrowth)}% decrease
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <HiOutlineClipboardCheck className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Student Registrations</h3>
              <div className="flex items-center text-sm text-gray-500">
                <HiOutlineChartBar className="w-5 h-5 mr-1 text-purple-500" />
                Growth Trend
              </div>
            </div>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    backgroundColor: 'rgba(107, 33, 168, 0.8)',
                    titleFont: {
                      size: 14,
                      weight: 'bold'
                    },
                    bodyFont: {
                      size: 13
                    },
                    padding: 12,
                    displayColors: false
                  }
                }
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Course Distribution</h3>
              <div className="flex items-center text-sm text-gray-500">
                <HiOutlineChartPie className="w-5 h-5 mr-1 text-purple-500" />
                % Distribution
              </div>
            </div>
            <div className="flex justify-center">
              <div style={{ height: '250px', width: '250px' }}>
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        backgroundColor: 'rgba(107, 33, 168, 0.8)',
                        titleFont: {
                          size: 14,
                          weight: 'bold'
                        },
                        bodyFont: {
                          size: 13
                        },
                        padding: 12
                      }
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* My Instructors List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">My Instructors ({stats.myInstructors.length})</h3>
            <Link to={`/superadmin-dashboard/${superAdminId}/instructor`} className="text-sm text-purple-600 hover:text-purple-500 flex items-center">
              View All
              <HiOutlineChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {stats.myInstructors.length === 0 ? (
              <div className="text-center py-8">
                <HiOutlineUserGroup className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No instructors yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first instructor</p>
                <Link
                  to={`/superadmin-dashboard/${superAdminId}/instructor`}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <HiOutlineUserAdd className="w-4 h-4 mr-2" />
                  Create Instructor
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.myInstructors.slice(0, 5).map((instructor) => (
                    <tr key={instructor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-800 font-medium">
                                {instructor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {instructor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(instructor.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
                </motion.div>
      </div>
    )
  );
  };

export default SuperAdminDashboard;
