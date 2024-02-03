import PropTypes from 'prop-types'

function calculateCurrentInforForCapacity({ monster, capacity, displayType }) {
  let damageDealt = 0
  let critChance = 0

  // Apply scaling factor of the capacity
  function calculateScaling(monster, capacity) {
    let addedDamage = 0
    if (capacity.details.scaling) {
      capacity.details.scaling.forEach((scalingFactor) => {
        const [percentage, attribute] = scalingFactor.split(' ')

        if (attribute === 'attack') {
          addedDamage += monster.stats.attack * (parseFloat(percentage) / 100)
        } else if (attribute === 'magic') {
          addedDamage += monster.stats.magic * (parseFloat(percentage) / 100)
        } else if (attribute === 'despair') {
          addedDamage += monster.stats.despair * (parseFloat(percentage) / 100)
        } else if (attribute === 'defense') {
          addedDamage += monster.stats.defense * (parseFloat(percentage) / 100)
        } else if (attribute === 'spirit') {
          addedDamage += monster.stats.spirit * (parseFloat(percentage) / 100)
        } else if (attribute === 'luck') {
          addedDamage += monster.stats.luck * (parseFloat(percentage) / 100)
        } else if (attribute === 'speed') {
          addedDamage += monster.stats.speed * (parseFloat(percentage) / 100)
        }
      })

      // Round up the total damageDealt after all attributes are considered
      damageDealt = capacity.details.base + addedDamage
      damageDealt = Math.ceil(damageDealt)
    }

    return damageDealt
  }

  function showActualCritChance(monster, capacity) {
    // 10 luck = +1%
    const luckModifier = monster.stats.luck / 10
    critChance = Math.floor(capacity.details.critChance + luckModifier)
    return critChance
  }

  if (displayType === 'critChance') {
    return showActualCritChance(monster, capacity)
  } else if (displayType === 'damageDealt') {
    return calculateScaling(monster, capacity)
  }
}

calculateCurrentInforForCapacity.propTypes = {
  // The data object representing the monster.
  monster: PropTypes.object.isRequired,
  // The data object representing the capacity.
  capacity: PropTypes.object.isRequired,
  // Return critChance or damageDealt based on the value needed
  displayType: PropTypes.oneOf(['critChance', 'damageDealt']).isRequired,
}

export default calculateCurrentInforForCapacity
