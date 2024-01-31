import './confirmationButton.scss'

function ConfirmationButton({ onButtonClick, buttonName }) {
  return (
    <button onClick={onButtonClick} className="close-button">
      {buttonName}
    </button>
  )
}

export default ConfirmationButton
