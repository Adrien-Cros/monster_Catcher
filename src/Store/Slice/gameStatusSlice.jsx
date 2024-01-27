import { createSlice } from '@reduxjs/toolkit'

const gameStatusSlice = createSlice({
  name: 'gameStatus',
  initialState: {
    inMainMenu: false,
    inCombat: false,
    inDungeon: false,
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
  },
})

export const { setInCombatStatus, setInDungeonStatus, setInMainMenu } =
  gameStatusSlice.actions
export default gameStatusSlice.reducer
