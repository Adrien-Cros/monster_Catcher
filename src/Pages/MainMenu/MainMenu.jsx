import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import PlayerBox from '../../Components/PlayerBox/PlayerBox'
import PlayerTeam from '../../Components/PlayerTeam/PlayerTeam'
import PlayerInventory from '../../Components/PlayerInventory/PlayerInventory'
import StarterMonsterSelection from '../../Components/StarterMonsterSelection/StarterMonsterSelection'

import {
  setInComboMode,
  setInRandomEncounter,
} from '../../Store/Slice/gameStatusSlice'

import './mainMenu.scss'

function MainMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  //hide or show player box/team
  const [showPlayerBox, setShowPlayerBox] = useState(false)
  //hide or show inventory
  const [showInventory, setShowInventory] = useState(false)
  //used to change the view, by default Classic
  const [cardStyle, setCardStyle] = useState('Classic')
  //used to set an error message if need
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleRandomEncounter = () => {
    if (teamMonsters.length <= 0) {
      setErrorMessage('You need atleast 1 monsters in your team')
      setTimeout(() => setErrorMessage(''), 3000)
    } else {
      dispatch(setInRandomEncounter(true))
      navigate('/random-encounter')
    }
  }

  const handleComboModeButton = () => {
    dispatch(setInComboMode(true))
    navigate('/combo')
  }

  return (
    <main className="main-menu">
      {alreadyHaveStarter ? (
        <>
          <div className="mission-container">
            <div className="mission-button-container">
              <button onClick={handleRandomEncounter}>Random encounter</button>
              <button onClick={handleComboModeButton}>Combo Mode</button>
              <button>Raid a boss</button>
            </div>
            <div
              className={`information-message ${
                errorMessage !== '' ? 'information-message-animation' : ''
              }`}
            >
              {errorMessage !== '' && <> {errorMessage}</>}
            </div>
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
