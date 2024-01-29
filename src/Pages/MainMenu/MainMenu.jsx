import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ButtonTryCapture from '../../Components/ButtonTryCapture/ButtonTryCapture'
import PlayerBox from '../../Components/PlayerBox/PlayerBox'
import PlayerTeam from '../../Components/PlayerTeam/PlayerTeam'
import PlayerInventory from '../../Components/PlayerInventory/PlayerInventory'
import StarterMonsterSelection from '../../Components/StarterMonsterSelection/StarterMonsterSelection'

import './mainMenu.scss'
import { useNavigate } from 'react-router-dom'
import { setInRandomEncounter } from '../../Store/Slice/gameStatusSlice'

function MainMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  //hide or show player box/team
  const [showPlayerBox, setShowPlayerBox] = useState(false)
  //hide or show inventory
  const [showInventory, setShowInventory] = useState(false)
  //used to change the view
  const [cardStyle, setCardStyle] = useState('Light')

  //change the card view
  const handleChangeView = () => {
    if (cardStyle === 'Classic') {
      setCardStyle('Light')
    } else if (cardStyle === 'Light') {
      setCardStyle('Classic')
    }
  }

  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const alreadyHaveStarter = useSelector(
    (state) => state.config.alreadyHaveStarter
  )

  const togglePlayerBox = () => {
    setShowInventory(false)
    setShowPlayerBox(!showPlayerBox)
  }

  const toggleInventory = () => {
    setShowPlayerBox(false)
    setShowInventory(!showInventory)
  }

  const handleCombat = () => {
    if (teamMonsters.length <= 0) {
      alert('You need at least 1 monster in your team before entering')
    } else {
      dispatch(setInRandomEncounter(true))
      navigate('/random-encounter')
    }
  }

  return (
    <main className="main-menu">
      {alreadyHaveStarter ? (
        <>
          <div className="mission-button">
            <button onClick={handleCombat}>Random encounter</button>
            <button>Explore a specific zone</button>
            <button>Raid a boss</button>
          </div>
          <section className="main-menu-container">
            <div className="menu-button">
              {showPlayerBox === false && (
                <button onClick={togglePlayerBox}>Show Stocked Monsters</button>
              )}
              {showPlayerBox === true && (
                <button onClick={togglePlayerBox}>Hide Stocked Monsters</button>
              )}
              {showInventory === false && (
                <button onClick={toggleInventory}>Show Inventory</button>
              )}
              {showInventory === true && (
                <button onClick={toggleInventory}>Hide Inventory</button>
              )}
            </div>
            {showPlayerBox && (
              <div className="box-container-global">
                <button
                  onClick={handleChangeView}
                  className="button-change-view"
                >
                  Change view (current view): {cardStyle}
                </button>
                <div className="box-container">
                  <div className="player-monsters-equip">
                    <PlayerTeam
                      canAccessMonsterMenu={true}
                      monsterCardStyle={cardStyle}
                    />
                  </div>
                  <div className="player-box">
                    <PlayerBox monsterCardStyle={cardStyle} />
                  </div>
                </div>
              </div>
            )}
            {showInventory && (
              <div className="player-inventory">
                <PlayerInventory />
              </div>
            )}
          </section>
        </>
      ) : (
        <StarterMonsterSelection />
      )}
    </main>
  )
}

export default MainMenu
