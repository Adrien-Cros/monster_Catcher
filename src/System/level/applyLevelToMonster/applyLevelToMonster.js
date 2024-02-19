import applyTraitsEffectToMonsters from '../../generateMonster/applyTraitsEffectToMonsters'

import levelsData from '../../../Data/monsterLevels.json'
import monsterData from '../../../Data/monsters.json'

//Apply a specific level to a monster, return the monster modified
const applyLevelToMonster = ({ monster, level }) => {
  // Store the current monster and create a deep copy
  const currentMonster = monster
  const copyCurrentMonster = { ...currentMonster }

  // Find the monster in monsterData by id
  const monsterIdToUpdate = copyCurrentMonster.id
  const updatedMonsterIndex = monsterData.monsters.findIndex(
    (monster) => monster.id === monsterIdToUpdate
  )

  // Make a deep copy of the monster
  const updatedMonster = JSON.parse(
    JSON.stringify(monsterData.monsters[updatedMonsterIndex])
  )

  // Update the stats based on the level up effects, if level 1, no modification
  levelsData.effectOnStats.forEach((effect) => {
    const [stat, value] = effect.split(' ')
    const modifiedValue = parseFloat(value)
    updatedMonster.stats[stat] += modifiedValue * (level - 1)
  })

  // Create the modified monster object with updated properties, and keeping their capacity/traits/uniqueKey/uniquePassive
  const modifiedMonster = {
    ...updatedMonster,
    level: level,
    capacities: currentMonster.capacities,
    traits: currentMonster.traits,
    uniqueKey: currentMonster.uniqueKey,
    uniquePassive: currentMonster.uniquePassive,
    version: currentMonster.version,
  }

  // Reapply the traits effect to the monster
  const leveledUpMonster = applyTraitsEffectToMonsters({
    monster: modifiedMonster,
  })

  // Return the updated monster
  return leveledUpMonster
}

export default applyLevelToMonster
