import monstersData from '../../Data/monsters.json'

import AddCapacityToMonsters from './AddCapacityToMonsters'
import AddTraitsToMonster from './AddTraitsToMonsters'
import ApplyTraitsEffectToMonsters from './ApplyTraitsEffectToMonsters'

const CaptureMonsters = () => {
  const getRandomItem = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length)
    return list[randomIndex]
  }

  const randomMonster = getRandomItem(monstersData.monsters)

  const traits = AddTraitsToMonster({ monster: randomMonster })
  const capacities = AddCapacityToMonsters({ monster: randomMonster })
  const uniqueKey =
    randomMonster.name +
    randomMonster.id +
    randomMonster.stats.hp +
    randomMonster.stats.attack +
    randomMonster.stats.magic +
    randomMonster.stats.defense +
    randomMonster.stats.spirit +
    Math.floor(Math.random() * 100000)

  const monsterCatchedWithDetails = {
    ...randomMonster,
    uniqueKey: uniqueKey,
    capacities,
    traits,
  }

  const modifiedMonster = ApplyTraitsEffectToMonsters({
    monster: monsterCatchedWithDetails,
  })

  return modifiedMonster
}

export default CaptureMonsters
