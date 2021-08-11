import { combineReducers } from '@reduxjs/toolkit';
import backgroundReducer from 'features/background-window/background-slice';
import loaderSlice from 'features/desktop-window/loader-slice';

const rootReducer = combineReducers({
  background: backgroundReducer,
  loader: loaderSlice,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
