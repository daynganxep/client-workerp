import {createSlice} from "@reduxjs/toolkit";
import {getLS} from "@tools/localStorage.tool";

const authSlice = createSlice({
    name: "auth",
    initialState: getLS("auth", {
        tokens: {accessToken: "", refreshToken: ""},
        user: null,
        isLoging: false,
        redirect: "/",
    }),
    reducers: {
        setTokens: (state, {payload}) => {
            state.tokens.accessToken = payload.accessToken;
            state.tokens.refreshToken = payload.refreshToken;
        },
        setRefreshTokens: (state, {payload}) => {
            state.tokens.refreshToken = payload;
        },
        setAccessToken: (state, {payload}) => {
            state.tokens.accessToken = payload;
        },
        clearTokens: (state) => {
            state.tokens = {accessToken: "", refreshToken: ""};
        },
        setUser: (state, {payload}) => {
            state.user = payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setIsLogin: (state, {payload}) => {
            state.isLoging = payload;
        },
        setRedirect: (state, {payload}) => {
            state.redirect = payload;
        },
        setRoles: (state, {payload}) => {
            state.user.roles = payload;
        },
    },
});

export const {
    setTokens,
    setRefreshTokens,
    setAccessToken,
    clearTokens,
    setUser,
    clearUser,
    setIsLogin,
    setRedirect,
    setRoles,
} = authSlice.actions;

export default authSlice.reducer;
