import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    displayName: "",
    username: "",
    email: "",
    uid: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInUser: (state, action) => {
            state.displayName = action.payload.displayName
            state.username = action.payload.username
            state.email = action.payload.email
            state.uid = action.payload.uid
        },
        signOutUser: (state) => {
            state.displayName = ""
            state.username = ""
            state.email = ""
            state.uid = ""
        }
    }
});

export const { signInUser, signOutUser } = userSlice.actions

export default userSlice.reducer