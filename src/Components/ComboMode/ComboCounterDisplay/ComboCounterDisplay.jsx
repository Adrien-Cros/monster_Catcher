import comboData from '../../../Data/combo.json'
import ConfirmationButton from '../../Button/ConfirmationButton/ConfirmationButton'
import './comboCounterDisplay.scss'

// capacityAndMonsterList format [{monster{}, capacity{}}, {monster{}, capacity{}}, {monster{}, capacity{}}, {monster{}, capacity{}}]
function ComboCounterDisplay({ capacityAndMonsterList, onResetButton }) {
  // Check if a sequence combo can be activate
  const isComboActivated = () => {
    const possibleCombo = comboData.combo

    // Add each capacity in order picked in an array
    let capacityList = capacityAndMonsterList.map((item) => item?.capacity)

    for (let comboLength = 4; comboLength >= 2; comboLength--) {
      for (let i = 0; i <= capacityList.length - comboLength; i++) {
        const comboCheck = []

        // Build comboCheck array dynamically based on the length of required elements
        for (let j = 0; j < comboLength; j++) {
          comboCheck.push(capacityList[i + j]?.details.element[0])
        }

        // Check if comboCheck matches the required elements of any combo
        for (let k = 0; k < possibleCombo.length; k++) {
          if (arraysEqual(possibleCombo[k].requiredElement, comboCheck)) {
            return possibleCombo[k]
          }
        }
      }
    }

    return null
  }

  // Function to check if two arrays are equal
  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }
    return true
  }

  const whichCombo = isComboActivated()

  const handleResetOrder = () => {
    onResetButton()
  }

  return (
    <div className="combo-panel">
      <div className="combo-display-container">
        {capacityAndMonsterList.map(
          (item, index) =>
            item && (
              <div className="monster-display" key={index}>
                <div>Action {index + 1}</div>
                <div className="capacity-display">
                  Monster: {item.monster.name}
                </div>
                <div className="capacity-display">
                  Capacity: {item.capacity.name}
                </div>
              </div>
            )
        )}
      </div>
      {whichCombo && (
        <>
          <div className="combo-found-info combo-shake">
            <div className="combo-name">Current Combo: {whichCombo?.name}</div>
            <div className="combo-requirement">
              {whichCombo?.requiredElement.map((element, index) => (
                <div key={index} className="combo-desc">
                  ==&gt;{element}
                </div>
              ))}
            </div>
            <div className="combo-desc">{whichCombo?.description}</div>
            <div className="combo-details">
              <p>Damage: {whichCombo?.details.base}</p>
              <p>Critical Chance: {whichCombo?.details.critChance}</p>
              <p>Critical Damage: {whichCombo?.details.critDamage}</p>
            </div>
            <div className="combo-details">
              <p>Penetration: {whichCombo?.details.penetration}</p>
              {whichCombo?.details.element.map((element, index) => (
                <p className="combo-elements" key={index}>
                  {element}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="combo-order">
        <div className="combo-order-square">
          {capacityAndMonsterList[0]?.capacity.details.element}
        </div>
        <div>===&gt;</div>
        <div className="combo-order-square">
          {capacityAndMonsterList[1]?.capacity.details.element}
        </div>
        <div>===&gt;</div>
        <div className="combo-order-square">
          {capacityAndMonsterList[2]?.capacity.details.element}
        </div>
        <div>===&gt;</div>
        <div className="combo-order-square">
          {capacityAndMonsterList[3]?.capacity.details.element}
        </div>
      </div>
      <div className="button-combo-container">
        {capacityAndMonsterList.length === 4 && (
          <ConfirmationButton buttonName={'Confirm the turn'} />
        )}
        <ConfirmationButton
          buttonName={'Reset order'}
          onButtonClick={handleResetOrder}
        />
      </div>
    </div>
  )
}

export default ComboCounterDisplay
