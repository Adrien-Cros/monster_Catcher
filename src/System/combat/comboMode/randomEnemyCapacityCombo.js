function randomEnemyCapacityCombo({ monsterList }) {
  const resultArray = []

  monsterList.forEach((monster) => {
    // Get the capacities of the monster
    const capacities = Object.values(monster.capacities)

    // Select a random capacity
    const randomCapacity =
      capacities[Math.floor(Math.random() * capacities.length)]

    // Create an object with the monster and the selected capacity
    const resultObject = {
      monster: { ...monster },
      capacity: { ...randomCapacity },
    }

    // Add the object to the result array
    resultArray.push(resultObject)
  })

  return resultArray
}

export default randomEnemyCapacityCombo
