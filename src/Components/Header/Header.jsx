import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDifficultyEasy,
  setDifficultyHard,
  setDifficultyNormal,
} from '../../System/config'

import './header.scss'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [optionPanelOpen, setOptionPanelOpen] = useState(false)

  const handleOption = (e) => {
    e.preventDefault()
    setOptionPanelOpen(!optionPanelOpen)
  }

  const handleMainMenu = (e) => {
    e.preventDefault()
    navigate('/')
  }

  const isInMainMenu = useSelector((state) => state.gameStatus.inMainMenu)
  const currencyOwned = useSelector((state) => state.inventory.currency)
  const defaultDifficulty = useSelector((state) => state.config.difficulty)

  const headerWith = isInMainMenu ? '17%' : '57%'

  const handleChangeDifficulty = (e) => {
    e.preventDefault()
    const selectedDifficulty = e.target.value

    if (selectedDifficulty === 'easy') {
      dispatch(setDifficultyEasy())
    } else if (selectedDifficulty === 'normal') {
      dispatch(setDifficultyNormal())
    } else if (selectedDifficulty === 'hard') {
      dispatch(setDifficultyHard())
    }
  }

  return (
    <header className="header-animation">
      <h1
        style={{ width: `${headerWith}` }}
        className={isInMainMenu ? 'h1-movement' : ''}
      >
        Ekrasys Monster Catcher
      </h1>

      {isInMainMenu && (
        <div className="currency-container">
          {currencyOwned.map((currency, index) => (
            <div
              key={index}
              className={`currency-item ${
                isInMainMenu ? 'currency-movement' : ''
              }`}
            >
              <img src={currency?.icon} alt={currency?.name} />
              {currency?.quantityPossessed}
            </div>
          ))}
        </div>
      )}
      <div className="menu">
        <nav className="navbar">
          <div onClick={handleMainMenu} className="option-button">
            Main Menu
          </div>
          <div className="option-button">Menu 2</div>
          <div className="option-button">Codex</div>
          <div className="option-button" onClick={handleOption}>
            Options
          </div>
          {optionPanelOpen && (
            <div className="option-container">
              <label htmlFor="difficulty">Difficulty:</label>
              <select
                onChange={handleChangeDifficulty}
                id="difficulty"
                defaultValue={defaultDifficulty}
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
