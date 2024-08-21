import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    isSidebarOpen: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
        },
        setOpenSidebar: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
