import { useState } from 'react'

import ButtonTryCapture from '../ButtonTryCapture/ButtonTryCapture'
import PlayerBox from '../PlayerBox/PlayerBox'
import PlayerTeam from '../PlayerTeam/PlayerTeam'

import './mainMenu.scss'

function MainMenu() {
  const [showPlayerBox, setShowPlayerBox] = useState(false)

  const togglePlayerBox = () => {
    setShowPlayerBox(!showPlayerBox)
  }

  return (
    <main className="main-menu">
      <div className="mission-button">
        <button>Explore a random dungeon</button>
        <button>Explore a specific zone</button>
        <button>Raid a boss</button>
      </div>
      <section>
        {showPlayerBox && (
          <>
            <div className="player-monsters-equip">
              <PlayerTeam />
            </div>
            <div className="player-box">
              <PlayerBox />
            </div>
          </>
        )}
        <div className="menu-button">
          {showPlayerBox === false && (
            <button onClick={togglePlayerBox}>Show Stocked Monsters</button>
          )}
          {showPlayerBox === true && (
            <button onClick={togglePlayerBox}>Hide Stocked Monsters</button>
          )}
          <button>Show Inventory</button>
        </div>
      </section>
    </main>
  )
}

export default MainMenu
