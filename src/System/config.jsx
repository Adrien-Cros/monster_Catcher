import { createSlice } from '@reduxjs/toolkit'

const configSlice = createSlice({
  name: 'config',
  initialState: {
    difficulty: 'normal',
    goldRate: 1,
    xpRate: 1,
    catchRate: 1,
    maxMonstersInTeam: 5,
    maxMonstersInBox: 500,
    alreadyHaveStarter: false,
  },
  reducers: {
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
    },
    setGoldRate: (state, action) => {
      state.goldRate = action.payload
    },
    setXPRate: (state, action) => {
      state.xpRate = action.payload
    },
    setCatchRate: (state, action) => {
      state.catchRate = action.payload
    },
    setMaxMonstersInTeam: (state, action) => {
      state.maxMonstersInTeam = action.payload
    },
    setMaxMonstersInBox: (state, action) => {
      state.maxMonstersInBox = action.payload
    },
    setAlreadyHaveStarter: (state, action) => {
      state.alreadyHaveStarter = action.payload
    },
    saveSetting: (state, action) => {
      localStorage.setItem('settings', JSON.stringify(state))
    },
    loadSetting: (state) => {
      const storedData = localStorage.getItem('settings')
      if (storedData) {
        return JSON.parse(storedData)
      }
    },
    setDifficultyEasy: (state, action) => {
      state.difficulty = 'easy'
      state.catchRate = 2
      state.goldRate = 2
      state.xpRate = 2
      state.maxMonstersInTeam = 7
      state.maxMonstersInBox = 500
      localStorage.setItem('settings', JSON.stringify(state))
    },
    setDifficultyNormal: (state, action) => {
      state.difficulty = 'normal'
      state.catchRate = 1
      state.goldRate = 1
      state.xpRate = 1
      state.maxMonstersInTeam = 5
      state.maxMonstersInBox = 500
      localStorage.setItem('settings', JSON.stringify(state))
    },
    setDifficultyHard: (state, action) => {
      state.difficulty = 'hard'
      state.catchRate = 0.5
      state.goldRate = 0.5
      state.xpRate = 0.5
      state.maxMonstersInTeam = 3
      state.maxMonstersInBox = 500
      localStorage.setItem('settings', JSON.stringify(state))
    },
  },
})

export const {
  setDifficulty,
  setGoldRate,
  setXPRate,
  setCatchRate,
  setMaxMonstersInTeam,
  setMaxMonstersInBox,
  setAlreadyHaveStarter,
  saveSetting,
  loadSetting,
  setDifficultyEasy,
  setDifficultyNormal,
  setDifficultyHard,
} = configSlice.actions
export default configSlice.reducer
