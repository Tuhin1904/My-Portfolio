import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { setTokens } from "./AuthSlice";
import { setUser, setProfilePic } from "./UserInfo";

export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (payload: any, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiRequest({
        method: "POST",
        url: apiEndpoints.signIn,
        data: payload,
      });

      const data = res.data;
      
      // Dispatch actions to update state
      dispatch(setUser({
        _id: data?.user?._id,
        email: data?.user?.email,
        name: data?.user?.name,
        userRole: data?.user?.userRole,
      }));
      dispatch(setTokens({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      }));
      dispatch(setProfilePic({
        profilePicUrl: data?.user?.profilePicUrl || "",
      }));

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Login failed");
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: { email: string; otp: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await apiRequest({
        method: "POST",
        url: apiEndpoints.verifyOtp,
        data: payload,
      });

      const data = res.data;

      // Dispatch actions to update state
      dispatch(setUser({
        _id: data?.user?._id,
        email: data?.user?.email,
        name: data?.user?.name,
        userRole: data?.user?.userRole,
      }));
      dispatch(setTokens({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      }));
      dispatch(setProfilePic({
        profilePicUrl: data?.user?.profilePicUrl || "",
      }));

      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Verification failed");
    }
  }
);
