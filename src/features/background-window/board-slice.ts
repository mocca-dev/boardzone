import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITeamsConfig } from 'features/desktop-window/DesktopWindow';

interface IState {
  teamsConfig: ITeamsConfig;
}

let initialState: IState = {
  teamsConfig: {
    topTeam: {
      name: 'TopTeam',
      member1: { name: '', kills: 0 },
      member2: { name: '', kills: 0 },
      previousMatchPoints: 0,
    },
    bottomTeam: {
      name: 'BottomTeam',
      member1: { name: 'Selecciona a tu compañero', kills: 0 },
      member2: { name: 'Selecciona a tu compañero', kills: 0 },
      previousMatchPoints: 0,
    },
  },
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setTeamsConfig(state, action: PayloadAction<{ config: any }>) {
      state.teamsConfig = action.payload.config;
    },
  },
});

export const { setTeamsConfig } = boardSlice.actions;

export default boardSlice.reducer;
