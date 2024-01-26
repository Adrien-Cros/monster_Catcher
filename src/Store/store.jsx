import { configureStore } from '@reduxjs/toolkit'
import monstersReducer from './Slice/monstersSlice'
import monsterTeamReducer from './Slice/playerTeamSlice'
import configReducer from '../System/config'

const store = configureStore({
  reducer: {
    monsters: monstersReducer,
    monsterTeam: monsterTeamReducer,
    config: configReducer,
  },
})

export default store
