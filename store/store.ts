import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
export const storenew = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

export type RootnewState = ReturnType<typeof storenew.getState>;
export type AppnewDispatch = typeof storenew.dispatch;
