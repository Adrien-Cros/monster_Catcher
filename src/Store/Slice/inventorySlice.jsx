import { createSlice } from '@reduxjs/toolkit'

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventory: [],
    currency: [],
  },
  reducers: {
    addItemToInventory: (state, action) => {
      const { item, quantity } = action.payload
      if (item) {
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
        localStorage.setItem(
          'inventory',
          JSON.stringify({
            inventory: state.inventory,
            currency: state.currency,
          })
        )
      } else {
        console.log('failed to add the item: ', item)
      }
    },
    removeItemFromInventory: (state, action) => {
      const { item, quantity } = action.payload
      if (item) {
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

        localStorage.setItem(
          'inventory',
          JSON.stringify({
            inventory: state.inventory,
            currency: state.currency,
          })
        )
      } else {
        console.log('failed to remove the item: ', item)
      }
    },

    loadItemFromInventory: (state) => {
      const storedData = localStorage.getItem('inventory')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        state.inventory = parsedData.inventory || []
        state.currency = parsedData.currency || []
      }
    },
    resetInventory: (state) => {
      state.inventory = []
      state.currency = []
      localStorage.removeItem('inventory')
    },

    //add currency object, quantity
    addCurrencyToInventory: (state, action) => {
      const { currency, quantity } = action.payload

      // Check if the currency already exists in the inventory
      const existingCurrencyIndex = state.currency.findIndex(
        (curr) => curr.id === currency.id
      )

      if (existingCurrencyIndex !== -1) {
        // If currency exists, update the quantity
        state.currency[existingCurrencyIndex].quantityPossessed += quantity
      } else {
        // If currency doesn't exist, add a new entry
        state.currency = [
          ...state.currency,
          { ...currency, quantityPossessed: quantity },
        ]
      }

      localStorage.setItem(
        'inventory',
        JSON.stringify({
          inventory: state.inventory,
          currency: state.currency,
        })
      )
    },
    //remove currency object, quantity
    removeCurrencyToInventory: (state, action) => {
      const { currency, quantity } = action.payload

      // Check if the currency exists in the inventory
      const existingCurrencyIndex = state.currency.findIndex(
        (curr) => curr.id === currency.id
      )

      if (existingCurrencyIndex !== -1) {
        // If currency exists, update the quantity and ensure it's non-negative
        state.currency[existingCurrencyIndex].quantityPossessed = Math.max(
          0,
          state.currency[existingCurrencyIndex].quantityPossessed - quantity
        )

        // If quantity becomes 0, remove the currency from inventory
        if (state.currency[existingCurrencyIndex].quantityPossessed === 0) {
          state.currency = state.currency.filter(
            (curr) => curr.id !== currency.id
          )
        }
      }

      localStorage.setItem(
        'inventory',
        JSON.stringify({
          inventory: state.inventory,
          currency: state.currency,
        })
      )
    },
  },
})

export const {
  addItemToInventory,
  removeItemFromInventory,
  loadItemFromInventory,
  resetInventory,
  addCurrencyToInventory,
  removeCurrencyToInventory,
} = inventorySlice.actions
export default inventorySlice.reducer
