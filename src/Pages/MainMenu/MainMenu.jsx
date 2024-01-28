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
  //hide or show player box/team
  const [showPlayerBox, setShowPlayerBox] = useState(false)
  //hide or show inventory
  const [showInventory, setShowInventory] = useState(false)

  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const inventory = useSelector((state) => state.inventory.inventory)

  const togglePlayerBox = () => {
    setShowInventory(false)
    setShowPlayerBox(!showPlayerBox)
  }

  const toggleInventory = () => {
    setShowPlayerBox(false)
    setShowInventory(!showInventory)
    console.log(inventory)
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
      <ButtonTryCapture />
      <main className="main-menu">
        <div className="mission-button">
          <button onClick={handleCombat}>Random encounter</button>
          <button>Explore a specific zone</button>
          <button>Raid a boss</button>
        </div>
        <section>
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
            <>
              <div className="player-monsters-equip">
                <PlayerTeam canAccessMonsterMenu={true} />
              </div>
              <div className="player-box">
                <PlayerBox />
              </div>
            </>
          )}
          {showInventory && (
            <div className="player-inventory">
              {inventory.map((item, index) => (
                <div className="item-container" key={item + index}>
                  <div className="item-container-name-icon">
                    <span>{item.name}</span>
                    <img src={item.icon} alt={item.name} />
                  </div>
                  <span>{item.description}</span>
                  <span>Quantity: {item.quantityPossessed}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default MainMenu
