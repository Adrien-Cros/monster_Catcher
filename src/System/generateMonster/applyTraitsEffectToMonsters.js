import traitsData from '../../Data/traits.json'

function applyTraitsEffectToMonsters({ monster }) {
  const traitValues = Object.values(monster.traits)

  for (const trait of traitValues) {
    const traitInfo = traitsData.traits.find((t) => t.id === trait.id)

    if (traitInfo && traitInfo.effectOnStats) {
      const newStats = { ...monster.stats }

      traitInfo.effectOnStats.forEach((effect) => {
        const [stat, percentage] = effect.split(' ')
        const effectPercentage = parseInt(percentage, 10)

        if (newStats[stat] !== undefined) {
          const newStatValue =
            newStats[stat] + (newStats[stat] * effectPercentage) / 100
          newStats[stat] = Math.floor(newStatValue)
        }
      })
      monster.stats = newStats
    }
  }

  return monster
}

export default applyTraitsEffectToMonsters
