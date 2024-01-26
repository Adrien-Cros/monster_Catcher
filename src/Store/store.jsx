import { configureStore } from '@reduxjs/toolkit'
import monstersReducer from './Slice/monstersSlice'
import monsterTeamReducer from './Slice/playerTeamSlice'
import configReducer from '../System/config'
import gameStatusReducer from './Slice/gameStatusSlice'

const store = configureStore({
  reducer: {
    monsters: monstersReducer,
    monsterTeam: monsterTeamReducer,
    config: configReducer,
    gameStatus: gameStatusReducer,
  },
})

export default store
