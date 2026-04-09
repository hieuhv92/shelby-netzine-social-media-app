import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    commentModalOpen: boolean;
    commentPostDetails: any;
    postModalOpen: boolean;
    editProfileModalOpen: boolean;
}

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
    },
    postModalOpen: false,
    editProfileModalOpen: false,
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
        },
        openPostModal: (state) => {
            state.postModalOpen = true;
        },
        closePostModal: (state) => {
            state.postModalOpen = false;
        },
        openEditProfileModal: (state) => {
            state.editProfileModalOpen = true;
        },
        closeEditProfileModal: (state) => {
            state.editProfileModalOpen = false;
        },
    }
});

export const {
    openSignUpModal,
    closeSignUpModal,
    openLoginModal,
    closeLogInModal,
    openCommentModal,
    closeCommentModal,
    setCommentDetails,
    openPostModal,
    closePostModal,
    openEditProfileModal,
    closeEditProfileModal
} = modalSlice.actions

export default modalSlice.reducer
