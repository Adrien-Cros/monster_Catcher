import './menuButton.scss'

function MenuButton({ boutonName, onClick }) {
  return (
    <div onClick={onClick} className="menu-button">
      {boutonName}
    </div>
  )
}

export default MenuButton
