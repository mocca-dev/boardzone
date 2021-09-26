import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITeamsConfig } from 'features/desktop-window/DesktopWindow';

interface IState {
  teamsConfig: ITeamsConfig;
}

let initialState: IState = {
  teamsConfig: {
    topTeam: {
      name: 'TopTeam',
      member1: { name: '', kills: 0, armor: 0, cash: 0 },
      member2: { name: '', kills: 0, armor: 0, cash: 0 },
      previousMatchPoints: 0,
    },
    bottomTeam: {
      name: 'BottomTeam',
      member1: {
        name: 'Selecciona a tu compañero',
        kills: 0,
        armor: 0,
        cash: 0,
      },
      member2: {
        name: 'Selecciona a tu compañero',
        kills: 0,
        armor: 0,
        cash: 0,
      },
      previousMatchPoints: 0,
    },
  },
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setTeamsConfig(state, action: PayloadAction<any>) {
      if (action.payload.config) {
        state.teamsConfig = action.payload.config;
      }
    },
    resetTeamsConfig(state, action: PayloadAction<any>) {
      let freshState = JSON.parse(JSON.stringify(initialState));
      if (action.payload) {
        freshState.teamsConfig.topTeam.previousMatchPoints =
          action.payload.topPrevPoints;
        freshState.teamsConfig.bottomTeam.previousMatchPoints =
          action.payload.bottomPrevPoints;
      }
      state.teamsConfig = freshState.teamsConfig;
    },
  },
});

export const { setTeamsConfig, resetTeamsConfig } = boardSlice.actions;

export default boardSlice.reducer;
