import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/";
const INSTRUCTOR_API = "http://localhost:8080/api/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 🔹 User Registration
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),

    // 🔹 SuperAdmin Registration
    registerSuperAdmin: builder.mutation({
      query: (inputData) => ({
        url: "superadmin/register",
        method: "POST",
        body: inputData,
      }),
    }),

    // 🔹 User Login
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error("User login failed", error);
        }
      },
    }),

    // 🔹 Logout
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),

    // 🔹 Load Authenticated User
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error("Load user failed", error);
        }
      },
    }),

    // 🔹 Update Profile
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
      }),
    }),

    // 🔹 Update User Role (for testing)
    updateUserRole: builder.mutation({
      query: ({ userId, newRole }) => ({
        url: "update-role",
        method: "PUT",
        body: { userId, newRole },
      }),
    }),
  }),
});

// Create a separate API for instructor management
export const instructorApi = createApi({
  reducerPath: "instructorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: INSTRUCTOR_API,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 🔹 SuperAdmin: Create Instructor
    createInstructor: builder.mutation({
      query: (inputData) => ({
        url: "instructor",
        method: "POST",
        body: inputData,
      }),
    }),

    // 🔹 SuperAdmin: Get All Instructors (filtered by superAdmin)
    getAllInstructors: builder.query({
      query: () => ({
        url: "instructor",
        method: "GET",
      }),
    }),

    // 🔹 SuperAdmin: Get Dashboard Data
    getSuperAdminDashboard: builder.query({
      query: ({ timeframe = 'monthly', superAdminId }) => ({
        url: `admin/dashboard?timeframe=${timeframe}&superAdminId=${superAdminId}`,
        method: "GET",
      }),
    }),
  }),
});

// ✅ Exporting hooks for components
export const {
  useRegisterUserMutation,
  useRegisterSuperAdminMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} = authApi;

export const {
  useCreateInstructorMutation,
  useGetAllInstructorsQuery,
  useGetSuperAdminDashboardQuery,
} = instructorApi;
