import ApplyTraitsEffectToMonsters from '../../GenerateMonster/ApplyTraitsEffectToMonsters'
import XpGained from '../XpGained/XpGained'

import levelsData from '../../../Data/levels.json'
import monsterData from '../../../Data/monsters.json'

//Function to check if a monster can level up or not
//Return the victorious monster, but with upgraded stats if level up
const LevelUp = ({ victoriousMonster, defeatedMonster }) => {
  // Store the current monster
  const currentMonster = victoriousMonster
  // Create a deep copy of the current monster
  const copyMonster = { ...currentMonster }

  const monsterToCheck = defeatedMonster

  console.log('entered in lvl up with: ', currentMonster)

  const xpWon = XpGained({
    victoriousMonster: currentMonster,
    defeatedMonster: monsterToCheck,
  })

  console.log('After xp gained: ', currentMonster)

  // Store the current level/xp/traits/capacities/uniquepassive/uniqueKey
  const monsterCurrentLevel = copyMonster.level
  const monsterCurrentExperience = copyMonster.experience + xpWon

  console.log('Applying the xp bonus: ', monsterCurrentExperience)
  // Find the corresponding level data
  const levelToCheck = levelsData.levels.find(
    (level) => level.level === monsterCurrentLevel
  )

  // Check if current experience is higher than required for the next level
  if (monsterCurrentExperience >= levelToCheck.xpRequiredToNext) {
    // If true, increment the monster's level
    const newLevel = monsterCurrentLevel + 1

    // Find the monster in monsterData by id
    const updatedMonster = monsterData.monsters.find(
      (monster) => monster.id === copyMonster.id
    )

    // Update the stats based on the level up effects
    const modifiedStats = levelsData.effectOnStats.map((effect) => {
      const [stat, value] = effect.split(' ')
      const modifiedValue = parseFloat(value)
      updatedMonster.stats[stat] += modifiedValue
      return `${stat} +${modifiedValue}`
    })

    //restore and update the value to the new monster
    updatedMonster.level = newLevel
    updatedMonster.experience = monsterCurrentExperience
    updatedMonster.capacities = currentMonster.capacities
    updatedMonster.traits = currentMonster.traits
    updatedMonster.uniqueKey = currentMonster.uniqueKey
    updatedMonster.uniquePassive = currentMonster.uniquePassive

    // Apply traits effect to the monster
    const modifiedMonster = ApplyTraitsEffectToMonsters({
      monster: updatedMonster,
    })

    // Return the modified monster
    return modifiedMonster
  }

  // Return a new object with the same properties as currentMonster, but with updated experience
  return {
    ...currentMonster,
    experience: monsterCurrentExperience,
  }
}

export default LevelUp
