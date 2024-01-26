import { createSlice } from '@reduxjs/toolkit'

const gameStatusSlice = createSlice({
  name: 'gameStatus',
  initialState: {
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
  },
})

export const { setInCombatStatus, setInDungeonStatus } = gameStatusSlice.actions
export default gameStatusSlice.reducer
