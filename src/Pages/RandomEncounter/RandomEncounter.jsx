import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import MonsterCard from '../../Components/MonsterCard/MonsterCard'
import GenerateMonster from '../../System/GenerateMonster/GenerateMonster'
import MonsterSelection from '../../Components/InCombat/MonsterSelection/MonsterSelection'
import ActionSelection from '../../Components/InCombat/ActionSelection/ActionSelection'
import CalculateDamage from '../../System/Combat/CalculateDamage'
import Modal from '../../Components/Modal/Modal'
import Loot from '../../System/Loot/Loot'

import './randomEncounter.scss'
import { addItemToInventory } from '../../Store/Slice/inventorySlice'

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

  //log informations
  const [logInformation, setLogInformation] = useState([])

  //used to check lootlist
  const [lootList, setLootList] = useState({})

  useEffect(() => {
    initBattle()
  }, [])

  const generateRandomMonster = () => {
    if (!hasChosenRandomMonster) {
      const randomMonster = GenerateMonster()
      if (randomMonster) {
        setWildMonster(randomMonster)
        setWildMonsterCopy(randomMonster)
        setHasChosenRandomMonster(true)
      }
    }
  }

  function handleMonsterSelection(monster) {
    setSelectedPlayerMonster(monster)
    setPlayerMonsterCopy(monster)
    setHasPlayerChooseAMonster(true)
  }

  const initBattle = () => {
    generateRandomMonster()
    setHasInitBattle(true)
  }

  const updateCombatLog = (message) => {
    setLogInformation((prevCombatLog) => [...prevCombatLog, message])
  }

  //handle the player turn
  const handlePlayerTurn = (selectedCapacity) => {
    const damageDealt = CalculateDamage({
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

    const damageDealt = CalculateDamage({
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
          console.log('player turn')
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
    } else if (isACaptureItem) {
      //TODO
    } else {
      console.log('Error in retrieving the type of the object')
    }
  }

  const handleCombatWon = () => {
    setHasCombatEnded(true)
    console.log('win')
    setWinOrLose(true) // true = win
  }

  const handleCombatLoose = () => {
    setHasCombatEnded(true)
    console.log('lose')
    setWinOrLose(false) // false = lose
    navigate('/main')
  }

  const handleCloseModal = () => {
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
      const lootedItem = Loot(wildMonster)
      setLootList(lootedItem)
      lootedItem.forEach(({ item, quantity }) => {
        dispatch(addItemToInventory({ item, quantity }))
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
              <MonsterCard monster={wildMonsterCopy} showStats={false} />
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
