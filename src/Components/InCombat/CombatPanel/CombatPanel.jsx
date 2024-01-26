import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import MonsterCard from '../../MonsterCard/MonsterCard'
import GenerateMonster from '../../../System/GenerateMonster/GenerateMonster'
import MonsterSelection from '../MonsterSelection/MonsterSelection'
import ActionSelection from '../ActionSelection/ActionSelection'
import CalculateDamage from '../../../System/Combat/CalculateDamage'

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
  const [wildMonsterCopy, setwildMonsterCopy] = useState(null)

  //used to play animation on monster
  const [playerMonsterAnimation, setPlayerMonsterAnimation] = useState(false)
  const [wildMonsterAnimation, setWildMonsterAnimation] = useState(false)

  useEffect(() => {
    initBattle()
  })

  const generateRandomMonster = () => {
    if (!hasChooseARandomMonster) {
      const randomMonster = GenerateMonster()
      if (randomMonster) {
        setChosenEnemyMonster(randomMonster)
        setwildMonsterCopy(randomMonster)
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

  const handleTurnEnd = (selectedCapacity) => {
    setPlayerMonsterAnimation(true)
    const damageDealt = CalculateDamage({
      attacker: playerMonsterCopy,
      defender: wildMonsterCopy,
      capacityUsed: selectedCapacity,
    })
    console.log('damage: ', damageDealt)
    // Enemy's turn
    setWildMonsterAnimation(true)
  }

  return (
    <main className="combat-panel">
      <div className="combat-board">
        {hasInitBattle && playerMonsterCopy && (
          <div
            className={`player-board ${
              playerMonsterAnimation === true ? 'player-animation' : ''
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
            className={`ennemy-board monster-apparation ${
              wildMonsterAnimation === true ? 'monster-animation' : ''
            }`}
          >
            Wild Monsters:
            <div className="enemy-monster-state"></div>
            <div className="enemy-monster-hp-bar">
              {wildMonsterCopy?.stats.hp} / {chosenEnemyMonster?.stats.hp}
            </div>
            <MonsterCard monster={wildMonsterCopy} />
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
        />
      )}
    </main>
  )
}

export default CombatPanel
