import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth-slice';
import articleReducer from './article-slice';
import editorReducer from './editor-slice';

const paginationTransform = createTransform(
  (inboundState, key) => {
    if (key === 'articles') {
      return {
        pagination: inboundState.pagination,
      };
    }
    return inboundState;
  },

  (outboundState, key) => {
    if (key === 'articles') {
      return {
        ...outboundState,
        chosenArticle: null,
        articles: [],
        loading: false,
        error: false,
      };
    }
    return outboundState;
  },

  { whitelist: ['articles'] }
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authentication', 'articles'],
  transforms: [paginationTransform],
};

const rootReducer = combineReducers({
  articles: articleReducer,
  authentication: authReducer,
  editor: editorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REGISTER', 'persist/REHYDRATE'],
      },
    }),
});
const persistor = persistStore(store);

export { store, persistor };
