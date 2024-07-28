import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token'),
    is_user:localStorage.getItem('is_user')===true,
    username:localStorage.getItem('username'),
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const token = action.payload.token;
            localStorage.setItem('token', token)
            state.token = token;
        },
        logoutUser: (state) => {
            state.token = null
            state.user = null;
            state.is_user=null;
            state.username=null;
            localStorage.clear('token');
            localStorage.clear('is_user');
            localStorage.clear('username');
        },
        fetchUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('is_user', !action.payload.is_superuser)
            localStorage.setItem('username', action.payload.username)
            state.is_user = !action.payload.is_superuser;
            state.username = action.payload.username;
            console.log(action.payload)
        },
    },
})

export default authSlice.reducer;
export const { loginUser, fetchUser, logoutUser } = authSlice.actions;