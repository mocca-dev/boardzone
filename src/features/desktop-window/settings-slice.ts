import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  mode: boolean;
  showPrevPoints: boolean;
  showDifference: boolean;
  showMoney: boolean;
  teamType: number;
}

let initialState: SettingsState = {
  mode: true,
  showDifference: true,
  showPrevPoints: true,
  showMoney: true,
  teamType: 2,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<{ mode: boolean }>) {
      state.mode = action.payload.mode;
    },
    setShowPrevPoints(
      state,
      action: PayloadAction<{ showPrevPoints: boolean }>
    ) {
      state.showPrevPoints = action.payload.showPrevPoints;
    },
    setShowDifference(
      state,
      action: PayloadAction<{ showDifference: boolean }>
    ) {
      state.showDifference = action.payload.showDifference;
    },
    setTeamType(state, action: PayloadAction<{ teamType: number }>) {
      state.teamType = action.payload.teamType;
    },
    setShowMoney(state, action: PayloadAction<{ showMoney: boolean }>) {
      state.showMoney = action.payload.showMoney;
    },
  },
});

export const {
  setMode,
  setShowPrevPoints,
  setShowDifference,
  setTeamType,
  setShowMoney,
} = settingsSlice.actions;

export default settingsSlice.reducer;
