import ApplyTraitsEffectToMonsters from '../../GenerateMonster/ApplyTraitsEffectToMonsters'
import XpGained from '../XpGained/XpGained'

import levelsData from '../../../Data/levels.json'
import monsterData from '../../../Data/monsters.json'

const LevelUp = ({ victoriousMonster, defeatedMonster }) => {
  // Store the current monster and create a deep copy
  const currentMonster = victoriousMonster
  const copyMonster = { ...currentMonster }

  // Calculate the experience gained in the battle
  const xpWon = XpGained({
    victoriousMonster: currentMonster,
    defeatedMonster: defeatedMonster,
  })

  // Store the current level, current experience, and level data
  const monsterCurrentLevel = copyMonster.level
  const monsterCurrentExperience = copyMonster.experience + xpWon

  // Check the level property inside the levelsData
  const levelToCheck = levelsData.levels.find(
    (level) => level.level === monsterCurrentLevel
  )

  // Check if current experience is higher or equal than required for the next level
  if (monsterCurrentExperience >= levelToCheck.xpRequiredToNext) {
    // If true, increment the monster's level
    const newLevel = monsterCurrentLevel + 1

    // Find the monster in monsterData by id
    const updatedMonster = monsterData.monsters.find(
      (monster) => monster.id === copyMonster.id
    )
    console.log('Before updating stats lvl up:', updatedMonster.stats)
    // Update the stats based on the level up effects
    levelsData.effectOnStats.forEach((effect) => {
      const [stat, value] = effect.split(' ')
      const modifiedValue = parseFloat(value)
      updatedMonster.stats[stat] += modifiedValue
    })
    console.log('After updating stats lvl up:', updatedMonster.stats)

    // Create the modified monster object with updated properties
    const modifiedMonster = {
      ...updatedMonster,
      level: newLevel,
      experience: monsterCurrentExperience,
      capacities: currentMonster.capacities,
      traits: currentMonster.traits,
      uniqueKey: currentMonster.uniqueKey,
      uniquePassive: currentMonster.uniquePassive,
    }

    // Apply traits effect to the monster
    return ApplyTraitsEffectToMonsters({
      monster: modifiedMonster,
    })
  }

  // Return a new object with the same properties as currentMonster, but with updated experience
  return {
    ...currentMonster,
    experience: monsterCurrentExperience,
  }
}

export default LevelUp
