import PropTypes from 'prop-types'

function calculateDamage({ attacker, defender, capacityUsed }) {
  let damageDealt = 0

  function damageDealtCalculation(attacker, defender, capacity) {
    //apply scaling factor of the capacity
    if (capacity.details.scaling) {
      let addedDamage = 0
      capacity.details.scaling.forEach((scalingFactor) => {
        const [percentage, attribute] = scalingFactor.split(' ')

        if (attribute === 'attack') {
          addedDamage += attacker.stats.attack * (parseFloat(percentage) / 100)
        } else if (attribute === 'magic') {
          addedDamage += attacker.stats.magic * (parseFloat(percentage) / 100)
        } else if (attribute === 'despair') {
          addedDamage += attacker.stats.despair * (parseFloat(percentage) / 100)
        } else if (attribute === 'defense') {
          addedDamage += attacker.stats.defense * (parseFloat(percentage) / 100)
        } else if (attribute === 'spirit') {
          addedDamage += attacker.stats.spirit * (parseFloat(percentage) / 100)
        } else if (attribute === 'luck') {
          addedDamage += attacker.stats.luck * (parseFloat(percentage) / 100)
        } else if (attribute === 'speed') {
          addedDamage += attacker.stats.speed * (parseFloat(percentage) / 100)
        }
      })
      damageDealt = capacity.details.base + addedDamage
    }

    // Check for elemental damage modifier
    if (capacity.details && capacity.details.element && defender.type) {
      const attackerElements = capacity.details.element
      const defenderElements = defender.type

      for (const attackerElement of attackerElements) {
        for (const defenderElement of defenderElements) {
          // Same element, halve the damage
          if (attackerElement === defenderElement) {
            damageDealt /= 2
          }

          // Elemental relationships
          switch (attackerElement) {
            case 'Dark':
              if (defenderElement === 'Holy') {
                damageDealt *= 2
              }
              break
            case 'Holy':
              if (defenderElement === 'Dark') {
                damageDealt *= 2
              }
              break
            case 'Fire':
              if (defenderElement === 'Ice') {
                damageDealt *= 2
              }
              if (defenderElement === 'Water') {
                damageDealt /= 2
              }
              break
            case 'Ice':
              if (defenderElement === 'Lightning') {
                damageDealt *= 2
              }
              if (defenderElement === 'Fire') {
                damageDealt /= 2
              }
              break
            case 'Lightning':
              if (defenderElement === 'Water') {
                damageDealt *= 2
              }
              if (defenderElement === 'Ice') {
                damageDealt /= 2
              }
              break
            case 'Water':
              if (defenderElement === 'Fire') {
                damageDealt *= 2
              }
              if (defenderElement === 'Lightning') {
                damageDealt /= 2
              }
              break
            case 'Neutral':
              if (defenderElement === 'Dark') {
                damageDealt /= 2
              }
              if (defenderElement === 'Holy') {
                damageDealt /= 2
              }
              break
            default:
          }
        }
      }
    }

    // check for crit chance
    // 10 luck = +1%
    const luckModifier = attacker.stats.luck / 10
    const critRoll = Math.random() * 100
    const isCritical = critRoll <= capacity.details.critChance + luckModifier

    // add the crit multiplier
    damageDealt = isCritical
      ? damageDealt * capacity.details.critDamage
      : damageDealt

    // add the variance
    if (capacity.details.variance) {
      const halfVariance = capacity.details.variance / 2
      const randomVariance =
        Math.random() * capacity.details.variance - halfVariance
      damageDealt += randomVariance
    }

    //calculate the damage reduction
    //Check if the attack type is physical or magical and compare it to armor/spirit for resistance
    // 10 defense/spirit = (1% damage reduction /2)
    // penetration reduce the flat damage reduction
    if (capacity.details.damageType === 'Physical') {
      damageDealt =
        damageDealt *
        (1 - defender.stats.defense - attacker.stats.penetration / 1000)
    } else if (capacity.details.damageType === 'Magical') {
      damageDealt =
        damageDealt *
        (1 - defender.stats.spirit - attacker.stats.penetration / 1000)
    }
    damageDealt = Math.ceil(damageDealt)
  }

  damageDealtCalculation(attacker, defender, capacityUsed)

  return damageDealt
}

calculateDamage.propTypes = {
  // The data object representing the monster of the attacker.
  attacker: PropTypes.object.isRequired,
  // The data object representing the monster of the defender.
  defender: PropTypes.object.isRequired,
  // The data object representing the capacity use by the attacker.
  capacityUsed: PropTypes.object.isRequired,
}

export default calculateDamage
