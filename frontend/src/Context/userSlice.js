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
            if (state.currentUser.subscribedUsers?.includes(action.payload)) {
                state.currentUser.subscribedUsers?.splice(
                    state.currentUser.subscribedUsers?.findIndex(
                        (channelId) => channelId === action.payload
                    ),
                    1
                );
            } else {
                state.currentUser.subscribedUsers?.push(action.payload);
            }
        },
        addSavedVideo: (state, action) => {
            state.currentUser.savedVideos?.push(action.payload);
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, subscription, addSavedVideo, removeSavedVideo } = userSlice.actions;

export default userSlice.reducer;
