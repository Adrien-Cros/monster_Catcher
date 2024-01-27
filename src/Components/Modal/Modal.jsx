import { useState } from 'react'
import MonsterCard from '../MonsterCard/MonsterCard'
import './modal.scss'

function Modal({ capturedMonster, killedMonster, onCloseModal }) {
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
      <h3 className="modal-name">Modal</h3>
      {killedMonster && (
        <div className="combat-result">
          <div className="loot">
            loot 1:
            <img src="placeholder" alt="placeholder" />
          </div>
          <div className="loot">
            loot 2:
            <img src="placeholder" alt="placeholder" />
          </div>
          <div className="loot">
            loot 3:
            <img src="placeholder" alt="placeholder" />
          </div>
        </div>
      )}
      {capturedMonster && (
        <div className="captured-monsters">
          There is a new monster in your team!
          <MonsterCard
            monster={capturedMonster}
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

export default Modal
