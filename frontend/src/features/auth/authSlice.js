import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Safely read stored user (remove invalid values)
let user = null;
const _stored = localStorage.getItem('user');
if (_stored) {
  try {
    user = JSON.parse(_stored);
  } catch (err) {
    // invalid JSON in localStorage -> remove it to avoid immediate redirects/errors
    localStorage.removeItem('user');
    user = null;
  }
}

const initialState = {
  user: user || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register new user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          (error.response.data?.message || error.response.data)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.login(userData);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          (error.response.data?.message || error.response.data)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  // authService.logout should clear storage, but ensure it:
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error?.message || 'Register failed';
        state.user = null;
      })

      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error?.message || 'Login failed';
        state.user = null;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;