// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     displayName: "",
//     username: "",
//     email: "",
//     uid: ""
// }

// const userSlice = createSlice({
//     name: "user",
//     initialState,
//     reducers: {
//         signInUser: (state, action) => {
//             state.displayName = action.payload.displayName
//             state.username = action.payload.username
//             state.email = action.payload.email
//             state.uid = action.payload.uid
//         },
//         signOutUser: (state) => {
//             state.displayName = ""
//             state.username = ""
//             state.email = ""
//             state.uid = ""
//         }
//     }
// });

// export const { signInUser, signOutUser } = userSlice.actions

// export default userSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    address: string | null;
    walletName: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: UserState = {
    address: null,
    walletName: null,
    isAuthenticated: false,
    loading: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action when connect wallet successfully
        signInSuccess: (state, action: PayloadAction<{ address: string; walletName?: string }>) => {
            state.address = action.payload.address;
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