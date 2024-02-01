import comboData from '../../../Data/combo.json'
import './comboCounterDisplay.scss'

// capacityAndMonsterList format [{monster{}, capacity{}}, {monster{}, capacity{}}, {monster{}, capacity{}}, {monster{}, capacity{}}]
function ComboCounterDisplay({ capacityAndMonsterList }) {
  const isComboActivated = () => {
    const possibleCombo = comboData.combo
    console.log('Combo List', possibleCombo)

    // Add each capacity in order picked in an array
    let capacityList = []
    for (let i = 0; i < capacityAndMonsterList.length; i++) {
      capacityList.push(capacityAndMonsterList[i]?.capacity)
    }
    console.log('CapacityList', capacityList)

    for (let i = 0; i < possibleCombo.length; i++) {
      // Check possible combo based on capacity stored
      const comboCheck = [
        capacityList[i]?.details.element[0],
        capacityList[i + 1]?.details.element[0],
        capacityList[i + 2]?.details.element[0],
      ]
      // Ensure there are enough elements in comboCheck for the current combo
      // If 2 elements
      if (comboCheck.length === 2) {
        for (let j = 0; j < possibleCombo.length; j++)
          // Directly access the elements of comboCheck using indexing
          if (
            possibleCombo[j].requiredElement[0] === comboCheck[0] &&
            possibleCombo[j].requiredElement[1] === comboCheck[1]
          ) {
            return possibleCombo[j]
          }
        // If 3 elements
      } else if (comboCheck.length === 3) {
        for (let j = 0; j < possibleCombo.length; j++)
          // Directly access the elements of comboCheck using indexing
          if (
            possibleCombo[j].requiredElement[0] === comboCheck[0] &&
            possibleCombo[j].requiredElement[1] === comboCheck[1] &&
            possibleCombo[j].requiredElement[2] === comboCheck[2]
          ) {
            return possibleCombo[j]
          }
      }
    }

    return null
  }

  const whichCombo = isComboActivated()
  console.log('Combo returned: ', whichCombo)

  return (
    <div className="combo-panel">
      <div className="combo-display-container">
        {capacityAndMonsterList[0] && (
          <div className="monster-display">
            <div>Action 1</div>
            <div className="capacity-display">
              Monster: {capacityAndMonsterList[0].monster.name}
            </div>
            <div className="capacity-display">
              Capacity: {capacityAndMonsterList[0].capacity.name}
            </div>
          </div>
        )}
        {capacityAndMonsterList[1] && (
          <div className="monster-display">
            <div>Action 2</div>
            <div className="capacity-display">
              Monster: {capacityAndMonsterList[1].monster.name}
            </div>
            <div className="capacity-display">
              Capacity: {capacityAndMonsterList[1].capacity.name}
            </div>
          </div>
        )}
        {capacityAndMonsterList[2] && (
          <div className="monster-display">
            <div>Action 3</div>
            <div className="capacity-display">
              Monster: {capacityAndMonsterList[2].monster.name}
            </div>
            <div className="capacity-display">
              Capacity: {capacityAndMonsterList[2].capacity.name}
            </div>
          </div>
        )}
        {capacityAndMonsterList[3] && (
          <div className="monster-display">
            <div>Action 4</div>
            <div className="capacity-display">
              Monster: {capacityAndMonsterList[3].monster.name}
            </div>
            <div className="capacity-display">
              Capacity: {capacityAndMonsterList[3].capacity.name}
            </div>
          </div>
        )}
      </div>
      {whichCombo && (
        <>
          <div className="combo-found-info">
            <div className="combo-name">Current Combo: {whichCombo?.name} </div>
            <div className="combo-desc">
              Current Combo: {whichCombo?.description}
            </div>
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
        </>
      )}
    </div>
  )
}

export default ComboCounterDisplay
