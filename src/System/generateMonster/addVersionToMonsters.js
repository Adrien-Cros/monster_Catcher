function addVersionToMonsters({ monster }) {
  let randomNumbers = Math.floor(Math.random() * 1000) + 1
  let version = 'normal'

  console.log('random: ', randomNumbers)

  if (randomNumbers <= 965) {
    version = 'normal'
  } else if (randomNumbers <= 995) {
    version = 'foil'
  } else if (randomNumbers <= 1000) {
    version = 'chromatic'
  }

  return { ...monster, version: version }
}

export default addVersionToMonsters
