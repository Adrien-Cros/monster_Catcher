import { useDispatch } from 'react-redux'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'
import { saveSetting, setAlreadyHaveStarter } from '../../System/config'

import MonsterCardClassic from '../MonsterCard/MonsterCardClassic/MonsterCardClassic'
import generateMonster from '../../System/generateMonster/generateMonster'

import './starterMonsterSelection.scss'
import { setUsername } from '../../Store/Slice/playerInfoSlice'

function StarterMonsterSelection() {
  const dispatch = useDispatch()

  //rarity 0 mean starter monster only
  const starterRarity = 0
  const monster1 = generateMonster({
    monsterRarity: starterRarity,
    specificMonsterId: 1,
  })
  const monster2 = generateMonster({
    monsterRarity: starterRarity,
    specificMonsterId: 2,
  })
  const monster3 = generateMonster({
    monsterRarity: starterRarity,
    specificMonsterId: 3,
  })

  const handleStartAdventure = (event) => {
    event.preventDefault()
    const username = event.target.elements.username.value

    if (username.length > 0 && username.length <= 10) {
      // Dispatch actions if the username is valid
      dispatch(updateCapturedMonstersList(monster1))
      dispatch(updateCapturedMonstersList(monster2))
      dispatch(updateCapturedMonstersList(monster3))
      dispatch(setUsername({ username: username }))
      dispatch(setAlreadyHaveStarter(true))
      dispatch(saveSetting())
    }
  }

  return (
    <section className="starter-monster-container">
      <h2>You have new monsters in your team !</h2>
      <div className="monster-card-container">
        <div className="monster-card-1 starter-apparition-1">
          <MonsterCardClassic
            monster={monster1}
            canAccessMenu={false}
            showStats={true}
            isNew={true}
          />
        </div>
        <div className="monster-card-2 starter-apparition-2">
          <MonsterCardClassic
            monster={monster2}
            canAccessMenu={false}
            showStats={true}
            isNew={true}
          />
        </div>
        <div className="monster-card-3 starter-apparition-3">
          <MonsterCardClassic
            monster={monster3}
            canAccessMenu={false}
            showStats={true}
            isNew={true}
          />
        </div>
      </div>
      <form className="form-apparition" onSubmit={handleStartAdventure}>
        <label>Enter a username :</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="10 max characters"
        />
        <button className="validate-button">Start Adventure</button>
      </form>
    </section>
  )
}

export default StarterMonsterSelection
