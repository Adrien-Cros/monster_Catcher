import { createSlice } from '@reduxjs/toolkit'

const monstersTeamSlice = createSlice({
  name: 'monstersTeam',
  initialState: {
    actualMonstersInTeam: [],
  },
  reducers: {
    addMonsterToTeam: (state, action) => {
      state.actualMonstersInTeam = [
        ...state.actualMonstersInTeam,
        action.payload,
      ]
      localStorage.setItem(
        'actualMonstersInTeam',
        JSON.stringify(state.actualMonstersInTeam)
      )
    },
    removeMonsterFromTeam: (state, action) => {
      const { uniqueKey } = action.payload
      state.actualMonstersInTeam = state.actualMonstersInTeam.filter(
        (monster) => monster.uniqueKey !== uniqueKey
      )
      localStorage.setItem(
        'actualMonstersInTeam',
        JSON.stringify(state.actualMonstersInTeam)
      )
    },
    loadMonsterFromTeam: (state, action) => {
      const storedData = localStorage.getItem('actualMonstersInTeam')
      if (storedData) {
        state.actualMonstersInTeam = JSON.parse(storedData)
      }
    },
  },
})

export const { addMonsterToTeam, removeMonsterFromTeam, loadMonsterFromTeam } =
  monstersTeamSlice.actions
export default monstersTeamSlice.reducer
