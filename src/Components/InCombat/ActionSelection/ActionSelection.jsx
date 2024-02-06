import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import typesData from '../../../Data/types.json'
import PropTypes from 'prop-types'

import calculateCurrentInforForCapacity from '../../../System/combat/calculateCurrentInfoForCapacity'
import catchRateHelpers from '../../../System/combat/catch/catchRateHelper'

import './actionSelection.scss'

function ActionSelection({
  playerMonster,
  wildMonster,
  onTurnEnd,
  disableActionButton,
  canChooseAnAction,
}) {
  const navigate = useNavigate()

  const playerInventory = useSelector((state) => state.inventory.inventory)

  const captureItemList = playerInventory.filter((item) =>
    item.type.includes('Capture')
  )

  const [selectedCapacity, setSelectedCapacity] = useState(null)
  const [selectedCaptureItem, setSelectedCaptureItem] = useState(null)
  const [showCaptureObject, setShowCaptureObject] = useState(null)

  const capacitiesArray = Object.values(playerMonster.capacities)

  function handleSelectedCapacity(capacity) {
    setShowCaptureObject(null)
    setSelectedCaptureItem(null)
    setSelectedCapacity(capacity)
  }

  const handleTurnEnd = () => {
    // Pass the selectedCapacity to the parent component can be object or capacity
    onTurnEnd(selectedCapacity)
  }

  const handleEscape = () => {
    const confirmationLeaving = window.confirm(
      'Do you want to escape the fight ?'
    )

    if (confirmationLeaving) {
      navigate('/main')
    }
  }

  const handleCatch = () => {
    setSelectedCapacity(null)

    if (showCaptureObject === null) {
      setShowCaptureObject(captureItemList)
    } else {
      setShowCaptureObject(null)
    }
  }

  function handleSelectedCaptureItem(captureItem) {
    setSelectedCaptureItem(captureItem)
  }

  function handleTryCapture(selectedCaptureItem) {
    onTurnEnd(selectedCaptureItem)
  }

  return (
    <div className="action-menu">
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

      {canChooseAnAction && (
        <div className="capacity-selection-menu">
          Or choose an action:
          <div className="selection-button-capacity">Use items</div>
          <div onClick={handleCatch} className="selection-button-capacity">
            Try to catch
          </div>
          <div onClick={handleEscape} className="selection-button-capacity">
            Escape
          </div>
        </div>
      )}

      {selectedCapacity && (
        <div className="selected-capacity-container">
          <div className="capacity-selected-info">
            <h2>{selectedCapacity.name}</h2>
            <p>Description: {selectedCapacity.description}</p>
            <div className="damage-info">
              <p>
                Damages:{' '}
                {calculateCurrentInforForCapacity({
                  monster: playerMonster,
                  capacity: selectedCapacity,
                  displayType: 'damageDealt',
                })}
              </p>
              <p>
                Critical Strike Chance:{' '}
                {calculateCurrentInforForCapacity({
                  monster: playerMonster,
                  capacity: selectedCapacity,
                  displayType: 'critChance',
                })}
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
      {showCaptureObject && (
        <div className="selected-capacity-container">
          <div className="capacity-selected-info">
            {captureItemList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelectedCaptureItem(item)}
                className={`item-selection-button ${
                  selectedCaptureItem === item ? '--selected' : ''
                }`}
              >
                {item.name}
                <img className="--icon" src={item.icon} alt={item.name} />
                <span className="--quantity">
                  Quantity: {item.quantityPossessed}
                </span>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          {selectedCaptureItem !== null &&
            disableActionButton === false &&
            captureItemList.length !== 0 && (
              <div
                onClick={() => handleTryCapture(selectedCaptureItem)}
                className="selection-button-capacity"
              >
                {selectedCaptureItem
                  ? `Try to capture ${wildMonster.name} (level: ${
                      wildMonster.level
                    }) with ${selectedCaptureItem.name} (${Math.min(
                      100,
                      100 -
                        (catchRateHelpers({ monster: wildMonster }) -
                          selectedCaptureItem.effect.chanceToCapture)
                    )}%) ?`
                  : 'Select a capture item to catch this monster!'}
              </div>
            )}
        </div>
      )}
    </div>
  )
}

ActionSelection.propTypes = {
  // The data object representing the player monster.
  playerMonster: PropTypes.object.isRequired,
  // The data object representing the wild monster.
  wildMonster: PropTypes.object.isRequired,
  // Callback function triggered when the turn end function is performed on the monster. Return the capacity selected by the player.
  onTurnEnd: PropTypes.func,
  // Used to show or not the confirm action button
  disableActionButton: PropTypes.bool,
  // Used to show or not the action div
  canChooseAnAction: PropTypes.bool,
}

export default ActionSelection
