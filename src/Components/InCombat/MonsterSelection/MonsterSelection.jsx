import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import MonsterCardClassic from '../../MonsterCard/MonsterCardClassic/MonsterCardClassic'
import MenuButton from '../../Button/MenuButton/MenuButton'
import './monsterSelection.scss'

function MonsterSelection({ onMonsterSelect }) {
  const playerTeam = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  //return the selected monster object
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
          <MenuButton
            key={index}
            boutonName={monster.name}
            onClick={() => handleSelectedMonster(monster)}
          />
          <MonsterCardClassic
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
