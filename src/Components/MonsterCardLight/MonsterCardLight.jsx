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

import './monsterCardLight.scss'

function MonsterCardLight({
  monster,
  onDelete,
  canAccessMenu,
  canBeRemovedFromTeam,
  canBeDelete,
}) {
  const dispatch = useDispatch()

  const [isMenuOpen, setMenuOpen] = useState(false)

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
    }
  }

  const handleDeleteClick = () => {
    onDelete(monster.uniqueKey)
    setMenuOpen(false)
  }

  //Remove the monster from the box and put it in the team
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

  return (
    <div
      className="monster-container-light"
      style={{ backgroundColor: monsterContainerColor }}
    >
      <img
        className="monster-icon-light"
        src={monster.picture}
        alt={monster.name}
      />
      {canAccessMenu === true && (
        <div className="menu-container-light">
          <button
            onClick={handleMenuClick}
            className="monster-menu-button-light"
          >
            ...
          </button>
          {isMenuOpen && (
            <>
              {canBeRemovedFromTeam === false && (
                <button
                  onClick={handleMoveToTeam}
                  className="move-button-light"
                >
                  Move to your team
                </button>
              )}
              {canBeRemovedFromTeam === true && (
                <button
                  onClick={handleRemoveFromTeam}
                  className="remove-button-light"
                >
                  Move to your box
                </button>
              )}
              <button className="rename-button-light">Rename</button>
              {canBeDelete === true && (
                <button
                  onClick={handleDeleteClick}
                  className="delete-button-light"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      )}
      <div className="monster-name-id-light">
        <h3 className="monster-container-name-light">{monster.name}</h3>
      </div>
      <div>
        <p className="lvl-light">Level: {monster.level}</p>
      </div>
    </div>
  )
}

MonsterCardLight.propTypes = {
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

export default MonsterCardLight
