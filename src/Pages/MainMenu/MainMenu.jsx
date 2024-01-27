import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ButtonTryCapture from '../../Components/ButtonTryCapture/ButtonTryCapture'
import PlayerBox from '../../Components/PlayerBox/PlayerBox'
import PlayerTeam from '../../Components/PlayerTeam/PlayerTeam'

import './mainMenu.scss'
import { useNavigate } from 'react-router-dom'

function MainMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPlayerBox, setShowPlayerBox] = useState(false)

  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const togglePlayerBox = () => {
    setShowPlayerBox(!showPlayerBox)
  }

  const handleCombat = () => {
    if (teamMonsters.length <= 0) {
      alert('You need at least 1 monster in your team before entering')
    } else {
      navigate('/random-encounter')
    }
  }

  return (
    <>
      <main className="main-menu">
        <div className="mission-button">
          <button onClick={handleCombat}>Random encounter</button>
          <button>Explore a specific zone</button>
          <button>Raid a boss</button>
        </div>
        <section>
          {showPlayerBox && (
            <>
              <div className="player-monsters-equip">
                <PlayerTeam canAccessMonsterMenu={true} />
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
    </>
  )
}

export default MainMenu
