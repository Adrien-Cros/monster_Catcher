import { createSlice } from '@reduxjs/toolkit'

const monstersSlice = createSlice({
  name: 'monsters',
  initialState: {
    capturedMonstersList: [],
    sortCriteria: null,
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
    sortMonstersInCapturedList: (state, action) => {
      const { criteria } = action.payload

      state.sortCriteria = criteria

      const sortedList = [...state.capturedMonstersList]

      sortedList.sort((a, b) => {
        if (criteria === 'level') {
          // Sorting logic based on level and experience
          if (a.level > b.level) {
            return -1
          } else if (a.level < b.level) {
            return 1
          } else {
            if (a.experience > b.experience) {
              return -1
            } else if (a.experience < b.experience) {
              return 1
            } else {
              return 0
            }
          }
        } else if (criteria === 'id') {
          // Sorting logic based on id
          if (a.id < b.id) {
            return -1
          } else if (a.id > b.id) {
            return 1
          } else {
            return 0
          }
        } else if (criteria === 'race') {
          // Sorting logic based on race
          return Array.isArray(a.race) && Array.isArray(b.race)
            ? a.race.join('').localeCompare(b.race.join(''))
            : 0
        } else if (criteria === 'rarity') {
          // Sorting logic based on rarity
          if (a.rarity > b.rarity) {
            return -1
          } else if (a.rarity < b.rarity) {
            return 1
          } else {
            return 0
          }
        } else if (criteria === 'type') {
          // Sorting logic based on type
          return Array.isArray(a.type) && Array.isArray(b.type)
            ? a.type.join('').localeCompare(b.type.join(''))
            : 0
        }
        // Default case: return 0 if none of the specific conditions apply
        return 0
      })
      state.capturedMonstersList = sortedList
    },
  },
})

export const {
  updateCapturedMonstersList,
  resetCapturedMonstersList,
  loadCapturedMonstersList,
  deleteMonsterFromListByKey,
  sortMonstersInCapturedList,
} = monstersSlice.actions
export default monstersSlice.reducer
