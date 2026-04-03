import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    signUpModalOpen: false,
    logInModalOpen: false,
    commentModalOpen: false,
    commentPostDetails: {
        displayName: "",
        username: "",
        userId: "",
        caption: "",
        shelbyFileUrl: "",
        postId: ""
    }
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openSignUpModal: (state) => {
            state.signUpModalOpen = true;
        },
        closeSignUpModal: (state) => {
            state.signUpModalOpen = false;
        },
        openLoginModal: (state) => {
            state.logInModalOpen = true;
        },
        closeLogInModal: (state) => {
            state.logInModalOpen = false;
        },
        openCommentModal: (state) => {
            state.commentModalOpen = true;
        },
        closeCommentModal: (state) => {
            state.commentModalOpen = false;
        },
        setCommentDetails: (state, action) => {
            state.commentPostDetails.username = action.payload.username;
            state.commentPostDetails.displayName = action.payload.displayName;
            state.commentPostDetails.userId = action.payload.userId;
            state.commentPostDetails.caption = action.payload.caption;
            state.commentPostDetails.shelbyFileUrl = action.payload.shelbyFileUrl;
            state.commentPostDetails.postId = action.payload.postId;
        }
    }
});

export const {
    openSignUpModal,
    closeSignUpModal,
    openLoginModal,
    closeLogInModal,
    openCommentModal,
    closeCommentModal,
    setCommentDetails
} = modalSlice.actions

export default modalSlice.reducer
