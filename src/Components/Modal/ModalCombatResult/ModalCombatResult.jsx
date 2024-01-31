import { useState } from 'react'
import PropTypes from 'prop-types'

import MonsterCard from '../../MonsterCard/MonsterCard'
import ConfirmationButton from '../../Button/ConfirmationButton/ConfirmationButton'

import './modalCombatResult.scss'

function ModalCombatResult({
  monsterDefeated,
  onCloseModal,
  modalName,
  itemsWon,
  isCaptured,
  xpWon,
  currencyWon,
}) {
  const [isOpen, setIsOpen] = useState(true)

  const handleCloseModal = () => {
    setIsOpen(false)
    onCloseModal()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal">
      <h3 className="modal-name">{modalName}</h3>
      {xpWon && <div className="combat-result">XP Gained: {xpWon}</div>}
      {(monsterDefeated || isCaptured) &&
        currencyWon !== null &&
        currencyWon.length > 0 && (
          <div className="combat-result">
            {currencyWon.map((loot, index) => (
              <div key={index} className="loot">
                {loot.item.name}
                <img src={loot.item.icon} alt={loot.item.name} />
                <span>{`Quantity: ${loot.quantity}`}</span>
              </div>
            ))}
          </div>
        )}
      {(monsterDefeated || isCaptured) &&
        itemsWon !== null &&
        itemsWon.length > 0 && (
          <div className="combat-result">
            {itemsWon.map((loot, index) => (
              <div key={index} className="loot">
                {loot.item.name}
                <img src={loot.item.icon} alt={loot.item.name} />
                <span>{`Quantity: ${loot.quantity}`}</span>
              </div>
            ))}
          </div>
        )}
      {isCaptured && (
        <div className="captured-monsters">
          There is a new monster in your team!
          <MonsterCard
            monster={monsterDefeated}
            canAccessMenu={false}
            showStats={true}
            canBeDelete={false}
          />
        </div>
      )}
      <ConfirmationButton
        onButtonClick={handleCloseModal}
        buttonName={'Accept All'}
      />
    </div>
  )
}

ModalCombatResult.propTypes = {
  // The data object representing the monster.
  monsterDefeated: PropTypes.object,
  // Callback function triggered when the modal close
  onCloseModal: PropTypes.func,
  // Name of the modal
  modalName: PropTypes.string,
  // Array contening item won
  itemsWon: PropTypes.array,
  // Captured the monster or not
  isCaptured: PropTypes.bool,
  // Quantity or xp gained
  xpWon: PropTypes.number,
  // Arraw contening currency won
  currencyWon: PropTypes.array,
}

export default ModalCombatResult
