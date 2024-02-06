import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import store from '../../Store/store'
import MonsterCardLight from '../../Components/MonsterCard/MonsterCardLight/MonsterCardLight'
import generateMonster from '../../System/generateMonster/generateMonster'
import applyLevelToMonster from '../../System/level/applyLevelToMonster/applyLevelToMonster'
import levelUp from '../../System/level/levelUp/levelUp'
import { updateMonsterFromTeam } from '../../Store/Slice/playerTeamSlice'
import { updatePlayerXp } from '../../Store/Slice/playerInfoSlice'
import ModalCombatResult from '../../Components/Modal/ModalCombatResult/ModalCombatResult'
import { addCurrencyToInventory } from '../../Store/Slice/inventorySlice'
import { addItemToInventory } from '../../Store/Slice/inventorySlice'

import ComboCapacitySelection from '../../Components/ComboMode/ComboCapacitySelection/ComboCapacitySelection'
import ComboCounterDisplay from '../../Components/ComboMode/ComboCounterDisplay/ComboCounterDisplay'

import calculateDamageCombo from '../../System/combat/comboMode/calculateDamageCombo'
import randomEnemyCapacityCombo from '../../System/combat/comboMode/randomEnemyCapacityCombo'

import './comboMode.scss'
import lootCurrency from '../../System/loot/lootCurrency'
import lootItem from '../../System/loot/lootItem'
import { setInComboMode } from '../../Store/Slice/gameStatusSlice'

function ComboMode() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [hasInitBattle, setHasInitBattle] = useState(false)

  // Original state for monsterInTeam
  const [originalMonsterInTeam, setOriginalMonsterInTeam] = useState(null)
  // Copy state for monsterInTeam
  const [copiedMonsterInTeam, setCopiedMonsterInTeam] = useState([])

  // Original state for originalWildMonstersList
  const [originalWildMonstersList, setOriginalWildMonstersList] = useState(null)
  // Copy state for originalWildMonstersList
  const [copiedWildMonstersList, setCopiedWildMonstersList] = useState([])

  // Used to track which capacities have been selected
  const [selectedCapacities, setSelectedCapacities] = useState([])

  // Stats tracking
  const [playerTeamStats, setPlayerTeamStats] = useState(0)
  const [wildTeamStats, setWildTeamStats] = useState(0)

  const [copiedPlayerTeamStats, setCopiedPlayerTeamStats] = useState(0)
  const [copiedWildTeamStats, setCopiedWildTeamStats] = useState(0)

  const [winOrLoose, setWinOrLoose] = useState() // true = win, false = loose
  const [hasCombatEnded, setHasCombatEnded] = useState(false)
  //used to check the loot when the monster is killed
  const [lootList, setLootList] = useState([])
  const [currencyList, setCurrencyList] = useState([])

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
    if (copiedWildTeamStats?.hp <= 0) {
      console.log('You win')
      setWinOrLoose(true)
    } else if (copiedPlayerTeamStats?.hp <= 0) {
      console.log('You lose')
      setWinOrLoose(false)
    }
  }, [copiedWildTeamStats?.hp, copiedPlayerTeamStats?.hp])

  useEffect(() => {
    if (winOrLoose) {
      //check for lvl up et xp won
      let lootedItem = []
      let lootedCurrency = []
      for (let i = 0; i < originalMonsterInTeam.length; i++) {
        const result = levelUp({
          victoriousMonster: originalMonsterInTeam[i],
          defeatedMonster: originalWildMonstersList[i],
        })
        console.log('Result de ', i, ' + ', result)
        //Update the monster with the new xp/lvl
        dispatch(updateMonsterFromTeam({ monsterToUpdate: result.monster }))
        //loot
        lootedCurrency.push(lootCurrency())
        lootedItem.push(lootItem({ monster: originalWildMonstersList[i] }))
      }

      // Merge arrays based on item ID
      const mergeArrays = (arr) => {
        return arr.reduce((merged, current) => {
          const existingItem = merged.find(
            (item) => item.item.id === current.item.id
          )

          if (existingItem) {
            existingItem.quantity += current.quantity
          } else {
            merged.push({ ...current })
          }

          return merged
        }, [])
      }

      // Combine the arrays of looted items and currency
      const combinedLootedItems = mergeArrays([].concat(...lootedItem))
      const combinedCurrencyLooted = mergeArrays([].concat(...lootedCurrency))

      if (combinedLootedItems) {
        combinedLootedItems.forEach(({ item, quantity }) => {
          dispatch(addItemToInventory({ item, quantity }))
        })
      }
      //Check loot currency
      if (combinedCurrencyLooted) {
        combinedCurrencyLooted.forEach(({ item, quantity }) => {
          dispatch(addCurrencyToInventory({ currency: item, quantity }))
        })
      }

      // Update state with the merged arrays
      setLootList(combinedLootedItems)
      setCurrencyList(combinedCurrencyLooted)

      // Update the player xp
      dispatch(updatePlayerXp({ xpGained: 15 }))
      setHasCombatEnded(true)
    } else if (winOrLoose === false) {
      navigate('/main')
    }
  }, [winOrLoose])

  useEffect(() => {
    console.log('Looted Items: ', lootList)
    console.log('Currency Looted: ', currencyList)
  }, [currencyList, lootList])

  useEffect(() => {
    setOriginalMonsterInTeam(monsterInTeam)
    setCopiedMonsterInTeam(monsterInTeam)

    setOriginalWildMonstersList(originalWildMonstersList)
    setCopiedWildMonstersList(originalWildMonstersList)

    setCopiedPlayerTeamStats(calculateTotalStats(originalMonsterInTeam))
    setCopiedWildTeamStats(calculateTotalStats(originalWildMonstersList))
  }, [monsterInTeam, originalMonsterInTeam, originalWildMonstersList])

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
  }, [copiedMonsterInTeam, copiedWildMonstersList])

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

    setOriginalWildMonstersList(generatedMonsters)
    setHasInitBattle(true)
  }, [AVERAGE_TEAM_LVL])

  const calculateHealthRatio = (currentHP, maxHP) => {
    const ratio = (currentHP / maxHP) * 100
    return Math.max(Math.floor(ratio), 0)
  }

  const handleCloseModal = () => {
    dispatch(setInComboMode(false))
    navigate('/main')
  }

  return (
    <section className="combo-mode fullview">
      {hasCombatEnded && winOrLoose && (
        <ModalCombatResult
          modalName={'Combat Result'}
          monsterDefeated={originalWildMonstersList[2]}
          onCloseModal={handleCloseModal}
          itemsWon={lootList}
          currencyWon={currencyList}
          xpWon={0}
          isCaptured={false}
        />
      )}
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
