import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    address: string | null;
    userId: string | null;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    walletName: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: UserState = {
    address: null,
    userId: null,
    username: null,
    display_name: null,
    avatar_url: null,
    walletName: null,
    isAuthenticated: false,
    loading: true,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action when login or connect wallet
        signInSuccess: (state, action) => {
            state.userId = action.payload.userId;
            state.address = action.payload.address;
            state.username = action.payload.username;
            state.display_name = action.payload.display_name;
            state.avatar_url = action.payload.avatar_url;
            state.walletName = action.payload.walletName || null;
            state.isAuthenticated = true;
            state.loading = false;
        },

        // Action when logout or disconnect wallet
        signOutUser: (state) => {
            state.address = null;
            state.walletName = null;
            state.isAuthenticated = false;
        },

        // Action to turn on the loading state when waiting for connect the wallet
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { signInSuccess, signOutUser, setLoading } = userSlice.actions;

export default userSlice.reducer;
