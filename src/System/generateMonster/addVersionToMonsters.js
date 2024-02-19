function addVersionToMonsters({ monster }) {
  let randomNumbers = Math.floor(Math.random() * 100) + 1
  let version = 'normal'

  console.log('Numbers', randomNumbers)

  if (randomNumbers <= 92) {
    version = 'normal'
  } else if (randomNumbers <= 99) {
    version = 'foil'
  } else if (randomNumbers === 100) {
    version = 'chromatic'
  }

  return { ...monster, version: version }
}

export default addVersionToMonsters
