import PropTypes from 'prop-types'

//calculated damage in combo mode
function calculateDamageCombo({ attacker, defender, capacityUsed }) {
  let damageDealt = 0

  // Creating a new object with all stats combined
  const totalCapacityStats = (capacityAndMonsterList) => {
    const onlyOneCapacity = capacityAndMonsterList.reduce(
      (acc, capacityAndMonster) => {
        const baseDamage = capacityAndMonster.capacity.details.base
        const penetrationDamage =
          capacityAndMonster.capacity.details.penetration
        const critChance = capacityAndMonster.capacity.details.critChance
        const critDamage = capacityAndMonster.capacity.details.critDamage
        const scaling = capacityAndMonster.capacity.details.scaling || []
        const variance = capacityAndMonster.capacity.details.variance
        const damageType = capacityAndMonster.capacity.details.damageType || []

        // Accumulate base, penetration, critChance, critDamage, scaling, variance, and damageType separately
        acc.base += baseDamage
        acc.penetration += penetrationDamage
        acc.critChance += critChance
        acc.critDamage += critDamage
        acc.scaling.push(...scaling)
        acc.variance += variance
        acc.damageType.push(...damageType)

        return acc
      },
      {
        base: 0,
        penetration: 0,
        critChance: 0,
        critDamage: 0,
        scaling: [],
        variance: 0,
        damageType: [],
      } // Initial value for the accumulator
    )

    // Calculate the average critChance
    onlyOneCapacity.critChance /= capacityAndMonsterList.length
    // Calculate the average critDamage
    onlyOneCapacity.critDamage /= capacityAndMonsterList.length
    // Calculate the average variance
    onlyOneCapacity.variance /= capacityAndMonsterList.length

    // Count occurrences of damageType
    const damageTypeCounts = onlyOneCapacity.damageType.reduce(
      (counts, type) => {
        counts[type] = (counts[type] || 0) + 1
        return counts
      },
      {}
    )

    // Find the most common damageType
    const mostCommonDamageType = Object.keys(damageTypeCounts).reduce(
      (mostCommon, type) =>
        damageTypeCounts[type] > damageTypeCounts[mostCommon]
          ? type
          : mostCommon
    )

    onlyOneCapacity.damageType = [mostCommonDamageType]

    return onlyOneCapacity
  }

  function damageDealtCalculation(attacker, defender, capacity) {
    //apply scaling factor of the capacity
    if (capacity.scaling) {
      let addedDamage = 0
      capacity.scaling.forEach((scalingFactor) => {
        const [percentage, attribute] = scalingFactor.split(' ')

        if (attribute === 'attack') {
          addedDamage += attacker.attack * (parseFloat(percentage) / 100)
        } else if (attribute === 'magic') {
          addedDamage += attacker.magic * (parseFloat(percentage) / 100)
        } else if (attribute === 'despair') {
          addedDamage += attacker.despair * (parseFloat(percentage) / 100)
        } else if (attribute === 'defense') {
          addedDamage += attacker.defense * (parseFloat(percentage) / 100)
        } else if (attribute === 'spirit') {
          addedDamage += attacker.spirit * (parseFloat(percentage) / 100)
        } else if (attribute === 'luck') {
          addedDamage += attacker.luck * (parseFloat(percentage) / 100)
        } else if (attribute === 'speed') {
          addedDamage += attacker.speed * (parseFloat(percentage) / 100)
        }
      })
      damageDealt = capacity.base + addedDamage
    }

    // check for crit chance
    // 10 luck = +1%
    const luckModifier = attacker.luck / 10
    const critRoll = Math.random() * 100
    const isCritical = critRoll <= capacity.critChance + luckModifier

    // add the crit multiplier
    damageDealt = isCritical ? damageDealt * capacity.critDamage : damageDealt
    // add the variance
    if (capacity.variance) {
      const halfVariance = capacity.variance / 2
      const randomVariance = Math.random() * capacity.variance - halfVariance
      damageDealt += randomVariance
    }
    //calculate the damage reduction
    //Check if the attack type is physical or magical and compare it to armor/spirit for resistance
    // 20 defense or spirit = (1% damage reduction)
    // penetration reduce the % damage reduction
    if (capacity.damageType[0] === 'Physical') {
      // Calculate damage reduction based on defense
      const defenseReduction = defender.defense / 20 / 100
      // Apply penetration reduction
      const totalReduction = Math.max(
        0,
        defenseReduction - capacity.penetration
      )
      // Apply damage reduction to damageDealt
      damageDealt = damageDealt * (1 - totalReduction)
    } else if (capacity.damageType[0] === 'Magical') {
      // Calculate damage reduction based on spirit
      const spiritReduction = defender.spirit / 20 / 100
      // Apply penetration reduction
      const totalReduction = Math.max(0, spiritReduction - capacity.penetration)
      // Apply damage reduction to damageDealt
      damageDealt = damageDealt * (1 - totalReduction)
    }

    // Round up the modified damageDealt value
    damageDealt = Math.ceil(damageDealt)
  }

  const onlyCap = totalCapacityStats(capacityUsed)
  damageDealtCalculation(defender, attacker, onlyCap)
  return damageDealt
}

calculateDamageCombo.propTypes = {
  // The data object representing the monster of the attacker.
  attacker: PropTypes.object.isRequired,
  // The data object representing the monster of the defender.
  defender: PropTypes.object.isRequired,
  // The data object representing the capacity use by the attacker.
  capacityUsed: PropTypes.object.isRequired,
}

export default calculateDamageCombo
