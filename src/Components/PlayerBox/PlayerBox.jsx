import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMonsterFromListByKey } from '../../Store/Slice/monstersSlice'
import MonsterCard from '../MonsterCard/MonsterCard'

import './playerBox.scss'

function PlayerBox() {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)

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

  return (
    <>
      <h3>
        Your stocked monsters (Total Monsters: {capturedMonsterData.length}):
      </h3>
      <div className="filter-button">
        <p> Sort by:</p>
        <button>Name</button>
        <button>Level</button>
        <button>Race</button>
        <button>Element</button>
      </div>
      <div className="stocked-monsters">
        {currentMonsters &&
          currentMonsters.map((monster, index) => (
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
    </>
  )
}

export default PlayerBox
