import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import {
  addMonsterToTeam,
  removeMonsterFromTeam,
} from '../../../Store/Slice/playerTeamSlice'
import {
  deleteMonsterFromListByKey,
  updateCapturedMonstersList,
} from '../../../Store/Slice/monstersSlice'

import typesData from '../../../Data/types.json'
import levelsData from '../../../Data/monsterLevels.json'

import calculateCurrentInfoForCapacity from '../../../System/combat/calculateCurrentInfoForCapacity'

import './monsterCardClassic.scss'

/**
 * @param {Object} props -
 * @param {MonsterObject} props.monster
 * @param {function} props.onDelete
 * @param {boolean} props.isNew
 * @param {boolean} props.canAccessMenu
 * @param {boolean} props.canBeRemovedFromTeam
 * @param {boolean} props.canBeDelete
 * @param {boolean} props.showStats
 */

function MonsterCardClassic({
  monster,
  isNew,
  onDelete,
  canAccessMenu,
  canBeRemovedFromTeam,
  canBeDelete,
  showStats,
}) {
  const dispatch = useDispatch()

  const [isMenuOpen, setMenuOpen] = useState(false)

  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipInformation, setTooltipInformation] = useState(null)

  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const maxMonsterInTeam = useSelector(
    (state) => state.config.maxMonstersInTeam
  )

  //Handle the case for monster not found
  if (!monster) {
    return <div>Can't find monsters</div>
  }

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

  //Used to show the actual xp to next
  const monsterActualLevel = monster.level
  const xpToNext = levelsData.levels.find(
    (level) => level.level === monsterActualLevel
  )?.xpRequiredToNext

  const handleDeleteClick = () => {
    onDelete(monster.uniqueKey)
    setMenuOpen(false)
  }

  const handleMoveToTeam = () => {
    if (teamMonsters.length < maxMonsterInTeam) {
      dispatch(addMonsterToTeam(monster))
      dispatch(deleteMonsterFromListByKey({ uniqueKey: monster.uniqueKey }))
      setMenuOpen(false)
    } else {
      alert("you can't add more monster")
      setMenuOpen(false)
    }
  }

  const handleRemoveFromTeam = () => {
    dispatch(removeMonsterFromTeam({ uniqueKey: monster.uniqueKey }))
    dispatch(updateCapturedMonstersList(monster))
    setMenuOpen(false)
  }

  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen)
  }

  const handleOverItem = (item) => {
    setTooltipInformation(item)
    setShowTooltip(true)
  }

  const handleLeaveHoverItem = () => {
    setShowTooltip(false)
    setTooltipInformation(null)
  }

  return (
    <div
      className="monster-container"
      style={{ backgroundColor: monsterContainerColor }}
    >
      {canAccessMenu === true && (
        <div className="menu-container">
          <button onClick={handleMenuClick} className="monster-menu-button">
            ...
          </button>
          {isMenuOpen && (
            <>
              {canBeRemovedFromTeam === false && (
                <button onClick={handleMoveToTeam} className="move-button">
                  Move to your team
                </button>
              )}
              {canBeRemovedFromTeam === true && (
                <button
                  onClick={handleRemoveFromTeam}
                  className="remove-button"
                >
                  Move to your box
                </button>
              )}
              <button className="rename-button">Rename</button>
              {canBeDelete === true && (
                <button onClick={handleDeleteClick} className="delete-button">
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      )}
      {isNew && <div className="monster-new new-animation">New</div>}
      <div className="monster-name-id">
        <p className="monster-id">ID: {monster.id}</p>
        <h3 className="monster-container-name">{monster.name}</h3>
      </div>

      <div>
        <p className="lvl">Level: {monster.level}</p>
        <p className="xp">
          Exp: {monster.experience} / {xpToNext} to next
        </p>
      </div>
      <div>
        {monster.race && <p className="race">{monster.race.join(' ')}</p>}
        {monster.type && (
          <p className="type">
            {monster.type.map((typeId, index) => (
              <img
                className="type-icon"
                key={index}
                src={typesData.types.find((t) => t.name === typeId)?.icon}
                alt={`Type ${typeId}`}
              />
            ))}
          </p>
        )}
      </div>
      <img className="monster-icon" src={monster.picture} alt={monster.name} />
      <p className="description">{monster.description}</p>
      {showStats && (
        <div className="stats">
          <p>HP: {monster.stats?.hp}</p>
          <p>Attack: {monster.stats?.attack}</p>
          <p>Magic: {monster.stats?.magic}</p>
          <p>Defense: {monster.stats?.defense}</p>
          <p>Spirit: {monster.stats?.spirit}</p>
          <p>Speed: {monster.stats?.speed}</p>
          <p>Despair: {monster.stats?.despair}</p>
          <p>Luck: {monster.stats?.luck}</p>
        </div>
      )}
      {showTooltip && tooltipInformation && tooltipInformation.details && (
        <div className="tooltip-container">
          <p>
            Base Damage: {tooltipInformation.details?.base} (Actual:{' '}
            {calculateCurrentInfoForCapacity({
              monster: monster,
              capacity: tooltipInformation,
              displayType: 'damageDealt',
            })}
            )
          </p>

          <p>
            Crit Chance: {tooltipInformation.details?.critChance}% (Actual:{' '}
            {calculateCurrentInfoForCapacity({
              monster: monster,
              capacity: tooltipInformation,
              displayType: 'critChance',
            })}
            %)
          </p>
          <p>Crit Damage: x{tooltipInformation.details?.critDamage}</p>
          <p>Penetration: {tooltipInformation.details?.penetration}</p>
          <p>Variance: {tooltipInformation.details?.variance}%</p>
          <p>Scaling: {tooltipInformation.details?.scaling}</p>
          <p>Type: {tooltipInformation.details?.damageType[0]}</p>
          <p>Element: {tooltipInformation.details?.element[0]}</p>
        </div>
      )}
      {showTooltip &&
        tooltipInformation &&
        tooltipInformation.effectOnStats && (
          <div className="tooltip-container-light">
            <p>{tooltipInformation.description}</p>
          </div>
        )}

      <div className="capacity">
        Capacity:
        {monster.capacities &&
          Object.values(monster.capacities)
            .slice(0, 4)
            .map(
              (capacity, index) =>
                capacity && (
                  <p
                    key={index}
                    onMouseEnter={() => handleOverItem(capacity)}
                    onMouseLeave={handleLeaveHoverItem}
                  >
                    {capacity.name}
                  </p>
                )
            )}
      </div>

      <div className="traits">
        Traits:
        {monster.traits &&
          Object.values(monster.traits)
            .slice(0, 4)
            .map(
              (trait, index) =>
                trait && (
                  <p
                    key={index}
                    onMouseEnter={() => handleOverItem(trait)}
                    onMouseLeave={handleLeaveHoverItem}
                  >
                    {trait.name}
                  </p>
                )
            )}
      </div>
    </div>
  )
}

MonsterCardClassic.propTypes = {
  // The data object representing the monster.
  monster: PropTypes.object.isRequired,
  // Callback function triggered when a delete action is performed on the monster. Return the monster.uniqueKey for the selected monster.
  onDelete: PropTypes.func,
  // Flag indicating whether the user has access to the menu for the monster.
  canAccessMenu: PropTypes.bool,
  // Flag indicating whether the user already have the monster, showing a special icon.
  isNew: PropTypes.bool,
  // Flag indicating whether the monster can be removed from the team.
  canBeRemovedFromTeam: PropTypes.bool,
  // Flag indicating whether the delete action is allowed for the monster.
  canBeDelete: PropTypes.bool,
  // Flag indicating whether to display statistical information of the monster. Hide the entire menu button if set to false.
  showStats: PropTypes.bool,
}

export default MonsterCardClassic
