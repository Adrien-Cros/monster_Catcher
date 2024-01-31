import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  resetCapturedMonstersList,
  loadCapturedMonstersList,
} from '../../Store/Slice/monstersSlice'
import {
  loadMonsterFromTeam,
  resetMonsterFromTeam,
} from '../../Store/Slice/playerTeamSlice'
import {
  addItemToInventory,
  loadItemFromInventory,
  resetInventory,
  addCurrencyToInventory,
} from '../../Store/Slice/inventorySlice'
import {
  loadSetting,
  setAlreadyHaveStarter,
  setDifficultyNormal,
} from '../../System/config'
import {
  setInMainMenu,
  setInRandomEncounter,
} from '../../Store/Slice/gameStatusSlice'

import itemsData from '../../Data/items.json'

import ModalConfirmation from '../../Components/Modal/ModalConfirmation/ModalConfirmation'

import './home.scss'

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [alreadyHasData, setAlreadyHasData] = useState(false)
  const [alreadyChargedTheData, setAlreadyChargedTheData] = useState(false)
  const [pressedNewGame, setPressedNewGame] = useState(false)

  const confirmationMessage =
    'You already have a save, are you sure you want to delete the old one to create a new one ?'

  useEffect(() => {
    dispatch(loadCapturedMonstersList())
    dispatch(loadMonsterFromTeam())
    dispatch(loadSetting())
    dispatch(loadItemFromInventory())
    dispatch(setInMainMenu(false))
    dispatch(setInRandomEncounter(false))
    const savedData = localStorage.getItem('capturedMonstersList')
    if (savedData) {
      setAlreadyHasData(true)
    }
    setAlreadyChargedTheData(true)
  }, [])

  const newGameInit = (reset) => {
    // Add 10 Capture Sphere in the player inventory
    const itemToAdd = itemsData.items.find((item) => item.id === 1)
    const quantityToAdd = 10

    // Add 50 golds in the player inventory
    const currencyToAdd = itemsData.currency.find((curr) => curr.id === 1)
    const goldToAdd = 50
    dispatch(resetCapturedMonstersList())
    dispatch(setDifficultyNormal())
    dispatch(resetMonsterFromTeam())
    dispatch(resetInventory())
    dispatch(setAlreadyHaveStarter(false))
    dispatch(
      addCurrencyToInventory({
        currency: currencyToAdd,
        quantity: goldToAdd,
      })
    )
    dispatch(addItemToInventory({ item: itemToAdd, quantity: quantityToAdd }))
    dispatch(setInMainMenu(true))
    navigate('/main')
  }

  const handleNewGame = (event) => {
    event.preventDefault()
    if (alreadyHasData) {
      setPressedNewGame(true)
    } else {
      newGameInit()
    }
  }

  const handleAccept = () => {
    newGameInit()
  }

  const handleDecline = () => {
    setPressedNewGame(false)
  }

  const handleContinue = (event) => {
    event.preventDefault()
    dispatch(dispatch(setInMainMenu(true)))
    navigate('/main')
  }

  if (!alreadyChargedTheData) {
    return <div>Loading...</div>
  }

  return (
    <main>
      {pressedNewGame && (
        <ModalConfirmation
          modalName={'New Game'}
          modalDescription={confirmationMessage}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
      {!pressedNewGame && (
        <div className="start-continue-button">
          {alreadyHasData && (
            <button onClick={handleContinue} className="main-menu-button">
              Continue
            </button>
          )}
          <button onClick={handleNewGame} className="main-menu-button">
            New Game
          </button>
        </div>
      )}
    </main>
  )
}

export default Home
