import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ['articles'],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => '/',
    }),
    createArticle: builder.mutation({
      query: (article) => ({
        body: article,
        url: '/',
        method: 'POST',
      }),
    }),
  }),
});
