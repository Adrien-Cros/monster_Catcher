import monstersData from '../../Data/monsters.json'
import AddCapacityToMonsters from './AddCapacityToMonsters'
import AddTraitsToMonster from './AddTraitsToMonsters'
import ApplyTraitsEffectToMonsters from './ApplyTraitsEffectToMonsters'

// Generate a random monster from the monster data, attaching random traits/capacity to it, and generating a uniqueKey
// monsterRarity can accept "all" for no filter, a single number for a specific rarity, or an array like [2, 3, 4] to search in specific rarity
// specificMonsterId can accept "null" for no filter, a single number for a specific id, or an array like [1, 3, 4, 10] to search in specific id

// You can only search by rarity or by a specific monster
// If you put a specific rarity and a specific monster, it will always return the specific monster

const GenerateMonster = ({ monsterRarity, specificMonsterId }) => {
  // Helper function to get a random element from an array
  const getRandomMonster = (list) =>
    list[Math.floor(Math.random() * list.length)]

  // Initialize with all monsters
  let filteredMonsters = monstersData.monsters

  // If specificMonsterId is provided, filter by ID(s)
  if (specificMonsterId !== null) {
    filteredMonsters = monstersData.monsters.filter((monster) =>
      Array.isArray(specificMonsterId)
        ? specificMonsterId.includes(parseInt(monster.id))
        : monster.id === specificMonsterId
    )
  }

  // If monsterRarity is not 'all', filter by rarity or array of rarities
  if (monsterRarity !== 'all') {
    filteredMonsters = filteredMonsters.filter((monster) =>
      Array.isArray(monsterRarity)
        ? monsterRarity.includes(parseInt(monster.rarity))
        : monster.rarity === monsterRarity
    )
  }

  // If no monsters match the criteria, log an error and return null
  if (filteredMonsters.length === 0) {
    console.error(`No monsters found: ${monsterRarity}, ${specificMonsterId}`)
    return null
  }

  // Get a random monster from the filtered list
  const randomMonster = getRandomMonster(filteredMonsters)

  // Add random traits
  const traits = AddTraitsToMonster()

  // Add random capacity
  const capacities = AddCapacityToMonsters({ monster: randomMonster })

  // Create a unique key based on monster properties
  const uniqueKey =
    `${randomMonster.name}${randomMonster.id}${randomMonster.stats.hp}` +
    `${randomMonster.stats.attack}${randomMonster.stats.magic}` +
    `${randomMonster.stats.defense}${randomMonster.stats.spirit}${Math.floor(
      Math.random() * 100000
    )}`

  // Combine monster data with additional details
  const generatedMonsterWithDetail = {
    ...randomMonster,
    uniqueKey,
    capacities,
    traits,
  }

  // Apply trait effects to monster stats
  const modifiedMonster = ApplyTraitsEffectToMonsters({
    monster: generatedMonsterWithDetail,
  })

  // Return the modified monster
  return modifiedMonster
}

export default GenerateMonster
