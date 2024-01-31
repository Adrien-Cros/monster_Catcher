import { createSlice } from '@reduxjs/toolkit'
import playerLevelHelper from '../../System/player/playerLevelHelper'

const playerInfoSlice = createSlice({
  name: 'playerInfo',
  initialState: {
    username: null,
    playerLevel: 1,
    playerXp: 0,
  },
  reducers: {
    setUsername: (state, action) => {
      const { username } = action.payload
      state.username = username
      localStorage.setItem('playerInfo', JSON.stringify(state))
    },
    updatePlayerXp: (state, action) => {
      const { xpGained } = action.payload
      const newXp = state.playerXp + xpGained

      state.playerLevel = playerLevelHelper({ totalXp: newXp })

      state.playerXp = newXp
      localStorage.setItem('playerInfo', JSON.stringify(state))
    },

    loadPlayerInfo: (state, action) => {
      const storedData = localStorage.getItem('playerInfo')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        state.username = parsedData.username
        state.playerLevel = parsedData.playerLevel
        state.playerXp = parsedData.playerXp
      }
    },
    resetPlayerInfo: (state, action) => {
      state.username = null
      state.playerLevel = 1
      state.playerXp = 0
      localStorage.removeItem('playerInfo')
    },
  },
})

export const { setUsername, updatePlayerXp, loadPlayerInfo, resetPlayerInfo } =
  playerInfoSlice.actions
export default playerInfoSlice.reducer
