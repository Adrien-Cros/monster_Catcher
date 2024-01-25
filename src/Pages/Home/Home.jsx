import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import MainMenu from '../../Components/MainMenu/MainMenu'
import {
  resetCapturedMonstersList,
  loadCapturedMonstersList,
} from '../../Store/Slice/monstersSlice'
import { loadMonsterFromTeam } from '../../Store/Slice/playerTeamSlice'

import './home.scss'

function Home() {
  const [openGame, setOpenGame] = useState(false)
  const [alreadyHasData, setAlreadyHasData] = useState(false)
  const [alreadyChargedTheData, setAlreadyChargedTheData] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadCapturedMonstersList())
    dispatch(loadMonsterFromTeam())
    const savedData = localStorage.getItem('capturedMonstersList')
    if (savedData) {
      setAlreadyHasData(true)
    }
    setAlreadyChargedTheData(true)
  }, [dispatch])

  const handleNewGame = (event) => {
    event.preventDefault()
    setOpenGame(true)
    dispatch(resetCapturedMonstersList())
  }

  const handleContinue = (event) => {
    event.preventDefault()
    setOpenGame(true)
  }

  if (!alreadyChargedTheData) {
    return <div>Loading...</div>
  }

  return (
    <main>
      {!openGame && (
        <div className="start-continue-button">
          {alreadyHasData && (
            <button onClick={handleContinue} className="main-menu-button">
              Continue
            </button>
          )}
          <button className="main-menu-button" onClick={handleNewGame}>
            New Game
          </button>
        </div>
      )}
      {openGame && <MainMenu />}
    </main>
  )
}

export default Home
