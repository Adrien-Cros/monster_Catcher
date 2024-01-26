import monstersData from '../../Data/monsters.json'

import AddCapacityToMonsters from './AddCapacityToMonsters'
import AddTraitsToMonster from './AddTraitsToMonsters'
import ApplyTraitsEffectToMonsters from './ApplyTraitsEffectToMonsters'

// Generate a random monster from the monster data, attaching random traits/capacity to it, and generation a uniqueKey
const GenerateMonster = () => {
  const getRandomItem = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length)
    return list[randomIndex]
  }

  //get random monsters
  const randomMonster = getRandomItem(monstersData.monsters)
  //add random traits
  const traits = AddTraitsToMonster({ monster: randomMonster })
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
