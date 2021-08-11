import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
  show: boolean;
  text: string;
}

let initialState: LoaderState = {
  show: true,
  text: '',
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setShow(state, action: PayloadAction<{ show: boolean }>) {
      const { show } = action.payload;
      state.show = show;
    },
    setText(state, action: PayloadAction<{ text: string }>) {
      const { text } = action.payload;
      state.text = text;
    },
  },
});

export const { setShow, setText } = loaderSlice.actions;

export default loaderSlice.reducer;
