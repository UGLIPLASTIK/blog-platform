import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const createArticle = createAsyncThunk(
  'editor/createArticle',
  async function (article, { getState, rejectWithValue }) {
    const token = getState().authentication.user.token;
    try {
      const response = await fetch(`${baseUrl}/articles`, {
        body: JSON.stringify(article),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.message || "Can't create article.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'update/createArticle',
  async function (payload, { getState, rejectWithValue }) {
    const { slug, body } = payload;
    // console.log(body);
    const token = getState().authentication.user.token;
    try {
      console.log('starting update');
      const response = await fetch(`${baseUrl}/articles/${slug}`, {
        body: JSON.stringify(body),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.message || "Can't update article.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    editing: false,
    newArticle: null,
    editedArticle: null,
    loading: false,
  },
  selectors: {
    loading: (state) => state.loading,
    newArticle: (state) => state.newArticle,
    editing: (state) => state.editing,
  },
  reducers: {
    resetState: (state) => {
      state.editing = false;
      state.newArticle = null;
      state.editedArticle = null;
      state.loading = false;
    },
    startEdit: (state) => {
      state.editing = true;
    },
    startCreate: (state) => {
      state.editing = false;
      state.editedArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;

        state.newArticle = action.payload;
      })
      .addCase(createArticle.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.newArticle = action.payload;
      })
      .addCase(updateArticle.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { loading, newArticle, editing } = editorSlice.selectors;
export const { resetState, startEdit, startCreate } = editorSlice.actions;
export default editorSlice.reducer;
