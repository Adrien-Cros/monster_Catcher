import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import store from '../../Store/store'
import MonsterCardLight from '../../Components/MonsterCard/MonsterCardLight/MonsterCardLight'
import generateMonster from '../../System/generateMonster/generateMonster'
import applyLevelToMonster from '../../System/level/applyLevelToMonster/applyLevelToMonster'
import ActionSelection from '../../Components/InCombat/ActionSelection/ActionSelection'

import './comboMode.scss'

function ComboMode() {
  const [hasInitBattle, setHasInitBattle] = useState(false)
  const [wildMonstersList, setWildMonstersList] = useState([])

  // Original state for monsterInTeam
  const [originalMonsterInTeam, setOriginalMonsterInTeam] = useState(null)

  // Copy state for monsterInTeam
  const [copiedMonsterInTeam, setCopiedMonsterInTeam] = useState([])

  // Original state for wildMonstersList
  const [originalWildMonstersList, setOriginalWildMonstersList] = useState(null)

  // Copy state for wildMonstersList
  const [copiedWildMonstersList, setCopiedWildMonstersList] = useState([])

  const calculateAverageTeamLevel = (actualMonstersInTeam) => {
    const totalLevel = actualMonstersInTeam.reduce(
      (accumulator, monster) => accumulator + monster.level,
      0
    )
    return actualMonstersInTeam.length > 0
      ? Math.ceil(totalLevel / actualMonstersInTeam.length)
      : 0
  }
  const monsterInTeam = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  useEffect(() => {
    setOriginalMonsterInTeam(monsterInTeam)
    setCopiedMonsterInTeam(monsterInTeam)

    setOriginalWildMonstersList(wildMonstersList)
    setCopiedWildMonstersList(wildMonstersList)
  }, [monsterInTeam, wildMonstersList])

  const AVERAGE_TEAM_LVL = useSelector((state) =>
    calculateAverageTeamLevel(state.monsterTeam.actualMonstersInTeam)
  )

  const isNew = (monsterToCheck) => {
    const actualMonstersInTeam =
      store.getState().monsterTeam.actualMonstersInTeam
    const actualMonstersInBox = store.getState().monsters.capturedMonstersList

    const isMonsterInActualTeam = actualMonstersInTeam.some(
      (monster) => monster.id === monsterToCheck.id
    )
    const isMonsterInCapturedList = actualMonstersInBox.some(
      (monster) => monster.id === monsterToCheck.id
    )

    return !isMonsterInActualTeam && !isMonsterInCapturedList
  }

  useEffect(() => {
    const generatedMonsters = Array.from({ length: 4 }, () => {
      const randomMonster = generateMonster({
        specificMonsterId: null,
        monsterRarity: 'all',
      })

      return applyLevelToMonster({
        monster: randomMonster,
        level: AVERAGE_TEAM_LVL,
      })
    })

    setWildMonstersList(generatedMonsters)
    setHasInitBattle(true)
  }, [AVERAGE_TEAM_LVL])

  const calculateHealthRatio = (currentHP, maxHP) => {
    return (currentHP / maxHP) * 100
  }

  return (
    <section className="combo-mode">
      <div className="monster-capacity-combo">
        {originalMonsterInTeam !== null &&
          originalMonsterInTeam !== undefined &&
          originalMonsterInTeam.length > 0 &&
          originalWildMonstersList !== null &&
          originalWildMonstersList !== undefined &&
          originalWildMonstersList.length > 0 &&
          originalMonsterInTeam.map((monster, index) => (
            <ActionSelection
              key={index}
              playerMonster={originalMonsterInTeam[index]}
              wildMonster={originalWildMonstersList[index]}
              disableActionButton={false}
            />
          ))}
      </div>
      <div className="battlefield">
        <div className="monster-list-combo">
          {hasInitBattle &&
            originalMonsterInTeam &&
            copiedMonsterInTeam?.map((monster, index) => (
              <div
                key={index}
                className="monster-container-combo --player player-animation"
              >
                <div
                  className="hp-container-bar"
                  style={{
                    width: `${calculateHealthRatio(
                      monster.stats.hp,
                      monster.stats.hp
                    )}%`,
                  }}
                >
                  <div className="hp-container">
                    {monster.stats.hp} / {originalMonsterInTeam[index].stats.hp}
                  </div>
                </div>
                <MonsterCardLight
                  key={monster.uniqueKey}
                  monster={monster}
                  isNew={isNew(monster)}
                />
              </div>
            ))}
        </div>
        <div className="monster-list-combo">
          {hasInitBattle &&
            originalWildMonstersList &&
            copiedWildMonstersList?.map((monster, index) => (
              <div
                key={index}
                className="monster-container-combo --monster monster-animation"
              >
                <div
                  className="hp-container-bar"
                  style={{
                    width: `${calculateHealthRatio(
                      monster.stats.hp,
                      monster.stats.hp
                    )}%`,
                  }}
                >
                  <div className="hp-container">
                    {monster.stats.hp} /
                    {originalWildMonstersList[index].stats.hp}
                  </div>
                </div>
                <MonsterCardLight
                  key={monster.uniqueKey}
                  monster={monster}
                  isNew={isNew(monster)}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default ComboMode