import store from '../../Store/store'

//Check if the monster has been captured, only accept item with typeObject: Capture
function catchingMonster({ captureItem, monsterToCapture }) {
  // Retrieve the catch rate difficulty from the store
  const currentState = store.getState()
  const catchRateDifficulty = currentState.config.catchRate

  // Multiply the min value to capture by the difficulty settings catchRate
  const minValueToCaptureTheMonster =
    monsterToCapture.captureValueNeeded * catchRateDifficulty
  const minChanceToCapture = captureItem.effect.captureMinValue
  const maxChanceToCapture = captureItem.effect.captureMaxValue

  const randomRoll =
    Math.random() * (maxChanceToCapture - minChanceToCapture) +
    minChanceToCapture

  const isMonsterCaptured = randomRoll >= minValueToCaptureTheMonster

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
