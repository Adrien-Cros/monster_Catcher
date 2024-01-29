import { useSelector } from 'react-redux'
import './playerInventory.scss'

function PlayerInventory() {
  // Retrieve the inventory
  const inventory = useSelector((state) => state.inventory.inventory)

  // Sort the inventory by ID by default
  const sortedInventory = [...inventory].sort((a, b) => a.id - b.id)

  return (
    <>
      {sortedInventory.map((item, index) => (
        <div className="item-container" key={item + index}>
          <div className="item-container-name-icon">
            <span>{item.name}</span>
            <img src={item.icon} alt={item.name} />
          </div>
          <span>{item.description}</span>
          <span>Quantity: {item.quantityPossessed}</span>
        </div>
      ))}
    </>
  )
}

export default PlayerInventory
