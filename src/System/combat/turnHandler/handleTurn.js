import calculateDamage from '../calculateDamage'

function handleTurn({ attacker, defender, selectedCapacity }) {
  const damageDealt = calculateDamage({
    attacker: attacker,
    defender: defender,
    capacityUsed: selectedCapacity,
  })

  const logMessage = `${attacker.name} used ${selectedCapacity.name} on ${defender.name} => ${defender.name} takes ${damageDealt} damage!`

  const updatedDefenderStats = {
    ...defender,
    stats: {
      ...defender.stats,
      hp: Math.max(defender.stats.hp - damageDealt, 0),
    },
  }

  if (updatedDefenderStats.stats.hp <= 0) {
    // if defender is dead
    return {
      logMessage: logMessage,
      isDefenderDead: true,
      updatedDefenderStats: updatedDefenderStats,
    }
  }

  // if defender isn't dead
  return {
    logMessage: logMessage,
    isDefenderDead: false,
    updatedDefenderStats: updatedDefenderStats,
  }
}

export default handleTurn
