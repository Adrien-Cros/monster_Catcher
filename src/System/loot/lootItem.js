import itemsData from '../../Data/items.json'

//accept a monster object, it will generate random items bases on his lootTables, and return them in format ([{item}, quantity])
function lootItem({ monster }) {
  let lootedItems = []

  const lootRandomItem = () => {
    lootedItems = []

    if (monster && monster.loot_table) {
      monster.loot_table.forEach((lootItem) => {
        const itemFind = itemsData.items.find(
          (item) => item.id === lootItem.item_id
        )

        if (itemFind) {
          // Generate a random number between 1 and 100
          const randomChance = Math.floor(Math.random() * 100) + 1
          // Check if the random number is within the drop_chance
          if (randomChance <= lootItem.drop_chance) {
            // If yes, calculate the quantity based on the specified range
            const quantityObtained =
              Math.floor(
                Math.random() *
                  (lootItem.max_quantity - lootItem.min_quantity + 1)
              ) + lootItem.min_quantity

            // Add the item to the lootedItems array with the calculated quantity
            lootedItems.push({ item: itemFind, quantity: quantityObtained })
          }
        }
      })
    }

    return lootedItems
  }

  const result = lootRandomItem()

  return result
}

export default lootItem
