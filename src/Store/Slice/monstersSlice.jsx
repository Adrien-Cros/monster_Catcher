import { createSlice } from '@reduxjs/toolkit'

const monstersSlice = createSlice({
  name: 'monsters',
  initialState: {
    capturedMonstersList: [],
  },
  reducers: {
    updateCapturedMonstersList: (state, action) => {
      state.capturedMonstersList = [
        ...state.capturedMonstersList,
        action.payload,
      ]
      localStorage.setItem(
        'capturedMonstersList',
        JSON.stringify(state.capturedMonstersList)
      )
    },
    resetCapturedMonstersList: (state) => {
      state.capturedMonstersList = []
      localStorage.removeItem('capturedMonstersList')
    },
    loadCapturedMonstersList: (state, action) => {
      const storedData = localStorage.getItem('capturedMonstersList')
      if (storedData) {
        state.capturedMonstersList = JSON.parse(storedData)
      }
    },
    deleteMonsterFromListByKey: (state, action) => {
      const { uniqueKey } = action.payload

      // Remove the monster from the Redux state
      state.capturedMonstersList = state.capturedMonstersList.filter(
        (monster) => monster.uniqueKey !== uniqueKey
      )

      // Update localStorage with the modified monster list
      localStorage.setItem(
        'capturedMonstersList',
        JSON.stringify(state.capturedMonstersList)
      )
    },
  },
})

export const {
  updateCapturedMonstersList,
  resetCapturedMonstersList,
  loadCapturedMonstersList,
  deleteMonsterFromListByKey,
} = monstersSlice.actions
export default monstersSlice.reducer
