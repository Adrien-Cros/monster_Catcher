import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import store from '../../Store/store'
import MonsterCardLight from '../../Components/MonsterCard/MonsterCardLight/MonsterCardLight'
import generateMonster from '../../System/generateMonster/generateMonster'
import applyLevelToMonster from '../../System/level/applyLevelToMonster/applyLevelToMonster'

import ComboCapacitySelection from '../../Components/ComboMode/ComboCapacitySelection/ComboCapacitySelection'
import ComboCounterDisplay from '../../Components/ComboMode/ComboCounterDisplay/ComboCounterDisplay'

import './comboMode.scss'
import calculateDamageCombo from '../../System/combat/comboMode/calculateDamageCombo'
import randomEnemyCapacityCombo from '../../System/combat/comboMode/randomEnemyCapacityCombo'

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

  // Used to track which capacities have been selected
  const [selectedCapacities, setSelectedCapacities] = useState([])

  // Stats tracking
  const [playerTeamStats, setPlayerTeamStats] = useState(0)
  const [wildTeamStats, setWildTeamStats] = useState(0)

  const [copiedPlayerTeamStats, setCopiedPlayerTeamStats] = useState(0)
  const [copiedWildTeamStats, setCopiedWildTeamStats] = useState(0)

  const handleCapacitySelect = (monster, capacity) => {
    // Create an object containing the monster with the selected capacity
    const monsterAndCapacity = { monster, capacity }
    // Check if the capacity is already selected for the given monster
    const alreadySelectedACapacity = selectedCapacities.find(
      (item) => item.monster.uniqueKey === monsterAndCapacity.monster.uniqueKey
    )
    // If the monster has already selected a capacity, replace it with the new one
    if (alreadySelectedACapacity) {
      // Replace the existing entry in the array
      setSelectedCapacities((prevCapacities) => {
        return prevCapacities.map((item) =>
          item.monster.uniqueKey === monster.uniqueKey
            ? monsterAndCapacity
            : item
        )
      })
    } else {
      // If the monster hasn't selected a capacity, push the new object into the array
      setSelectedCapacities((prevCapacities) => [
        ...prevCapacities,
        monsterAndCapacity,
      ])
    }
  }

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

  const handleResetCapacity = () => {
    setSelectedCapacities([])
  }

  const handleValidateTurn = () => {
    const whichMonstersCapacity = randomEnemyCapacityCombo({
      monsterList: copiedWildMonstersList,
    })
    const playerGoesFirst =
      copiedPlayerTeamStats.speed >= copiedWildTeamStats.speed

    let damageDealt = 0

    if (playerGoesFirst) {
      //player turn
      damageDealt = calculateDamageCombo({
        attacker: copiedPlayerTeamStats,
        defender: copiedWildTeamStats,
        capacityUsed: selectedCapacities,
      })
      setCopiedWildTeamStats((prevStats) => ({
        ...prevStats,
        hp: prevStats.hp - damageDealt,
      }))
      console.log('Your team have dealt: ', damageDealt)
      //monster turn
      damageDealt = calculateDamageCombo({
        attacker: copiedWildTeamStats,
        defender: copiedPlayerTeamStats,
        capacityUsed: whichMonstersCapacity,
      })
      setCopiedPlayerTeamStats((prevStats) => ({
        ...prevStats,
        hp: prevStats.hp - damageDealt,
      }))
      console.log('Monsters have dealt: ', damageDealt)
    } else {
      //monster turn
      damageDealt = calculateDamageCombo({
        attacker: copiedWildTeamStats,
        defender: copiedPlayerTeamStats,
        capacityUsed: whichMonstersCapacity,
      })
      setCopiedPlayerTeamStats((prevStats) => ({
        ...prevStats,
        hp: prevStats.hp - damageDealt,
      }))
      console.log('Monsters have dealt: ', damageDealt)
      //player turn
      damageDealt = calculateDamageCombo({
        attacker: copiedPlayerTeamStats,
        defender: copiedWildTeamStats,
        capacityUsed: selectedCapacities,
      })
      setCopiedWildTeamStats((prevStats) => ({
        ...prevStats,
        hp: prevStats.hp - damageDealt,
      }))
      console.log('Your team have dealt: ', damageDealt)
    }

    setSelectedCapacities([])
  }

  useEffect(() => {
    setOriginalMonsterInTeam(monsterInTeam)
    setCopiedMonsterInTeam(monsterInTeam)

    setOriginalWildMonstersList(wildMonstersList)
    setCopiedWildMonstersList(wildMonstersList)

    setCopiedPlayerTeamStats(calculateTotalStats(originalMonsterInTeam))
    setCopiedWildTeamStats(calculateTotalStats(wildMonstersList))
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

  // Helper to calculate the team hp
  const calculateTotalStats = (monsterList) => {
    return monsterList?.reduce(
      (totalStats, monster) => {
        if (monster?.stats) {
          return {
            hp: totalStats.hp + (monster.stats.hp || 0),
            attack: totalStats.attack + (monster.stats.attack || 0),
            magic: totalStats.magic + (monster.stats.magic || 0),
            defense: totalStats.defense + (monster.stats.defense || 0),
            spirit: totalStats.spirit + (monster.stats.spirit || 0),
            speed: totalStats.speed + (monster.stats.speed || 0),
            luck: totalStats.luck + (monster.stats.luck || 0),
            despair: totalStats.despair + (monster.stats.despair || 0),
          }
        }
        return totalStats
      },
      {
        hp: 0,
        attack: 0,
        magic: 0,
        defense: 0,
        spirit: 0,
        speed: 0,
        luck: 0,
        despair: 0,
      }
    )
  }

  useEffect(() => {
    setPlayerTeamStats(calculateTotalStats(copiedMonsterInTeam))
    setWildTeamStats(calculateTotalStats(copiedWildMonstersList))
  }, [wildTeamStats.hp, playerTeamStats.hp])

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
    const ratio = (currentHP / maxHP) * 100
    return Math.max(Math.floor(ratio), 0)
  }

  return (
    <section className="combo-mode">
      <div className="monster-capacity-combo">
        {copiedMonsterInTeam.length === 4 && (
          <ComboCapacitySelection
            monster1={copiedMonsterInTeam[0]}
            monster2={copiedMonsterInTeam[1]}
            monster3={copiedMonsterInTeam[2]}
            monster4={copiedMonsterInTeam[3]}
            onCapacitySelect={handleCapacitySelect}
          />
        )}
        <ComboCounterDisplay
          capacityAndMonsterList={selectedCapacities}
          onResetButton={handleResetCapacity}
          onValidateButton={handleValidateTurn}
        />
      </div>
      <div className="battlefield">
        {playerTeamStats && copiedPlayerTeamStats?.hp && (
          <div className="player-hp">
            {copiedPlayerTeamStats?.hp} / {playerTeamStats?.hp}
            <div className="player-hp-container">
              <div
                className="player-hp-bar"
                style={{
                  height: `${calculateHealthRatio(
                    copiedPlayerTeamStats?.hp,
                    playerTeamStats?.hp
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
        <div className="monster-list-combo">
          {hasInitBattle &&
            originalMonsterInTeam &&
            copiedMonsterInTeam?.map((monster, index) => (
              <div
                key={index}
                className="monster-container-combo --player player-animation"
              >
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
                <MonsterCardLight
                  key={monster.uniqueKey}
                  monster={monster}
                  isNew={isNew(monster)}
                />
              </div>
            ))}
        </div>
        {wildTeamStats && copiedWildTeamStats?.hp && (
          <div className="wild-hp">
            {copiedWildTeamStats?.hp} / {wildTeamStats?.hp}
            <div className="wil-hp-container">
              <div
                className="wild-hp-bar"
                style={{
                  height: `${calculateHealthRatio(
                    copiedWildTeamStats?.hp,
                    wildTeamStats?.hp
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ComboMode
