import { configureStore } from '@reduxjs/toolkit';
import assessmentReducer from './assessmentSlice';
import editorReducer from './editorSlice';
import securityReducer from './securitySlice';

export const store = configureStore({
  reducer: {
    assessment: assessmentReducer,
    editor: editorReducer,
    security: securityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;