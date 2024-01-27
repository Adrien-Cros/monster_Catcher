import { createSlice } from '@reduxjs/toolkit'

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventory: [],
  },
  reducers: {
    addItemToInventory: (state, action) => {
      const { item, quantity } = action.payload
      const existingItemIndex = state.inventory.findIndex(
        (invItem) => invItem.id === item.id
      )

      if (existingItemIndex !== -1 && item.stackable) {
        // If item is in inventory and stackable, update quantityPossessed
        state.inventory[existingItemIndex].quantityPossessed += quantity
      } else {
        // If item is not in inventory or not stackable, add new entries for each item
        if (!item.stackable) {
          state.inventory = [
            ...state.inventory,
            ...Array(quantity).fill({ ...item, quantityPossessed: 1 }),
          ]
        } else {
          state.inventory = [
            ...state.inventory,
            { ...item, quantityPossessed: quantity },
          ]
        }
      }

      localStorage.setItem('inventory', JSON.stringify(state.inventory))
    },
    removeItemFromInventory: (state, action) => {
      const { item, quantity } = action.payload
      const itemIndex = state.inventory.findIndex(
        (invItem) => invItem.id === item.id
      )

      if (itemIndex !== -1) {
        // If item is in inventory and stackable, update quantityPossessed
        if (item.stackable) {
          state.inventory[itemIndex].quantityPossessed -= quantity
          // Ensure quantityPossessed is non-negative
          state.inventory[itemIndex].quantityPossessed = Math.max(
            0,
            state.inventory[itemIndex].quantityPossessed
          )

          // If quantityPossessed becomes 0, remove the item from inventory
          if (state.inventory[itemIndex].quantityPossessed === 0) {
            state.inventory = state.inventory.filter(
              (invItem) => invItem.id !== item.id
            )
          }
        } else {
          // If item is not stackable, remove specified quantity of items
          const nonStackableItems = state.inventory.filter(
            (invItem) => invItem.id === item.id
          )
          const remainingItems = state.inventory.filter(
            (invItem) => invItem.id !== item.id
          )

          state.inventory = [
            ...remainingItems,
            ...nonStackableItems.slice(quantity),
          ]
        }
      }

      localStorage.setItem('inventory', JSON.stringify(state.inventory))
    },

    loadItemFromInventory: (state, action) => {
      const storedData = localStorage.getItem('inventory')
      if (storedData) {
        state.inventory = JSON.parse(storedData)
      }
    },
    resetInventory: (state) => {
      state.inventory = []
      localStorage.removeItem('inventory')
    },
  },
})

export const {
  addItemToInventory,
  removeItemFromInventory,
  loadItemFromInventory,
  resetInventory,
} = inventorySlice.actions
export default inventorySlice.reducer
