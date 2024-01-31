import playerLevelData from '../../Data/playerLevels.json'

// Return the current level based on the total xp the player has
function playerLevelHelper({ totalXp }) {
  const levels = playerLevelData.levels

  for (let i = 0; i < levels.length; i++) {
    if (totalXp < levels[i].xpRequiredToNext) {
      return levels[i].level
    }
  }

  // Si le totalXp est supérieur au dernier seuil, renvoyer le niveau le plus élevé
  console.log(levels[levels.length - 1].level)
  return levels[levels.length - 1].level
}

export default playerLevelHelper
