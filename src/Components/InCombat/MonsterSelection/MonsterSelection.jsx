import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import MonsterCard from '../../MonsterCard/MonsterCard'
import './monsterSelection.scss'

function MonsterSelection({ onMonsterSelect }) {
  const playerTeam = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  function handleSelectedMonster(monster) {
    onMonsterSelect(monster)
  }

  return (
    <div className="selection-menu">
      {playerTeam.map((monster, index) => (
        <div
          key={monster.uniqueKey + index}
          className="monster-selection-container"
        >
          <button
            onClick={() => handleSelectedMonster(monster)}
            key={index}
            className="selection-button"
          >
            Select {monster.name}
          </button>
          <MonsterCard
            key={monster.uniqueKey}
            monster={monster}
            showStats={true}
          />
        </div>
      ))}
    </div>
  )
}

MonsterSelection.propTypes = {
  // Callback function triggered when monster have been choosen by the player. Return selected monster object.
  onMonsterSelect: PropTypes.func,
}

export default MonsterSelection
