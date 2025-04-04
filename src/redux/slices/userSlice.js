import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});
        
export const { setProfile, updateProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;