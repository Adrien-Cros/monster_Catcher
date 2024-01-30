import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import generateMonster from '../../System/generateMonster/generateMonster'
import calculateDamage from '../../System/combat/calculateDamage'
import lootItem from '../../System/loot/lootItem'
import levelUp from '../../System/level/levelUp/levelUp'
import lootCurrency from '../../System/loot/lootCurrency'
import applyLevelToMonster from '../../System/level/applyLevelToMonster/applyLevelToMonster'

import MonsterCard from '../../Components/MonsterCard/MonsterCard'
import MonsterSelection from '../../Components/InCombat/MonsterSelection/MonsterSelection'
import ActionSelection from '../../Components/InCombat/ActionSelection/ActionSelection'
import Modal from '../../Components/Modal/ModalCombatResult/Modal'

import {
  addCurrencyToInventory,
  addItemToInventory,
  removeItemFromInventory,
} from '../../Store/Slice/inventorySlice'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'
import { setInRandomEncounter } from '../../Store/Slice/gameStatusSlice'

import './randomEncounter.scss'
import { updateMonsterFromTeam } from '../../Store/Slice/playerTeamSlice'

//This page render a full combat encounter with an HUD
function RandomEncounter() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [hasInitBattle, setHasInitBattle] = useState(false)
  const [hasChosenRandomMonster, setHasChosenRandomMonster] = useState(false)
  const [hasPlayerChooseAMonster, setHasPlayerChooseAMonster] = useState(false)
  const [wildMonster, setWildMonster] = useState(null)
  const [selectedPlayerMonster, setSelectedPlayerMonster] = useState(null)

  //copy the monster for modifying stats if needed for fight
  const [playerMonsterCopy, setPlayerMonsterCopy] = useState(null)
  const [wildMonsterCopy, setWildMonsterCopy] = useState(null)

  //used to play animation on monster
  const [combatAnimation, setCombatAnimation] = useState(false)

  //used to check if the combat has ended
  const [hasCombatEnded, setHasCombatEnded] = useState(false)
  const [winOrLose, setWinOrLose] = useState(null) //win=true, lose=false

  //combat log informations
  const [logInformation, setLogInformation] = useState([])

  //used to check the loot when the monster is killed
  const [lootList, setLootList] = useState({})
  const [currencyList, setCurrencyList] = useState({})

  //check if monster is captured
  const [monsterCaptured, setMonsterCaptured] = useState(false)

  //stored the xp win at the end of the fight
  const [xpGained, setXpGained] = useState(null)
  const [hasLevelUp, setHasLevelUp] = useState(null)

  const AVERAGE_TEAM_LVL = useSelector((state) => {
    let totalLevel = 0

    if (state.monsterTeam.actualMonstersInTeam.length > 0) {
      totalLevel = state.monsterTeam.actualMonstersInTeam.reduce(
        (accumulator, monster) => accumulator + monster.level,
        0
      )
      return Math.ceil(
        totalLevel / state.monsterTeam.actualMonstersInTeam.length
      )
    }
    return 0
  })

  //check the catch rate in the difficulty settings
  const catchRate = useSelector((state) => state.config.catchRate)

  //check if the monster id is already in the team or the box
  const isANewMonster = useSelector((state) => {
    const actualMonstersInTeam = state.monsterTeam.actualMonstersInTeam
    const capturedMonstersList = state.monsters.capturedMonstersList

    const isMonsterInActualTeam = actualMonstersInTeam.some(
      (monster) => monster.id === wildMonster?.id
    )
    const isMonsterInCapturedList = capturedMonstersList.some(
      (monster) => monster.id === wildMonster?.id
    )

    const isNewMonster = !isMonsterInActualTeam && !isMonsterInCapturedList

    return isNewMonster
  })

  useEffect(() => {
    const generateRandomMonster = () => {
      if (!hasChosenRandomMonster) {
        const randomMonster = generateMonster({
          specificMonsterId: null,
          monsterRarity: 'all',
        })
        if (randomMonster) {
          const randomMonsterAfterLevelUp = applyLevelToMonster({
            monster: randomMonster,
            level: AVERAGE_TEAM_LVL,
          })
          setWildMonster(randomMonsterAfterLevelUp)
          setWildMonsterCopy(randomMonsterAfterLevelUp)
          setHasChosenRandomMonster(true)
        }
      }
    }

    const initBattle = () => {
      generateRandomMonster()
      setHasInitBattle(true)
    }

    initBattle()
  }, [hasChosenRandomMonster])

  function handleMonsterSelection(monster) {
    setSelectedPlayerMonster(monster)
    setPlayerMonsterCopy(monster)
    setHasPlayerChooseAMonster(true)
  }

  const updateCombatLog = (message) => {
    setLogInformation((prevCombatLog) => [...prevCombatLog, message])
  }

  //handle the player turn
  const handlePlayerTurn = (selectedCapacity) => {
    const damageDealt = calculateDamage({
      attacker: playerMonsterCopy,
      defender: wildMonsterCopy,
      capacityUsed: selectedCapacity,
    })
    const logMessage = `Your ${playerMonsterCopy.name} used ${selectedCapacity.name} => ${wildMonsterCopy.name} takes ${damageDealt} damage!`
    updateCombatLog(logMessage)
    setWildMonsterCopy((prevWildMonsterCopy) => ({
      ...prevWildMonsterCopy,
      stats: {
        ...prevWildMonsterCopy.stats,
        hp: Math.max(prevWildMonsterCopy.stats.hp - damageDealt, 0),
      },
    }))
  }

  //handle the enemy turn
  const handleEnemyTurn = () => {
    const capacities = wildMonsterCopy.capacities
    const capacitiesArray = Object.values(capacities)
    const numberOfCapacities = capacitiesArray.length
    const randomIndex = Math.floor(Math.random() * numberOfCapacities)

    const selectedCapacity = capacitiesArray[randomIndex]

    const damageDealt = calculateDamage({
      attacker: wildMonsterCopy,
      defender: playerMonsterCopy,
      capacityUsed: selectedCapacity,
    })

    const logMessage = `Wild ${wildMonsterCopy.name} used ${selectedCapacity.name} => ${playerMonsterCopy.name} takes ${damageDealt} damage!`
    updateCombatLog(logMessage)
    setPlayerMonsterCopy((prevPlayerMonsterCopy) => ({
      ...prevPlayerMonsterCopy,
      stats: {
        ...prevPlayerMonsterCopy.stats,
        hp: Math.max(prevPlayerMonsterCopy.stats.hp - damageDealt, 0),
      },
    }))
  }

  // handle the sequential action when the player confirms the turn
  // it can receive a capacity object, or an item object, based on what the ActionSelection return
  const handleTurnEnd = (selectedCapacityOrItem) => {
    const playerGoesFirst =
      playerMonsterCopy.stats.speed >= wildMonsterCopy.stats.speed
    const isACapacity = selectedCapacityOrItem.objectType === 'capacity'
    const isACaptureItem =
      selectedCapacityOrItem.objectType === 'item' &&
      selectedCapacityOrItem.type.includes('Capture')
    if (isACapacity) {
      setCombatAnimation(true)
      if (playerGoesFirst) {
        if (!hasCombatEnded && playerMonsterCopy.stats.hp > 0) {
          handlePlayerTurn(selectedCapacityOrItem)
        }
        if (!hasCombatEnded && wildMonsterCopy.stats.hp > 0) {
          setTimeout(() => {
            if (!hasCombatEnded) {
              handleEnemyTurn()
              setCombatAnimation(false)
            }
          }, 1100)
        }
      } else {
        if (!hasCombatEnded && wildMonsterCopy.stats.hp >= 0) {
          if (!hasCombatEnded) {
            setTimeout(() => {
              if (!hasCombatEnded) {
                handleEnemyTurn()
                setCombatAnimation(false)
              }
            }, 1100)
          }
          handlePlayerTurn(selectedCapacityOrItem)
        }
      }
      //If it's a capture item, try to catch the actual monster
    } else if (isACaptureItem) {
      handleCapture(selectedCapacityOrItem)
    } else {
      console.log('Error in retrieving the type of the object')
    }
  }

  //used to calcul if the monsters has been captured
  const handleCapture = (selectedCapacityOrItem) => {
    dispatch(
      removeItemFromInventory({
        item: selectedCapacityOrItem,
        quantity: 1,
      })
    )
    //Multiply the value to capture by the difficulty settings catchRate
    const minValueToCaptureTheMonster =
      wildMonster.captureValueNeeded * catchRate
    const minChanceToCapture = selectedCapacityOrItem.effect.captureMinValue
    const maxChanceToCapture = selectedCapacityOrItem.effect.captureMaxValue
    const randomRoll =
      Math.random() * (maxChanceToCapture - minChanceToCapture) +
      minChanceToCapture
    const monsterCaptured = randomRoll >= minValueToCaptureTheMonster
    if (monsterCaptured) {
      dispatch(updateCapturedMonstersList(wildMonster))
      setLootList(null)
      setCurrencyList(null)
      setMonsterCaptured(true)
      setHasCombatEnded(true)
      handleCombatWon()
      const logMessage = `You have captured a ${wildMonster.name} !`
      updateCombatLog(logMessage)
    } else {
      const logMessage = `Failed to capture ${wildMonster.name} ! Try again !`
      updateCombatLog(logMessage)
      handleEnemyTurn()
    }
  }

  const handleCombatWon = () => {
    //check for lvl up et xp won
    const result = levelUp({
      victoriousMonster: selectedPlayerMonster,
      defeatedMonster: wildMonster,
    })
    //Update the state
    setXpGained(result.xpWon)
    setHasLevelUp(result.leveledUp)
    //Update the monster with the new xp/lvl
    dispatch(updateMonsterFromTeam({ monsterToUpdate: result.monster }))
    setHasCombatEnded(true)
    setWinOrLose(true) // true = win
  }

  const handleCombatLoose = () => {
    if (winOrLose === true) {
    } else {
      setHasCombatEnded(true)
      setWinOrLose(false) // false = lose
      dispatch(setInRandomEncounter(false))
      navigate('/main')
    }
  }

  const handleCloseModal = () => {
    dispatch(setInRandomEncounter(false))
    navigate('/main')
  }

  const calculateHealthRatio = (currentHP, maxHP) => {
    return (currentHP / maxHP) * 100
  }

  //Check playermonster with true value, then check if player loose
  useEffect(() => {
    if (playerMonsterCopy?.stats.hp <= 0) {
      const logMessage = `Oh no! Your ${playerMonsterCopy.name} is dead !`
      updateCombatLog(logMessage)
      setCombatAnimation(false)
      handleCombatLoose()
    }
  }, [playerMonsterCopy?.stats.hp])

  //Check wildmonster with true value, then check if combat is win, and the monster is dead
  useEffect(() => {
    if (wildMonsterCopy?.stats.hp <= 0) {
      const logMessage = `You won ! ${wildMonsterCopy.name} is dead !`
      updateCombatLog(logMessage)

      setCombatAnimation(false)
      handleCombatWon()
      //Check loot in the killed monster
      const lootedItem = lootItem(wildMonster)
      setLootList(lootedItem)
      lootedItem.forEach(({ item, quantity }) => {
        dispatch(addItemToInventory({ item, quantity }))
      })

      const lootedCurrency = lootCurrency()
      setCurrencyList(lootedCurrency)
      lootedCurrency.forEach(({ item, quantity }) => {
        dispatch(addCurrencyToInventory({ currency: item, quantity }))
      })
    }
  }, [wildMonsterCopy?.stats.hp])

  return (
    <>
      <main
        className={`combat-panel ${
          selectedPlayerMonster ? '--flex-row-reverse' : '--flex-column'
        }`}
      >
        {hasCombatEnded && winOrLose && (
          <Modal
            modalName={'Combat Result'}
            monsterDefeated={wildMonster}
            onCloseModal={handleCloseModal}
            itemsWon={lootList}
            currencyWon={currencyList}
            xpWon={xpGained}
            isCaptured={monsterCaptured}
          />
        )}
        <div className="combat-board">
          {hasInitBattle && playerMonsterCopy && (
            <div
              className={`player-board ${
                combatAnimation ? 'player-animation' : ''
              }`}
            >
              Your Monsters:
              <div className="player-monster-state"></div>
              <div className="player-monster-hp-name">
                {playerMonsterCopy?.stats.hp} /{' '}
                {selectedPlayerMonster?.stats.hp}
                <div
                  className="player-monster-hp-bar"
                  style={{
                    width: `${calculateHealthRatio(
                      playerMonsterCopy?.stats.hp,
                      selectedPlayerMonster?.stats.hp
                    )}%`,
                  }}
                ></div>
              </div>
              <MonsterCard
                monster={playerMonsterCopy}
                showStats={true}
                canAccessMenu={false}
              />
            </div>
          )}

          {hasInitBattle && (
            <div
              className={`ennemy-board ${
                combatAnimation ? 'monster-animation' : ''
              }`}
            >
              Wild Monsters:
              <div className="enemy-monster-state"></div>
              <div className="enemy-monster-hp-name">
                {wildMonsterCopy?.stats.hp} / {wildMonster?.stats.hp}
                <div
                  className="enemy-monster-hp-bar"
                  style={{
                    width: `${calculateHealthRatio(
                      wildMonsterCopy?.stats.hp,
                      wildMonster?.stats.hp
                    )}%`,
                  }}
                ></div>
              </div>
              <MonsterCard
                monster={wildMonsterCopy}
                showStats={false}
                isNew={isANewMonster}
              />
            </div>
          )}
        </div>
        {!hasPlayerChooseAMonster && (
          <MonsterSelection onMonsterSelect={handleMonsterSelection} />
        )}
        {hasPlayerChooseAMonster && (
          <ActionSelection
            playerMonster={playerMonsterCopy}
            wildMonster={wildMonsterCopy}
            onTurnEnd={handleTurnEnd}
            disableActionButton={combatAnimation || hasCombatEnded}
          />
        )}
      </main>
      {selectedPlayerMonster && (
        <aside className="combat-log">
          <h3>Combat log:</h3>
          <div className="combat-log-information">
            {logInformation.map((message, index) => (
              <span key={index}>{message}</span>
            ))}
          </div>
        </aside>
      )}
    </>
  )
}

export default RandomEncounter
