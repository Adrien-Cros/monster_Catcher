import './comboCapacitySelection.scss'
import MenuButton from '../../Button/MenuButton/MenuButton'

function ComboCapacitySelection({
  monster1,
  monster2,
  monster3,
  monster4,
  onCapacitySelect,
}) {
  const monsters = [monster1, monster2, monster3, monster4]

  const handleSelectCapacity = (monster, capacity) => {
    // Pass the selected capacity and monster information to the parent
    onCapacitySelect(monster, capacity)
  }

  return (
    <div className="capacity-combo-container">
      {monsters.map((monster, index) => (
        <div key={index} className="capacity-selection">
          <h3>{monster.name}</h3>
          {Object.values(monster.capacities).map((capacity, capacityIndex) => (
            <div key={capacityIndex} className="capacity-button">
              <MenuButton
                boutonName={capacity.name}
                onClick={() => handleSelectCapacity(monster, capacity)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ComboCapacitySelection
