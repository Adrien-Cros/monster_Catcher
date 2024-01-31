import store from '../../../Store/store'
import catchRateHelpers from './catchRateHelper'

//Check if the monster has been captured, only accept item with typeObject: Capture
function catchingMonster({ captureItem, monsterToCapture }) {
  // Retrieve the catch rate difficulty from the store
  const currentState = store.getState()
  const catchRateDifficulty = currentState.config.catchRate

  // Roll a random value between 1 and 100 + value of the capture item
  const randomRoll = Math.min(
    Math.floor(
      Math.random() * (100 - 1) +
        1 +
        captureItem.effect.chanceToCapture * catchRateDifficulty
    ),
    100
  )

  // Is monster captured ?
  const isMonsterCaptured =
    randomRoll >= catchRateHelpers({ monster: monsterToCapture })

  if (isMonsterCaptured) {
    return {
      capturedMonster: monsterToCapture,
      isCaptured: true,
      logMessage: `You have captured a ${monsterToCapture.name} level ${monsterToCapture.level} !`,
    }
  } else {
    return {
      capturedMonster: monsterToCapture,
      isCaptured: false,
      logMessage: `Failed to capture ${monsterToCapture.name} level ${monsterToCapture.level} ! Try again !`,
    }
  }
}

export default catchingMonster
