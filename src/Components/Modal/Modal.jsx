import { useState } from 'react'
import PropTypes from 'prop-types'
import MonsterCard from '../MonsterCard/MonsterCard'
import './modal.scss'

function Modal({ monsterDefeated, onCloseModal, modalName, itemsWon }) {
  const [isOpen, setIsOpen] = useState(true)

  const handleCloseModal = () => {
    setIsOpen(false)
    onCloseModal()
  }

  if (!isOpen) {
    return null
  }

  return (
    <section className="modal">
      <h3 className="modal-name">{modalName}</h3>
      {monsterDefeated && itemsWon && (
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
      {monsterDefeated && (
        <div className="captured-monsters">
          There is a new monster in your team!
          <MonsterCard
            monster={monsterDefeated}
            canAccessMenu={true}
            showStats={true}
            canBeDelete={true}
          />
        </div>
      )}
      <button onClick={handleCloseModal} className="close-button">
        Accept All
      </button>
    </section>
  )
}

Modal.propTypes = {
  // The data object representing the monster.
  monsterDefeated: PropTypes.object,
  // Callback function triggered when the modal close
  onCloseModal: PropTypes.func,
  // Name of the modal
  modalName: PropTypes.string,
  // Array contening item won
  itemsWon: PropTypes.array,
}

export default Modal