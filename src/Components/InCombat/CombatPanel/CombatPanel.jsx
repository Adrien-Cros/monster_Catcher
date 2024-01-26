import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import MonsterCard from '../../MonsterCard/MonsterCard'
import GenerateMonster from '../../../System/GenerateMonster/GenerateMonster'
import MonsterSelection from '../MonsterSelection/MonsterSelection'
import ActionSelection from '../ActionSelection/ActionSelection'
import CalculateDamage from '../../../System/Combat/CalculateDamage'
import Modal from '../../Modal/Modal'

import { setInDungeonStatus } from '../../../Store/Slice/gameStatusSlice'

import './combatPanel.scss'

function CombatPanel() {
  const dispatch = useDispatch()

  const [hasInitBattle, setHasInitBattle] = useState(false)
  const [hasChooseARandomMonster, setHasChooseARandomMonster] = useState(false)
  const [hasPlayerChooseAMonster, setHasPlayerChooseAMonster] = useState(false)
  const [chosenEnemyMonster, setChosenEnemyMonster] = useState(null)
  const [selectedPlayerMonster, setSelectedPlayerMonster] = useState(null)

  //copy the monster for modifying stats if needed for fight
  const [playerMonsterCopy, setPlayerMonsterCopy] = useState(null)
  const [wildMonsterCopy, setWildMonsterCopy] = useState(null)

  //used to play animation on monster
  const [combatAnimation, setCombatAnimation] = useState(false)

  //used to check if the combat has ended
  const [hasCombatEnded, setHasCombatEnded] = useState(false)

  useEffect(() => {
    initBattle()
  }, [hasInitBattle])

  const generateRandomMonster = () => {
    if (!hasChooseARandomMonster) {
      const randomMonster = GenerateMonster()
      if (randomMonster) {
        setChosenEnemyMonster(randomMonster)
        setWildMonsterCopy(randomMonster)
        setHasChooseARandomMonster(true)
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

  //handle the player turn
  const handlePlayerTurn = (selectedCapacity) => {
    const damageDealt = CalculateDamage({
      attacker: playerMonsterCopy,
      defender: wildMonsterCopy,
      capacityUsed: selectedCapacity,
    })
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

    setPlayerMonsterCopy((prevPlayerMonsterCopy) => ({
      ...prevPlayerMonsterCopy,
      stats: {
        ...prevPlayerMonsterCopy.stats,
        hp: Math.max(prevPlayerMonsterCopy.stats.hp - damageDealt, 0),
      },
    }))
  }

  // handle the sequential action when the player confirms the turn
  const handleTurnEnd = (selectedCapacity) => {
    setCombatAnimation(true)
    if (playerMonsterCopy.stats.speed >= wildMonsterCopy.stats.speed) {
      if (!hasCombatEnded) {
        handlePlayerTurn(selectedCapacity)
      }
      setTimeout(() => {
        if (!hasCombatEnded) {
          handleEnemyTurn()
          setCombatAnimation(false)
        }
      }, 1100)
    } else {
      if (!hasCombatEnded) {
        handleEnemyTurn()
      }
      setTimeout(() => {
        if (!hasCombatEnded) {
          handlePlayerTurn(selectedCapacity)
          setCombatAnimation(false)
        }
      }, 1100)
    }
  }

  useEffect(() => {
    if (wildMonsterCopy?.stats.hp <= 0) {
      setCombatAnimation(false)
      setHasCombatEnded(true)
      handleCombatWon()
    } else if (playerMonsterCopy?.stats.hp <= 0) {
      setCombatAnimation(false)
      setHasCombatEnded(true)
      handleCombatLoose()
    }
  }, [playerMonsterCopy, wildMonsterCopy])

  const handleCombatWon = () => {
    setHasCombatEnded(true)
  }

  const handleCombatLoose = () => {
    setHasCombatEnded(true)
  }

  //on close end, end the encounter and return to main menu
  const handleCloseModal = () => {
    setHasInitBattle(false)
    dispatch(setInDungeonStatus(false))
  }

  return (
    <main className="combat-panel">
      {hasCombatEnded && (
        <Modal
          capturedMonster={wildMonsterCopy}
          killedMonster={wildMonsterCopy}
          onCloseModal={handleCloseModal}
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
            <div className="player-monster-hp-bar">
              {playerMonsterCopy?.stats.hp} / {selectedPlayerMonster?.stats.hp}
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
            <div className="enemy-monster-hp-bar">
              {wildMonsterCopy?.stats.hp} / {chosenEnemyMonster?.stats.hp}
            </div>
            <MonsterCard monster={wildMonsterCopy} showStats={true} />
          </div>
        )}
      </div>
      {!hasPlayerChooseAMonster && (
        <MonsterSelection onMonsterSelect={handleMonsterSelection} />
      )}
      {hasPlayerChooseAMonster && (
        <ActionSelection
          monster={playerMonsterCopy}
          onTurnEnd={handleTurnEnd}
          disableActionButton={combatAnimation || hasCombatEnded}
        />
      )}
    </main>
  )
}

export default CombatPanel
