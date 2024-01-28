import monstersData from '../../Data/monsters.json'

import AddCapacityToMonsters from './AddCapacityToMonsters'
import AddTraitsToMonster from './AddTraitsToMonsters'
import ApplyTraitsEffectToMonsters from './ApplyTraitsEffectToMonsters'

// Generate a random monster from the monster data, attaching random traits/capacity to it, and generation a uniqueKey
// monsterRarity can accept "all" for no filter, a single number for a specific rarity, or an array like [2, 3, 4] to search in specific rarity
const GenerateMonster = ({ monsterRarity }) => {
  const getRandomMonster = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length)
    return list[randomIndex]
  }

  let filteredMonsters = monstersData.monsters

  if (monsterRarity === 'all') {
    // Include all monsters
  } else if (typeof monsterRarity === 'number') {
    // Handle single number
    filteredMonsters = monstersData.monsters.filter(
      (monster) => monster.rarity === monsterRarity
    )
  } else if (Array.isArray(monsterRarity)) {
    // Handle array of numbers
    filteredMonsters = monstersData.monsters.filter((monster) =>
      monsterRarity.includes(parseInt(monster.rarity))
    )
  } else {
    // Handle other cases or provide a default behavior
    console.error(`Invalid monsterRarity: ${monsterRarity}`)
    return null
  }

  if (filteredMonsters.length === 0) {
    console.error(`No monsters found with specified rarities: ${monsterRarity}`)
    return null
  }

  // Get a random monster from the filtered list
  const randomMonster = getRandomMonster(filteredMonsters)
  //add random traits
  const traits = AddTraitsToMonster()
  //add random capacity
  const capacities = AddCapacityToMonsters({ monster: randomMonster })
  //create unique key
  const uniqueKey =
    randomMonster.name +
    randomMonster.id +
    randomMonster.stats.hp +
    randomMonster.stats.attack +
    randomMonster.stats.magic +
    randomMonster.stats.defense +
    randomMonster.stats.spirit +
    Math.floor(Math.random() * 100000)

  const generatedMonsterWithDetail = {
    ...randomMonster,
    uniqueKey: uniqueKey,
    level: 1,
    experience: 0,
    capacities,
    traits,
  }

  //aaply trait effect to stats
  const modifiedMonster = ApplyTraitsEffectToMonsters({
    monster: generatedMonsterWithDetail,
  })

  return modifiedMonster
}

export default GenerateMonster
