import MonsterCard from '../MonsterCard/MonsterCard'
import GenerateMonster from '../../System/GenerateMonster/GenerateMonster'

import './starterMonsterSelection.scss'
import { useDispatch } from 'react-redux'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'
import { saveSetting, setAlreadyHaveStarter } from '../../System/config'

function StarterMonsterSelection() {
  const dispatch = useDispatch()

  //rarity 0 mean starter monster only
  const starterRarity = 0
  const monster1 = GenerateMonster({
    monsterRarity: starterRarity,
    specificMonsterId: 1,
  })
  const monster2 = GenerateMonster({
    monsterRarity: starterRarity,
    specificMonsterId: 2,
  })
  const monster3 = GenerateMonster({
    monsterRarity: starterRarity,
    specificMonsterId: 3,
  })

  const handleStartAdventure = (event) => {
    event.preventDefault()
    dispatch(updateCapturedMonstersList(monster1))
    dispatch(updateCapturedMonstersList(monster2))
    dispatch(updateCapturedMonstersList(monster3))
    dispatch(setAlreadyHaveStarter(true))
    dispatch(saveSetting())
  }

  return (
    <section className="starter-monster-container">
      <h2>You have new monsters in your team !</h2>
      <div className="monster-card-container">
        <div className="monster-card-1 starter-apparition-1">
          <MonsterCard
            monster={monster1}
            canAccessMenu={false}
            showStats={true}
            isNew={true}
          />
        </div>
        <div className="monster-card-2 starter-apparition-2">
          <MonsterCard
            monster={monster2}
            canAccessMenu={false}
            showStats={true}
            isNew={true}
          />
        </div>
        <div className="monster-card-3 starter-apparition-3">
          <MonsterCard
            monster={monster3}
            canAccessMenu={false}
            showStats={true}
            isNew={true}
          />
        </div>
      </div>
      <button
        onClick={handleStartAdventure}
        className="validate-button accept-button-apparition"
      >
        Accept all !
      </button>
    </section>
  )
}

export default StarterMonsterSelection
