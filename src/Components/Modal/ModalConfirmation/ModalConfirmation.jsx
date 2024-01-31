import PropTypes from 'prop-types'
import { useState } from 'react'

import ConfirmationButton from '../../Button/ConfirmationButton/ConfirmationButton'
import './modalConfirmation.scss'

function ModalConfirmation({
  onAccept,
  onDecline,
  modalName,
  modalDescription,
}) {
  const [isOpen, setIsOpen] = useState(true)

  const handleAccept = () => {
    setIsOpen(false)
    onAccept()
  }

  const handleDecline = () => {
    setIsOpen(false)
    onDecline()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal">
      <h3 className="modal-name">{modalName}</h3>
      {modalDescription && (
        <div className="combat-result">{modalDescription}</div>
      )}
      <div className="button-container">
        <ConfirmationButton
          onButtonClick={handleAccept}
          buttonName={'Accept'}
        />
        <ConfirmationButton
          onButtonClick={handleDecline}
          buttonName={'Decline'}
        />
      </div>
    </div>
  )
}

ModalConfirmation.propTypes = {
  // Callback function triggered on accept
  onAccept: PropTypes.func,
  // Callback function triggered on decline
  onDecline: PropTypes.func,
  // Name of the modal
  modalName: PropTypes.string,
  // Informations to display
  modalDescription: PropTypes.string,
}

export default ModalConfirmation
