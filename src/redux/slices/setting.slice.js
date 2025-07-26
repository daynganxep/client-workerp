import { createSlice } from "@reduxjs/toolkit";
import { getLS } from "@tools/localStorage.tool";

const settingSlice = createSlice({
    name: "setting",
    initialState: getLS("settings", { theme: "light" }),
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        updateTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const settingActions = settingSlice.actions;
export const settingReducer = settingSlice.reducer;
