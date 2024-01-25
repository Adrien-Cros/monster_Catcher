import './header.scss'

function Header() {
  const handleMainMenu = (e) => {
    e.preventDefault()
  }

  return (
    <header>
      <h1>Le Jeu</h1>
      <div className="menu">
        <nav className="navbar">
          <button onClick={handleMainMenu}>Main Menu</button>
          <button>Menu 3</button>
          <button>Menu 4</button>
        </nav>
      </div>
    </header>
  )
}

export default Header
