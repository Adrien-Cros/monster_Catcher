import { useState } from 'react'
import './header.scss'
import { useDispatch } from 'react-redux'
import {
  setDifficultyEasy,
  setDifficultyHard,
  setDifficultyNormal,
} from '../../System/config'

function Header() {
  const dispatch = useDispatch()
  const [optionPanelOpen, setOptionPanelOpen] = useState(false)

  const handleOption = (e) => {
    e.preventDefault()
    setOptionPanelOpen(!optionPanelOpen)
  }

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
    <header>
      <h1>Le Jeu</h1>
      <div className="menu">
        <nav className="navbar">
          <div className="option-button">Menu 1</div>
          <div className="option-button">Menu 2</div>
          <div className="option-button">Codex</div>
          <div
            className="option-button"
            onClick={handleOption}
            aria-expanded={optionPanelOpen}
          >
            Options
          </div>
          {optionPanelOpen && (
            <div className="option-container">
              <label htmlFor="difficulty">Difficulty:</label>
              <select
                onChange={handleChangeDifficulty}
                id="difficulty"
                defaultValue="normal"
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
