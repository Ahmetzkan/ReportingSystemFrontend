import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { loadingReducer } from "./store/loading/loadingSlice";
import { authReducer } from "./store/auth/authSlice";
import { userReducer } from "./store/user/userSlice";

const rootReducer = combineReducers({
    loading: loadingReducer,
    auth: authReducer,
    user: userReducer
});

export const globalStore = configureStore({
    reducer: rootReducer,
});