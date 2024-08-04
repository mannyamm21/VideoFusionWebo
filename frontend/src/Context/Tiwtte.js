import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tiwttes: null, // Initialize with an empty object containing likes and dislikes arrays
    loading: false,
    error: false,
};

export const tiwtteSlice = createSlice({
    name: "tiwtte",
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.tiwttes = action.payload;
        },
        fetchFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        like: (state, action) => {
            if (!state.tiwttes.likes.includes(action.payload)) {
                state.tiwttes.likes.push(action.payload);
                state.tiwttes.dislikes.splice(
                    state.tiwttes.dislikes.findIndex(
                        (userId) => userId === action.payload
                    ),
                    1
                );
            }
        },
        dislike: (state, action) => {
            if (!state.tiwttes.dislikes.includes(action.payload)) {
                state.tiwttes.dislikes.push(action.payload);
                state.tiwttes.likes.splice(
                    state.tiwttes.likes.findIndex(
                        (userId) => userId === action.payload
                    ),
                    1
                );
            }
        },
    },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, dislike } = tiwtteSlice.actions;

export default tiwtteSlice.reducer;
