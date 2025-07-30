// import {configureStore} from "@reduxjs/toolkit" 
// import rootRedcuer from "./rootRedcuer";
// import { authApi } from "@/features/api/authApi";
// import { courseApi } from "@/features/api/courseApi";
// import { purchaseApi } from "@/features/api/purchaseApi";
// import { courseProgressApi } from "@/features/api/courseProgressApi";

// export const appStore = configureStore({
//     reducer: rootRedcuer,
//     middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
// });

// const initializeApp = async () => {
//     await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
// }
// initializeApp();

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; 


import { authApi, instructorApi } from "../features/api/authApi";
import { courseApi } from "../features/api/courseApi";
import { purchaseApi } from "../features/api/purchaseApi";
import { courseProgressApi } from "../features/api/courseProgressApi";

// Configure Redux store
export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      instructorApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware
    ),
});

// Optionally preload user data
const initializeApp = async () => {
  try {
    await appStore.dispatch(
      authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
    );
  } catch (error) {
    console.error("Failed to load user on startup:", error);
  }
};

initializeApp();
