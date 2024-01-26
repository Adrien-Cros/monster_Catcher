import { useState } from 'react'
import { useSelector } from 'react-redux'

import ButtonTryCapture from '../ButtonTryCapture/ButtonTryCapture'
import CombatPanel from '../InCombat/CombatPanel/CombatPanel'
import PlayerBox from '../PlayerBox/PlayerBox'
import PlayerTeam from '../PlayerTeam/PlayerTeam'

import './mainMenu.scss'

function MainMenu() {
  const [showPlayerBox, setShowPlayerBox] = useState(false)
  const [inDungeonExploration, setInDungeonExploration] = useState(false)

  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const togglePlayerBox = () => {
    setShowPlayerBox(!showPlayerBox)
  }

  const handleCombat = () => {
    if (teamMonsters.length <= 0) {
      alert('You need atleast 1 monster in your team before entering')
    } else {
      setInDungeonExploration(true)
    }
  }

  return (
    <>
      {inDungeonExploration === false && (
        <main className="main-menu">
          <div className="mission-button">
            <button onClick={handleCombat}>Explore a random dungeon</button>
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
      )}
      {inDungeonExploration === true && (
        <>
          <CombatPanel />
        </>
      )}
    </>
  )
}

export default MainMenu
