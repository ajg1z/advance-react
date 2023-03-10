import { TokenLocalStorageKey } from 'shared/const/localStorage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { AuthResponse } from 'features/AuthByUsername';
import { User } from '../../types/userSchema';

export const checkAuth = createAsyncThunk<User, undefined, ThunkConfig<number>>(
    'user/checkAuth',
    async (_, thunkApi) => {
        try {
            const { extra } = thunkApi;

            const response = await extra.privateApi.get<AuthResponse>('/check-login');

            if (!response.data || !response.data.user || !response.data.token) throw new Error();

            localStorage.setItem(TokenLocalStorageKey, response.data.token);

            return response.data.user;
        } catch (e) {
            console.log(e);
            return thunkApi.rejectWithValue(400);
        }
    },
);
