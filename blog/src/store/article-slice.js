import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async function (offset, { rejectWithValue, getState }) {
    const token = getState().authentication.user?.token || null;
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Token ${token}`;
      }
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/?offset=${offset}&limit=5`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error("Can't get articles.");
      }
      const articles = await response.json();
      return articles;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchArticle = createAsyncThunk(
  'articles/fetchArticle',
  async function (slug, { rejectWithValue, getState }) {
    const token = getState().authentication.user?.token || null;
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Token ${token}`;
      }
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        throw new Error("Can't get article.");
      }
      const article = await response.json();
      return article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async function (slug, { rejectWithValue, getState }) {
    const token = getState().authentication.user.token;
    try {
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.message || "Can't delete article.");
      }
      return slug;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavoriteArticle = createAsyncThunk(
  'articles/makeFavorite',
  async function (payload, { rejectWithValue, getState }) {
    const { slug, favorited } = payload;
    const token = getState().authentication.user.token;
    const method = favorited ? 'POST' : 'DELETE';
    try {
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Can't add article favorite or unfavorite.");
      }
      const article = await response.json();
      return article;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    pagination: { offset: 0, currentPage: 1, total: null },
    chosenArticle: null,
    articles: [],
    loading: false,
    error: false,
  },
  selectors: {
    articles: (state) => state.articles,
    chosenArticle: (state) => state.chosenArticle,
    pagination: (state) => state.pagination,
    loading: (state) => state.loading,
  },
  reducers: {
    changePage: (state, action) => {
      state.pagination.currentPage = action.payload;
      let newOffset = 0;
      for (let index = 1; index < state.pagination.currentPage; index++) {
        newOffset += 5;
      }
      state.pagination.offset = newOffset;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.pagination.total = action.payload.articlesCount;
        state.articles = action.payload.articles;
        state.loading = false;
      })
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.chosenArticle = action.payload.article;
        state.loading = false;
      })
      .addCase(toggleFavoriteArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleFavoriteArticle.fulfilled, (state) => {
        state.loading = false;
        // state.chosenArticle = action.payload.article;
      })
      .addCase(toggleFavoriteArticle.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { changePage } = articleSlice.actions;
export const { articles, chosenArticle, pagination, loading } = articleSlice.selectors;
export default articleSlice.reducer;
