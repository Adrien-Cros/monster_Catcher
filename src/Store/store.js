import { configureStore } from '@reduxjs/toolkit'
import monstersReducer from './Slice/monstersSlice'
import monsterTeamReducer from './Slice/playerTeamSlice'
import configReducer from '../System/config'
import gameStatusReducer from './Slice/gameStatusSlice'
import inventoryReducer from './Slice/inventorySlice'
import playerReducer from './Slice/playerInfoSlice'

const store = configureStore({
  reducer: {
    monsters: monstersReducer,
    monsterTeam: monsterTeamReducer,
    config: configReducer,
    gameStatus: gameStatusReducer,
    inventory: inventoryReducer,
    playerInfo: playerReducer,
  },
})

export default store
