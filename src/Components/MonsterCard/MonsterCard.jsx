import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import {
  addMonsterToTeam,
  removeMonsterFromTeam,
} from '../../Store/Slice/playerTeamSlice'
import {
  deleteMonsterFromListByKey,
  updateCapturedMonstersList,
} from '../../Store/Slice/monstersSlice'

import typesData from '../../Data/types.json'

import './monsterCard.scss'

function MonsterCard({
  monster,
  onDelete,
  canAccessMenu,
  canBeRemovedFromTeam,
  canBeDelete,
  showStats,
}) {
  const dispatch = useDispatch()

  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const [isMenuOpen, setMenuOpen] = useState(false)

  if (!monster) {
    return <div>Can't find monsters</div>
  }

  const handleDeleteClick = () => {
    onDelete(monster.uniqueKey)
    setMenuOpen(false)
  }

  const handleMoveToTeam = () => {
    if (teamMonsters.length <= 4) {
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

  return (
    <div className="monster-container">
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
      <div className="monster-name-id">
        <p className="monster-id">ID: {monster.id}</p>
        <h3 className="monster-container-name">{monster.name}</h3>
      </div>

      <div>
        <p className="lvl">Level: {monster.level}</p>
        <p className="xp">Exp: {monster.experience}</p>
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

      <div className="capacity">
        Capacity:
        {monster.capacities &&
          Object.values(monster.capacities)
            .slice(0, 4)
            .map(
              (capacity, index) =>
                capacity && <p key={index}>{capacity.name}</p>
            )}
      </div>

      <div className="traits">
        Traits:
        {monster.traits &&
          Object.values(monster.traits)
            .slice(0, 4)
            .map((trait, index) => trait && <p key={index}>{trait.name}</p>)}
      </div>
    </div>
  )
}

MonsterCard.propTypes = {
  // The data object representing the monster.
  monster: PropTypes.object.isRequired,
  // Callback function triggered when a delete action is performed on the monster. Return the monster.uniqueKey for the selected monster.
  onDelete: PropTypes.func,
  // Flag indicating whether the user has access to the menu for the monster.
  canAccessMenu: PropTypes.bool,
  // Flag indicating whether the monster can be removed from the team.
  canBeRemovedFromTeam: PropTypes.bool,
  // Flag indicating whether the delete action is allowed for the monster.
  canBeDelete: PropTypes.bool,
  // Flag indicating whether to display statistical information of the monster. Hide the entire menu button if set to false.
  showStats: PropTypes.bool,
}

export default MonsterCard
