import { createSlice } from '@reduxjs/toolkit';


export const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: {
            savedVideos: [], // Ensure savedVideos is initialized as an array
            currentUser: null,
            loading: false,
            error: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            console.log("Login Success: ", state.currentUser); // Debugging log
        },
        loginFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        subscription: (state, action) => {
            if (state.currentUser.data.user.subscribedUsers?.includes(action.payload)) {
                state.currentUser.data.user.subscribedUsers?.splice(
                    state.currentUser.data.user.subscribedUsers?.findIndex(
                        (channelId) => channelId === action.payload
                    ),
                    1
                );
            } else {
                state.currentUser.data.user.subscribedUsers?.push(action.payload);
            }
        },
        addSavedVideo: (state, action) => {
            state.currentUser.data.user.savedVideos?.push(action.payload);
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, subscription, addSavedVideo, removeSavedVideo } = userSlice.actions;

export default userSlice.reducer;
