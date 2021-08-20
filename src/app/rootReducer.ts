import { combineReducers } from '@reduxjs/toolkit';
import backgroundReducer from 'features/background-window/background-slice';
import boardSlice from 'features/background-window/board-slice';
import loaderSlice from 'features/desktop-window/loader-slice';
import settingsSlice from 'features/desktop-window/settings-slice';

const rootReducer = combineReducers({
  background: backgroundReducer,
  loader: loaderSlice,
  board: boardSlice,
  settings: settingsSlice,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
