import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config/index'
import { setUser, setAccessToken, setRefreshToken, setIsAuthenticated, resetRegistered } from '../slices/authSlices';
import axios from 'axios';

export const register = createAsyncThunk(
    '/accounts/sign-up/',
    async ({ first_name, last_name, email, mobile, password, otp }, thunkAPI) => {
        const body = {
            first_name,
            last_name,
            email,
            mobile,
            password,
            otp,
            otp_token: "k6vj53uo8tb5ruh4b9t32o(bkcewvxuoj*xr(5-2unua_o(gee",
            country_code: "91"
        };

        try {
            const response = await axios.post(`${API_URL}/accounts/sign-up/`, body);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const getUser = createAsyncThunk('/accounts/user-info/', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const { accessToken } = state.auth;

        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const response = await axios.get(`${API_URL}/accounts/user-info/`, config);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const login = createAsyncThunk(
    '/api/token/',
    async ({ mobile, password }, thunkAPI) => {
        const body = {
            mobile,
            password,
        };

        try {
            const response = await axios.post(`${API_URL}/api/token/`, body);
            const data = response.data;

            if (response.status === 200) {
                const { dispatch } = thunkAPI;

                dispatch(setAccessToken(data.access));
                dispatch(setRefreshToken(data.refresh));
                dispatch(setIsAuthenticated(true));

                dispatch(getUser());

                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const logout = createAsyncThunk('/accounts/logout/', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const { refreshToken, accessToken } = state.auth;

        const body = {
            refresh_token: refreshToken
        };


        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const response = await axios.post(`${API_URL}/accounts/logout/`, body, config);

        if (response.status === 205) {
            localStorage.clear(); // Call your utility function to clear local storage
            return response.data;
        } else {
            return thunkAPI.rejectWithValue(response.data);
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});