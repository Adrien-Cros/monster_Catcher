import { useState } from 'react'
import typesData from '../../../Data/types.json'
import PropTypes from 'prop-types'

import ShowCurrentInforForCapacity from '../../../System/Combat/ShowCurrentInfoForCapacity'

import './actionSelection.scss'

function ActionSelection({ monster, onTurnEnd, disableActionButton }) {
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
            key={capacity + index}
          >
            {capacity.name}
          </div>
        ))}
      </div>
      <div className="capacity-selection-menu">
        <div className="selection-button-capacity">Items</div>
        <div className="selection-button-capacity">Catch</div>
        <div className="selection-button-capacity">Escape</div>
      </div>
      {selectedCapacity && (
        <div className="selected-capacity-container">
          <div className="capacity-selected-info">
            <h2>{selectedCapacity.name}</h2>
            <p>Description: {selectedCapacity.description}</p>
            <div className="damage-info">
              <p>
                Damage:{' '}
                <ShowCurrentInforForCapacity
                  monster={monster}
                  capacity={selectedCapacity}
                  displayType="damageDealt"
                />
              </p>
              <p>
                Critical Strike Chance:{' '}
                <ShowCurrentInforForCapacity
                  monster={monster}
                  capacity={selectedCapacity}
                  displayType="critChance"
                />
                %
              </p>
              <p>
                Critical Strike Damage: x{selectedCapacity.details.critDamage}
              </p>
              <p>Penetration: {selectedCapacity.details.penetration}</p>
            </div>
            <p>Damage Type: {selectedCapacity.details.damageType}</p>
            <p className="element-details">
              Element:{' '}
              {selectedCapacity.details &&
                selectedCapacity.details.element &&
                selectedCapacity.details.element.map((elementId, index) => {
                  const elementDetails = typesData.types.find(
                    (t) => t.name === elementId
                  )
                  return (
                    elementDetails && (
                      <img
                        className="type-icon"
                        key={index}
                        src={elementDetails.icon}
                        alt={`Element ${elementId}`}
                      />
                    )
                  )
                })}
            </p>
          </div>
          {disableActionButton === false && (
            <div onClick={handleTurnEnd} className="selection-button-capacity">
              Confirm your turn
            </div>
          )}
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
  // Used to show or not the confirm action button
  disableActionButton: PropTypes.bool,
}

export default ActionSelection
