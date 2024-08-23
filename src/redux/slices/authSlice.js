import { createSlice } from "@reduxjs/toolkit";

// Get user and token from localStorage
const initialState = {
    user: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null,
    isSidebarOpen: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState, // Use the initialState defined at the top
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            if (user && token) {
                state.user = user;
                state.token = token;
                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(user));
            } else {
                console.error('setCredentials payload is missing user or token:', action.payload);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        },
        openSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        }
    },
});


export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;
export default authSlice.reducer;
