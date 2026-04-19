// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string | null;
  name: string | null;
  _id: string | null;
  profilePicUrl?: string | null;
}

const initialState: User = {
  email: null,
  name: null,
  _id: null,
  profilePicUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        email: string;
        name: string;
        _id: string;
      }>,
    ) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state._id = action.payload._id;
    },
    setProfilePic: (
      state,
      action: PayloadAction<{
        profilePicUrl: string;
      }>,
    ) => {
      state.profilePicUrl = action.payload.profilePicUrl;
    },

    clearUser: (state) => {
      state.email = null;
      state.name = null;
      state._id = null;
    },
  },
});

export const { setUser, setProfilePic, clearUser } = userSlice.actions;
export default userSlice.reducer;
