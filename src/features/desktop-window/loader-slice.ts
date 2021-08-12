import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
  show: boolean;
  text: string;
}

let initialState: LoaderState = {
  show: true,
  text: 'Waiting for data...',
};

let loaderCount = 0;

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setShow(state, action: PayloadAction<{ show: boolean }>) {
      const { show } = action.payload;

      if (show) {
        loaderCount++;
        state.show = true;
      } else {
        if (loaderCount <= 0) state.show = false;
        loaderCount--;
      }
    },
    setText(state, action: PayloadAction<{ text: string }>) {
      const { text } = action.payload;
      state.text = text;
    },
  },
});

export const { setShow, setText } = loaderSlice.actions;

export default loaderSlice.reducer;
