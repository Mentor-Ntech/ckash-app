import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  country: string;
  hideBalance: boolean;
}

const initialState: SettingsState = {
  country: 'Kenya',
  hideBalance: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    toggleHideBalance(state) {
      state.hideBalance = !state.hideBalance;
    },
    setHideBalance(state, action: PayloadAction<boolean>) {
      state.hideBalance = action.payload;
    },
  },
});

export const { setCountry, toggleHideBalance, setHideBalance } = settingsSlice.actions;
export default settingsSlice.reducer;
