import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "session",
  initialState: {
    userAddress: undefined,
    token: undefined,
  },
  reducers: {
    setUserAddress: (state, action) => {
      state.userAddress = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    disconnectUser: (state) => {
      state.userAddress = undefined;
      state.token = undefined;
    },
  },
});

export const { setUserAddress, setToken, disconnectUser } =
  counterSlice.actions;

export default counterSlice.reducer;
