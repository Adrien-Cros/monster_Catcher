import { configureStore } from '@reduxjs/toolkit'
import monstersReducer from './Slice/monstersSlice'
import monsterTeamReducer from './Slice/playerTeamSlice'

const store = configureStore({
  reducer: {
    monsters: monstersReducer,
    monsterTeam: monsterTeamReducer,
  },
})

export default store
