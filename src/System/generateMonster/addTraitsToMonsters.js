import traitData from '../../Data/traits.json'

function addTraitsToMonster() {
  const getRandomTrait = (selectedTraits) => {
    const randomRarity = Math.floor(Math.random() * 100) + 1
    let filteredTraits
    if (randomRarity <= 65) {
      // Rarity tier 1 70%
      filteredTraits = traitData.traits.filter(
        (trait) => trait.rarityTier === 1
      )
    } else if (randomRarity <= 92) {
      // Rarity tier 2 22%
      filteredTraits = traitData.traits.filter(
        (trait) => trait.rarityTier === 2
      )
    } else if (randomRarity <= 99) {
      // Rarity tier 3 7%
      filteredTraits = traitData.traits.filter(
        (trait) => trait.rarityTier === 3
      )
    } else if (randomRarity === 100) {
      // Rarity tier 4 1%
      filteredTraits = traitData.traits.filter(
        (trait) => trait.rarityTier === 4
      )
    }
    if (!filteredTraits || filteredTraits.length === 0) {
      return null
    }
    const availableTraits = filteredTraits.filter(
      (trait) => !selectedTraits.has(trait)
    )
    if (availableTraits.length === 0) {
      return null
    }
    const randomTrait =
      availableTraits[Math.floor(Math.random() * availableTraits.length)]
    selectedTraits.add(randomTrait)
    return randomTrait
  }

  const randomNumberOfTraits = Math.floor(Math.random() * 100) + 1

  let numTraits
  if (randomNumberOfTraits <= 30) {
    numTraits = 0 // 30% chance for 0 trait
  } else if (randomNumberOfTraits <= 60) {
    numTraits = 1 // 30% chance for 1 trait
  } else if (randomNumberOfTraits <= 80) {
    numTraits = 2 // 20% chance for 2 traits
  } else if (randomNumberOfTraits <= 95) {
    numTraits = 3 // 15% chance for 3 traits
  } else {
    numTraits = 4 // 5% chance for 4 traits
  }

  const selectedTraits = new Set()
  const traits = {}

  for (let i = 1; i <= numTraits; i++) {
    traits[`trait${i}`] = getRandomTrait(selectedTraits)
  }
  return traits
}

export default addTraitsToMonster
