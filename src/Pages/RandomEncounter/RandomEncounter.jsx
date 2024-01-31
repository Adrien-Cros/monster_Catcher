import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import generateMonster from '../../System/generateMonster/generateMonster'
import levelUp from '../../System/level/levelUp/levelUp'
import applyLevelToMonster from '../../System/level/applyLevelToMonster/applyLevelToMonster'

import MonsterCardClassic from '../../Components/MonsterCard/MonsterCardClassic/MonsterCardClassic'
import MonsterSelection from '../../Components/InCombat/MonsterSelection/MonsterSelection'
import ActionSelection from '../../Components/InCombat/ActionSelection/ActionSelection'
import ModalCombatResult from '../../Components/Modal/ModalCombatResult/ModalCombatResult'

import {
  addCurrencyToInventory,
  addItemToInventory,
} from '../../Store/Slice/inventorySlice'
import { setInRandomEncounter } from '../../Store/Slice/gameStatusSlice'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'
import { updateMonsterFromTeam } from '../../Store/Slice/playerTeamSlice'
import completeTurn from '../../System/combat/turnHandler/completeTurn'

import './randomEncounter.scss'

//This page render a full combat encounter with an HUD
function RandomEncounter() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [hasInitBattle, setHasInitBattle] = useState(false)
  const [hasChosenRandomMonster, setHasChosenRandomMonster] = useState(false)
  const [hasPlayerChooseAMonster, setHasPlayerChooseAMonster] = useState(false)
  const [wildMonster, setWildMonster] = useState(null)
  const [playerMonster, setPlayerMonster] = useState(null)

  //copy the monster for modifying stats if needed for fight
  const [playerMonsterCopy, setPlayerMonsterCopy] = useState(null)
  const [wildMonsterCopy, setWildMonsterCopy] = useState(null)

  //used to play animation on monster
  const [clashAnimation, setClashAnimation] = useState(false)

  //used to check if the combat has ended
  const [hasCombatEnded, setHasCombatEnded] = useState(false)
  const [winOrLose, setWinOrLose] = useState(null) //win=true, lose=false

  //combat log informations
  const [logInformation, setLogInformation] = useState([])

  //used to check the loot when the monster is killed
  const [lootList, setLootList] = useState([])
  const [currencyList, setCurrencyList] = useState([])

  //check if monster is captured, true or false
  const [monsterCaptured, setMonsterCaptured] = useState(false)

  //stored the xp win at the end of the fight
  const [xpGained, setXpGained] = useState(null)

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

  //check if the monster id is already in the team or the box the show new animation
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
    setPlayerMonster(monster)
    setPlayerMonsterCopy(monster)
    setHasPlayerChooseAMonster(true)
  }

  const updateCombatLog = (message) => {
    setLogInformation((prevCombatLog) => [...prevCombatLog, message])
  }

  const handleTurnEnd = (selectedCapacityOrItem) => {
    //Animation purpose
    setClashAnimation(true)

    // Clear animations after a delay
    setTimeout(() => {
      setClashAnimation(false)
    }, 1000)

    //select a random monster capacity
    const capacities = wildMonsterCopy.capacities
    const capacitiesArray = Object.values(capacities)
    const numberOfCapacities = capacitiesArray.length
    const randomIndex = Math.floor(Math.random() * numberOfCapacities)

    const monsterSelectedCapacity = capacitiesArray[randomIndex]

    const turnResult = completeTurn({
      playerMonster: playerMonsterCopy,
      enemyMonster: wildMonsterCopy,
      playerSelectedCapacityOrItem: selectedCapacityOrItem,
      monsterSelectedCapacity: monsterSelectedCapacity,
    })
    //update the log
    updateCombatLog(turnResult?.logMessage)
    //monster has been captured ?
    setMonsterCaptured(turnResult?.isMonsterCaptured)
    //if monster is successfully captured, add it to the box
    if (turnResult?.isMonsterCaptured) {
      dispatch(updateCapturedMonstersList(wildMonster))
    }
    //combat has ended ?
    if (turnResult?.combatEnd) {
      //player won or loose ?
      if (turnResult?.combatWon) {
        //Check loot item in the killed monster
        const lootedItem = turnResult?.itemsLoot
        if (lootedItem) {
          setLootList(lootedItem)
          lootedItem.forEach(({ item, quantity }) => {
            dispatch(addItemToInventory({ item, quantity }))
          })
        }
        //Check loot currency
        const lootedCurrency = turnResult?.currencyLoot
        if (lootedCurrency) {
          setCurrencyList(lootedCurrency)
          lootedCurrency.forEach(({ item, quantity }) => {
            dispatch(addCurrencyToInventory({ currency: item, quantity }))
          })
        }
        // if combat won = true
        setWinOrLose(turnResult?.combatWon)
      } else {
        // if combat lose = false
        setWinOrLose(turnResult?.combatWon)
      }
    } else {
      //Combat isnt finish, extract the value of the turn result to the monster for the hud update

      setWildMonsterCopy(turnResult?.enemyMonster)
      setPlayerMonsterCopy(turnResult?.playerMonster)
    }
  }

  useEffect(() => {
    setClashAnimation(false)
    const handleCombatWon = () => {
      //check for lvl up et xp won
      const result = levelUp({
        victoriousMonster: playerMonster,
        defeatedMonster: wildMonster,
      })
      //Update the state
      setXpGained(result.xpWon)
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
    if (winOrLose === true) {
      handleCombatWon()
    } else if (winOrLose === false) {
      handleCombatLoose()
    }
  }, [winOrLose])

  const handleCloseModal = () => {
    dispatch(setInRandomEncounter(false))
    navigate('/main')
  }

  const calculateHealthRatio = (currentHP, maxHP) => {
    return (currentHP / maxHP) * 100
  }

  return (
    <>
      <main
        className={`combat-panel ${
          playerMonster ? '--flex-row-reverse' : '--flex-column'
        }`}
      >
        {hasCombatEnded && winOrLose && (
          <ModalCombatResult
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
                clashAnimation ? 'player-animation' : ''
              }`}
            >
              Your Monsters:
              <div className="player-monster-state"></div>
              <div
                className="player-monster-hp-bar"
                style={{
                  width: `${calculateHealthRatio(
                    playerMonsterCopy?.stats.hp,
                    playerMonster?.stats.hp
                  )}%`,
                }}
              >
                <div className="player-monster-hp-name">
                  {playerMonsterCopy?.stats.hp} / {playerMonster?.stats.hp}
                </div>
              </div>
              <MonsterCardClassic
                monster={playerMonsterCopy}
                showStats={true}
                canAccessMenu={false}
              />
            </div>
          )}

          {hasInitBattle && wildMonsterCopy && (
            <div
              className={`ennemy-board ${
                clashAnimation ? 'monster-animation' : ''
              }`}
            >
              Wild Monsters:
              <div className="enemy-monster-state"></div>
              <div
                className="enemy-monster-hp-bar"
                style={{
                  width: `${calculateHealthRatio(
                    wildMonsterCopy?.stats.hp,
                    wildMonster?.stats.hp
                  )}%`,
                }}
              >
                <div className="enemy-monster-hp-name">
                  {wildMonsterCopy?.stats.hp} / {wildMonster?.stats.hp}
                </div>
              </div>
              <MonsterCardClassic
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
        {hasPlayerChooseAMonster && hasCombatEnded === false && (
          <ActionSelection
            playerMonster={playerMonster}
            wildMonster={wildMonster}
            onTurnEnd={handleTurnEnd}
            disableActionButton={clashAnimation || hasCombatEnded}
            canChooseAnAction={true}
          />
        )}
      </main>
      {playerMonster && (
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
