import itemsData from '../../Data/items.json'
import store from '../../Store/store'

//used to generate a random amount of gold, based on the difficulty settings
function lootCurrency() {
  const currentState = store.getState()

  const currentGoldModifier = currentState.config.goldRate

  const BASE_GOLD = 20

  const lootRandomItem = () => {
    const randomQuantity =
      Math.floor(Math.random() * (BASE_GOLD + 1)) * currentGoldModifier
    const golds = itemsData.currency.find((currency) => currency.id === 1)

    return [{ item: golds, quantity: randomQuantity }]
  }

  const result = lootRandomItem()

  return result
}

export default lootCurrency
