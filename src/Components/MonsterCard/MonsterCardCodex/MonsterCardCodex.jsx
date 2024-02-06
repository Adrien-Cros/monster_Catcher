import PropTypes from 'prop-types'
import typesData from '../../../Data/types.json'

import './monsterCardCodex.scss'

/**
 * @param {Object} props -
 * @param {MonsterObject} props.monster
 */

function MonsterCardClassic({ monster }) {
  // Used to change the background color depending on the monster type
  // Need to find a way to double types
  let monsterContainerColor = '#332b2b' // Default color

  if (monster.type) {
    if (monster.type.includes('Fire')) {
      monsterContainerColor = '#530c0f'
    } else if (monster.type.includes('Dark')) {
      monsterContainerColor = '#2d0627'
    } else if (monster.type.includes('Ice')) {
      monsterContainerColor = '#056777'
    } else if (monster.type.includes('Lightning')) {
      monsterContainerColor = '#716400'
    } else if (monster.type.includes('Water')) {
      monsterContainerColor = '#203d95'
    } else if (monster.type.includes('Holy')) {
      monsterContainerColor = '#665548'
    } else if (monster.type.includes('Arcane')) {
      monsterContainerColor = '#911951'
    }
  }

  return (
    <div
      className="monster-container-codex"
      style={{ backgroundColor: monsterContainerColor }}
    >
      <div className="monster-name-id">
        <p className="monster-id">ID: {monster.id}</p>
        <h3 className="monster-container-name">{monster.name}</h3>
      </div>

      <div>
        {monster.race && <p className="race">{monster.race.join(' ')}</p>}
        {monster.type && (
          <div className="type">
            <p className="type">Rarity: {monster.rarity}</p>
            {monster.type.map((typeId, index) => (
              <img
                className="type-icon"
                key={index}
                src={typesData.types.find((t) => t.name === typeId)?.icon}
                alt={`Type ${typeId}`}
              />
            ))}
          </div>
        )}
      </div>
      <img
        className="monster-icon-codex"
        src={monster.picture}
        alt={monster.name}
      />
      <p className="description">{monster.description}</p>
      <div className="stats-codex">
        <p>HP: {monster.stats?.hp}</p>
        <p>Attack: {monster.stats?.attack}</p>
        <p>Magic: {monster.stats?.magic}</p>
        <p>Defense: {monster.stats?.defense}</p>
        <p>Spirit: {monster.stats?.spirit}</p>
        <p>Speed: {monster.stats?.speed}</p>
        <p>Despair: {monster.stats?.despair}</p>
        <p>Luck: {monster.stats?.luck}</p>
      </div>
    </div>
  )
}

MonsterCardClassic.propTypes = {
  // The data object representing the monster.
  monster: PropTypes.object.isRequired,
}

export default MonsterCardClassic
