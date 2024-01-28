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
  removeItemFromInventory,
  resetInventory,
} from '../../Store/Slice/inventorySlice'
import { loadSetting, setDifficultyNormal } from '../../System/config'

import itemsData from '../../Data/items.json'

import './home.scss'

function Home() {
  //for testing purpose: add 10 capture nest
  const itemToAdd = itemsData.items.find((item) => item.id === 1)
  const quantityToAdd = 10

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [alreadyHasData, setAlreadyHasData] = useState(false)
  const [alreadyChargedTheData, setAlreadyChargedTheData] = useState(false)

  useEffect(() => {
    dispatch(loadCapturedMonstersList())
    dispatch(loadMonsterFromTeam())
    dispatch(loadSetting())
    dispatch(loadItemFromInventory())
    const savedData = localStorage.getItem('capturedMonstersList')
    if (savedData) {
      setAlreadyHasData(true)
    }
    setAlreadyChargedTheData(true)
  }, [dispatch])

  const handleNewGame = (event) => {
    event.preventDefault()

    if (alreadyChargedTheData) {
      const confirmationNewGame = window.confirm(
        'You already have a save, are you sure you want to delete the old one to create a new one ?'
      )
      if (confirmationNewGame) {
        dispatch(resetCapturedMonstersList())
        dispatch(setDifficultyNormal())
        dispatch(resetMonsterFromTeam())
        dispatch(resetInventory())
        //dispatch( addItemToInventory({ item: itemToAdd, quantity: quantityToAdd }) )
        navigate('/main')
      }
    }
  }

  const handleContinue = (event) => {
    event.preventDefault()
    navigate('/main')
  }

  if (!alreadyChargedTheData) {
    return <div>Loading...</div>
  }

  const handleAddItemsToInventory = (event) => {
    event.preventDefault()
    dispatch(addItemToInventory({ item: itemToAdd, quantity: quantityToAdd }))
  }
  const handleRemoveItemsToInventory = (event) => {
    event.preventDefault()
    dispatch(
      removeItemFromInventory({ item: itemToAdd, quantity: quantityToAdd })
    )
  }
  /*
      <button onClick={handleAddItemsToInventory}>
        Add 10 Items to Inventory
      </button>
      <button onClick={handleRemoveItemsToInventory}>
        Remove 10 Items to Inventory
      </button> */
  return (
    <main>
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
    </main>
  )
}

export default Home
