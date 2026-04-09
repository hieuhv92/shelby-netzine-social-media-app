// store/slices/profileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    viewingUser: any | null; // Thông tin user đang xem
    posts: any[];
    loading: boolean;
    error: boolean;
}

const initialState: ProfileState = {
    viewingUser: null,
    posts: [],
    loading: true,
    error: false,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileUser: (state, action) => {
            state.viewingUser = action.payload;
            state.error = false;
        },
        setProfilePosts: (state, action) => {
            state.posts = action.payload;
        },
        setProfileLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setProfileError: (state, action: PayloadAction<boolean>) => {
            state.error = action.payload;
            state.viewingUser = null;
        }
    }
});

export const { setProfileUser, setProfilePosts, setProfileLoading, setProfileError } = profileSlice.actions;
export default profileSlice.reducer;