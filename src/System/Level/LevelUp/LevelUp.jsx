import ApplyTraitsEffectToMonsters from '../../GenerateMonster/ApplyTraitsEffectToMonsters'
import XpGained from '../XpGained/XpGained'

import levelsData from '../../../Data/levels.json'
import monsterData from '../../../Data/monsters.json'

//Take 2 monsters object, will updated the victoriousMonster base on the defeatedMonster
//Return the xp won, a flag that indicate if it has lvl up or not, and return the monster updated
const LevelUp = ({ victoriousMonster, defeatedMonster }) => {
  // Store the current monster and create a deep copy
  const currentVictoriousMonster = victoriousMonster
  const copyCurrentVictoriousMonster = { ...currentVictoriousMonster }

  const currentDefeatedMonster = defeatedMonster
  const copyCurrentDefeatedMonster = { ...currentDefeatedMonster }

  // Calculate the experience gained in the battle
  const xpWon = XpGained({
    victoriousMonster: copyCurrentVictoriousMonster,
    defeatedMonster: copyCurrentDefeatedMonster,
  })

  // Store the current level, current experience, and level data
  const monsterCurrentLevel = copyCurrentVictoriousMonster.level
  const monsterCurrentExperience =
    copyCurrentVictoriousMonster.experience + xpWon

  // Check the level property inside the levelsData
  const levelToCheck = levelsData.levels.find(
    (level) => level.level === monsterCurrentLevel
  )

  // Check if current experience is higher or equal than required for the next level
  if (monsterCurrentExperience >= levelToCheck.xpRequiredToNext) {
    // If true, increment the monster's level
    const newLevel = monsterCurrentLevel + 1

    // Find the monster in monsterData by id
    const monsterIdToUpdate = copyCurrentVictoriousMonster.id
    const updatedMonsterIndex = monsterData.monsters.findIndex(
      (monster) => monster.id === monsterIdToUpdate
    )

    // Make a deep copy of the monster
    const updatedMonster = JSON.parse(
      JSON.stringify(monsterData.monsters[updatedMonsterIndex])
    )

    // Update the stats based on the level up effects
    levelsData.effectOnStats.forEach((effect) => {
      const [stat, value] = effect.split(' ')
      const modifiedValue = parseFloat(value)
      updatedMonster.stats[stat] += modifiedValue * monsterCurrentLevel
    })

    // Create the modified monster object with updated properties, and keeping their capacity/traits/uniqueKey/uniquePassive
    const modifiedMonster = {
      ...updatedMonster,
      level: newLevel,
      experience: monsterCurrentExperience,
      capacities: currentVictoriousMonster.capacities,
      traits: currentVictoriousMonster.traits,
      uniqueKey: currentVictoriousMonster.uniqueKey,
      uniquePassive: currentVictoriousMonster.uniquePassive,
    }

    // Reapply the traits effect to the monster
    const leveledUpMonster = ApplyTraitsEffectToMonsters({
      monster: modifiedMonster,
    })

    // Return both xpGained and a flag indicating level up
    return {
      xpWon,
      leveledUp: true,
      monster: leveledUpMonster,
    }
  }

  // Return a new object with the same properties as currentVictoriousMonster, but with updated experience
  return {
    xpWon,
    leveledUp: false,
    monster: {
      ...currentVictoriousMonster,
      experience: monsterCurrentExperience,
    },
  }
}

export default LevelUp
