import { createSlice } from '@reduxjs/toolkit'

const gameStatusSlice = createSlice({
  name: 'gameStatus',
  initialState: {
    inMainMenu: false,
    inCombat: false,
    inDungeon: false,
    inRandomEncounter: false,
  },
  reducers: {
    setInCombatStatus: (state, action) => {
      state.inCombat = action.payload
    },
    setInDungeonStatus: (state, action) => {
      state.inDungeon = action.payload
    },
    setInMainMenu: (state, action) => {
      state.inMainMenu = action.payload
    },
    setInRandomEncounter: (state, action) => {
      state.inRandomEncounter = action.payload
    },
  },
})

export const {
  setInCombatStatus,
  setInDungeonStatus,
  setInMainMenu,
  setInRandomEncounter,
} = gameStatusSlice.actions
export default gameStatusSlice.reducer
