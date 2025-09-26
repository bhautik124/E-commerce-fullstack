import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};
export const userSlice = createSlice({
  name: "getUser",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { getUser } = userSlice.actions;

export default userSlice.reducer;
