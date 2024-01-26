import { useState } from 'react'
import PropTypes from 'prop-types'
import './actionSelection.scss'

function ActionSelection({ monster, onTurnEnd }) {
  const [selectedCapacity, setSelectedCapacity] = useState(null)

  const capacitiesArray = Object.values(monster.capacities)

  function handleSelectedCapacity(capacity) {
    setSelectedCapacity(capacity)
  }

  const handleTurnEnd = () => {
    // Pass the selectedCapacity to the parent component
    onTurnEnd(selectedCapacity)
  }
  return (
    <>
      <div className="capacity-selection-menu">
        Select a capacity:
        {capacitiesArray.map((capacity, index) => (
          <div
            onClick={() => handleSelectedCapacity(capacity)}
            className="selection-button-capacity"
            key={index}
          >
            {capacity.name}
          </div>
        ))}
      </div>
      <div className="capacity-selection-menu">
        <div className="selection-button-capacity">Items</div>
        <div className="selection-button-capacity">Escape</div>
      </div>
      {selectedCapacity && (
        <div className="selected-capacity-container">
          <div className="capacity-selected-info">
            <h2>{selectedCapacity.name}</h2>
            <p>Description: {selectedCapacity.description}</p>
            <div className="damage-info">
              <p>Damage: {selectedCapacity.details.base}</p>
              <p>
                Critical Strike Chance: {selectedCapacity.details.critChance}%
              </p>
              <p>
                Critical Strike Damage: x{selectedCapacity.details.critDamage}
              </p>
              <p>Penetration: {selectedCapacity.details.penetration}</p>
            </div>
            <p>Damage Type: {selectedCapacity.details.damageType}</p>
            <p>Element: {selectedCapacity.details.element}</p>
          </div>
          <div onClick={handleTurnEnd} className="selection-button-capacity">
            Confirm your turn
          </div>
        </div>
      )}
    </>
  )
}

ActionSelection.propTypes = {
  // The data object representing the monster.
  monster: PropTypes.object.isRequired,
  // Callback function triggered when the turn end function is performed on the monster. Return the capacity selected by the player.
  onTurnEnd: PropTypes.func,
}

export default ActionSelection
