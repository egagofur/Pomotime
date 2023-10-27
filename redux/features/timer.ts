import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  focus: number;
  shortBreak: number;
  longBreak: number;
  replay: number;
  speed: number;
}

export const timer = createSlice({
  name: "timer",
  initialState: {
    focus: 1,
    shortBreak: 1,
    longBreak: 1,
    replay: 4,
    speed: 1.03,
  } as InitialState,
  reducers: {},
});

export const {} = timer.actions;
export default timer.reducer;
