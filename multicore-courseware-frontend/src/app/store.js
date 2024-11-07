import { configureStore } from '@reduxjs/toolkit';

import storage from 'redux-persist/lib/storage'; // Import localStorage
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

import { combineReducers } from 'redux';
import authReducer from '../features/slices/authSlices';

// Combine reducers into a single root reducer
const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here if present
});


const persistConfig = {
    key: 'root',
    storage, // Set storage to localStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
