import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loggedIn: false,
    },
    reducers: {
        login: (state, action) => {
            const decodedToken = jwtDecode(action.payload.token); // Token'ı decode et
            state.user = {
                webUserId: decodedToken.webUserId,
                role: decodedToken.role,
            };
            state.loggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.loggedIn = false;
        }
    }
});

export const { login, logout } = userSlice.actions;
export const selectUser = state => state.user;
export const selectLoggedIn = state => state.loggedIn;
export default userSlice.reducer;
