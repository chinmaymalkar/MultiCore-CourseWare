import { createSlice } from '@reduxjs/toolkit';
import { register, login, getUser, checkAuth, logout } from '../actions/authActions';

const initialState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    registered: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetRegistered: (state) => {
            state.registered = false;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(register.pending, state => {
                state.loading = true;
            })
            .addCase(register.fulfilled, state => {
                state.loading = false;
                state.registered = true;
            })
            .addCase(register.rejected, state => {
                state.loading = false;
            })
            .addCase(login.pending, state => {
                state.loading = true;
            })
            .addCase(login.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, state => {
                state.loading = false;
            })
            .addCase(getUser.pending, state => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, state => {
                state.loading = false;
            })
            .addCase(logout.pending, state => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logout.rejected, state => {
                state.loading = false;
            });
    },
});

export const { resetRegistered, setAccessToken, setRefreshToken, setUser, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;

