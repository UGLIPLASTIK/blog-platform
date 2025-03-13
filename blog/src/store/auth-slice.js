import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const registerNewUser = createAsyncThunk(
  'authentication/registerUser',
  async function (user, { rejectWithValue }) {
    try {
      const response = await fetch(`https://blog-platform.kata.academy/api/users`, {
        body: JSON.stringify(user),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.message || "Can't register user.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk('authentication/loginUser', async function (user, { rejectWithValue }) {
  try {
    const response = await fetch(`https://blog-platform.kata.academy/api/users/login`, {
      body: JSON.stringify(user),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.message || "Can't login user.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk(
  'authentication/updateUser',
  async function (userData, { getState, rejectWithValue }) {
    const token = getState().authentication.user.token;

    try {
      const response = await fetch(`https://blog-platform.kata.academy/api/user`, {
        body: JSON.stringify({ user: userData }),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.message || "Can't update user.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'authentication',
  initialState: { user: null, isAuth: false, error: null, loading: false },
  selectors: {
    userState: (state) => state,
    user: (state) => state.user,
    isAuth: (state) => state.isAuth,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerNewUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = action.payload;
      })
      .addCase(registerNewUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('persist/REHYDRATE', (state, action) => {
        state.user = action.payload?.auth?.user || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default authSlice.reducer;
export const { getData, logout } = authSlice.actions;
export const { user, isAuth, error, loading, userState } = authSlice.selectors;
