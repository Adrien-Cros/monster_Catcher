//return the capture threshold based on the monster rarity
function catchRateHelpers({ monster }) {
  // 80% for rarity 1
  const baseRarity1 = 20
  // 60% for rarity 2
  const baseRarity2 = 40
  // 40% for rarity 3
  const baseRarity3 = 60
  // 20% for rarity 4
  const baseRarity4 = 80

  if (monster.rarity === 1) {
    return baseRarity1
  } else if (monster.rarity === 2) {
    return baseRarity2
  } else if (monster.rarity === 3) {
    return baseRarity3
  } else if (monster.rarity === 4) {
    return baseRarity4
  } else {
    console.error('Rarity not found in this monster:', monster)
    return 100
  }
}

export default catchRateHelpers
