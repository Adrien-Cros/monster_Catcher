import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMonsterFromListByKey } from '../../Store/Slice/monstersSlice'
import MonsterCard from '../MonsterCard/MonsterCard'

import './playerBox.scss'

function PlayerBox() {
  const dispatch = useDispatch()

  //check the page
  const [currentPage, setCurrentPage] = useState(1)

  //used to check the sort
  const [sortCriteria, setSortCriteria] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  const monstersPerPage = 8

  const capturedMonsterData = useSelector(
    (state) => state.monsters.capturedMonstersList
  )

  const indexOfLastMonster = currentPage * monstersPerPage
  const indexOfFirstMonster = indexOfLastMonster - monstersPerPage
  const currentMonsters = capturedMonsterData.slice(
    indexOfFirstMonster,
    indexOfLastMonster
  )
  const totalPages = Math.ceil(capturedMonsterData.length / monstersPerPage)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleDeleteMonster = (uniqueKey) => {
    dispatch(deleteMonsterFromListByKey({ uniqueKey: uniqueKey }))
  }

  const sortedMonsters = [...currentMonsters].sort((a, b) => {
    const compareValue = sortOrder === '↑' ? 1 : -1

    if (a[sortCriteria] < b[sortCriteria]) {
      return -compareValue
    }
    if (a[sortCriteria] > b[sortCriteria]) {
      return compareValue
    }
    return 0
  })

  const handleSort = (criteria) => {
    // If the same criteria is clicked again, toggle the sort order
    const newSortOrder =
      sortCriteria === criteria ? (sortOrder === '↑' ? '↓' : '↑') : '↑'

    setSortCriteria(criteria)
    setSortOrder(newSortOrder)
  }

  return (
    <>
      <h3>
        Your stocked monsters (Total Monsters: {capturedMonsterData.length}):
      </h3>
      <div className="sort-button-list">
        <p> Sort by:</p>
        <button className="sort-button" onClick={() => handleSort('id')}>
          Id
        </button>
        <button className="sort-button" onClick={() => handleSort('name')}>
          Name
        </button>
        <button className="sort-button" onClick={() => handleSort('level')}>
          Level
        </button>
        <button className="sort-button" onClick={() => handleSort('race')}>
          Race
        </button>
        <button className="sort-button" onClick={() => handleSort('rarity')}>
          Rarity
        </button>
        <button className="sort-button" onClick={() => handleSort('type')}>
          Type
        </button>
        {sortCriteria && sortOrder && (
          <p>
            Actually sorted by: {sortCriteria} {sortOrder}
          </p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === totalPages || capturedMonsterData.length === 0
          }
        >
          Next Page
        </button>
      </div>
      <div className="stocked-monsters">
        {currentMonsters &&
          sortedMonsters.map((monster, index) => (
            <MonsterCard
              key={monster.uniqueKey}
              monster={monster}
              onDelete={() => handleDeleteMonster(monster.uniqueKey)}
              canAccessMenu={true}
              canBeRemovedFromTeam={false}
              canBeDelete={true}
              showStats={true}
            />
          ))}
      </div>
    </>
  )
}

export default PlayerBox
