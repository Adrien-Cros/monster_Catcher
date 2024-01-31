import store from '../../../Store/store'

import { removeItemFromInventory } from '../../../Store/Slice/inventorySlice'
import catchingMonster from '../catch/catchingMonster'
import handleTurn from './handleTurn'
import lootCurrency from '../../loot/lootCurrency'
import lootItem from '../../loot/lootItem'

function completeTurn({
  playerMonster,
  enemyMonster,
  playerSelectedCapacityOrItem,
  monsterSelectedCapacity,
}) {
  const dispatch = store.dispatch
  //make a copy of the passed monsters
  let playerMonsterCopy = playerMonster
  let enemyMonsterCopy = enemyMonster
  //check if the player goes first based on both monster speed
  const playerGoesFirst =
    playerMonsterCopy.stats.speed >= enemyMonsterCopy.stats.speed
  //check if the item is a capacity
  const isACapacity = playerSelectedCapacityOrItem.objectType === 'capacity'
  //check if the item is a capture object
  const isACaptureItem =
    playerSelectedCapacityOrItem.objectType === 'item' &&
    playerSelectedCapacityOrItem.type.includes('Capture')

  // If it's a capacity, do a normal turn
  if (isACapacity) {
    // Player goes first
    if (playerGoesFirst) {
      const playerTurnResult = handleTurn({
        attacker: playerMonsterCopy,
        defender: enemyMonsterCopy,
        selectedCapacity: playerSelectedCapacityOrItem,
      })
      enemyMonsterCopy = playerTurnResult.updatedDefenderStats

      // Check if enemy is dead => player win
      if (playerTurnResult.isDefenderDead) {
        const lootedItemResult = lootItem({ monster: enemyMonster })
        const lootedCurrency = lootCurrency()
        return {
          combatWon: true,
          combatEnd: true,
          playerMonster: playerMonsterCopy,
          enemyMonster: enemyMonsterCopy,
          itemsLoot: lootedItemResult,
          currencyLoot: lootedCurrency,
          logMessage: playerTurnResult.logMessage,
        }
      } else {
        // Enemy's isnt dead, so it is his turn
        const enemyTurnResult = handleTurn({
          attacker: enemyMonsterCopy,
          defender: playerMonsterCopy,
          selectedCapacity: monsterSelectedCapacity,
        })
        playerMonsterCopy = enemyTurnResult.updatedDefenderStats

        // Check if player monster is dead => player loose
        if (enemyTurnResult.isDefenderDead) {
          return {
            combatWon: false,
            combatEnd: true,
            playerMonster: playerMonsterCopy,
            enemyMonster: enemyMonsterCopy,
            logMessage: enemyTurnResult.logMessage,
          }
        } else {
          // No one dead, turn continue !
          return {
            combatWon: false,
            combatEnd: false,
            playerMonster: playerMonsterCopy,
            enemyMonster: enemyMonsterCopy,
            logMessage:
              '1. ' +
              playerTurnResult.logMessage +
              '2. ' +
              enemyTurnResult.logMessage,
          }
        }
      }
    } else {
      // Enemy goes first
      const enemyTurnResult = handleTurn({
        attacker: enemyMonsterCopy,
        defender: playerMonsterCopy,
        selectedCapacity: monsterSelectedCapacity,
      })
      playerMonsterCopy = enemyTurnResult.updatedDefenderStats

      // Check if player monster is dead => player loose
      if (enemyTurnResult.isDefenderDead) {
        return {
          combatWon: false,
          combatEnd: true,
          playerMonster: playerMonsterCopy,
          enemyMonster: enemyMonsterCopy,
          logMessage: enemyTurnResult.logMessage,
        }
      } else {
        // Player's monster isnt dead, so it is his turn
        const playerTurnResult = handleTurn({
          attacker: playerMonsterCopy,
          defender: enemyMonsterCopy,
          selectedCapacity: playerSelectedCapacityOrItem,
        })
        enemyMonsterCopy = playerTurnResult.updatedDefenderStats
        // Check if enemy is dead => player win
        if (playerTurnResult.isDefenderDead) {
          const lootedItemResult = lootItem({ enemyMonster })
          const lootedCurrency = lootCurrency()
          return {
            combatWon: true,
            combatEnd: true,
            playerMonster: playerMonsterCopy,
            enemyMonster: enemyMonsterCopy,
            itemsLoot: lootedItemResult,
            currencyLoot: lootedCurrency,
            logMessage: playerTurnResult.logMessage,
          }
        } else {
          // No one dead, turn continue !
          return {
            combatWon: false,
            combatEnd: false,
            playerMonster: playerMonsterCopy,
            enemyMonster: enemyMonsterCopy,
            logMessage:
              '1. ' +
              enemyTurnResult.logMessage +
              '2. ' +
              playerTurnResult.logMessage,
          }
        }
      }
    }
    //if it's a capture, try to capture the monster
  } else if (isACaptureItem) {
    //remove item from inventory
    dispatch(
      removeItemFromInventory({
        item: playerSelectedCapacityOrItem,
        quantity: 1,
      })
    )
    // Check if the monster has been captured
    const captureResult = catchingMonster({
      captureItem: playerSelectedCapacityOrItem,
      monsterToCapture: enemyMonsterCopy,
    })

    // Handle the case when the monster is captured
    if (captureResult.isCaptured) {
      const logMessage = captureResult.logMessage
      return {
        itemsLoot: null,
        currencyLoot: null,
        isMonsterCaptured: true,
        monsterCaptured: enemyMonster,
        combatEnd: true,
        combatWon: true,
        logMessage: logMessage,
        playerMonster: playerMonsterCopy,
        enemyMonster: enemyMonsterCopy,
      }
      // Handle the case when the capture attempt fails
    } else if (!captureResult.isCaptured) {
      const logMessage = captureResult.logMessage
      //if it's fail, the enemy monster still do one attack
      const enemyTurnResult = handleTurn({
        attacker: enemyMonsterCopy,
        defender: playerMonsterCopy,
        selectedCapacity: monsterSelectedCapacity,
      })
      playerMonsterCopy = enemyTurnResult.updatedDefenderStats

      // Check if player monster is dead
      if (enemyTurnResult.isDefenderDead) {
        return {
          combatWon: false,
          combatEnd: true,
          playerMonster: playerMonsterCopy,
          enemyMonster: enemyMonsterCopy,
        }
      }
      return {
        itemsLoot: null,
        currencyLoot: null,
        isMonsterCaptured: false,
        monsterCaptured: enemyMonster,
        combatEnd: false,
        combatWon: null,
        logMessage: logMessage + ' ' + enemyTurnResult.logMessage,
        playerMonster: playerMonsterCopy,
        enemyMonster: enemyMonsterCopy,
      }
    } else {
      console.log('An error has occured')
      return null
    }
  } else {
    return {
      error: 'Error in retrieving the type of the object',
      playerMonster: playerMonsterCopy,
      enemyMonster: enemyMonsterCopy,
      playerSelectedCapacityOrItem: playerSelectedCapacityOrItem,
      monsterSelectedCapacity: monsterSelectedCapacity,
    }
  }
}

export default completeTurn
