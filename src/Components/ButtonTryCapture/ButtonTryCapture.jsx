import { useState } from 'react'
import { useDispatch } from 'react-redux'
import generateMonster from '../../System/generateMonster/generateMonster'
import MonsterCard from '../MonsterCard/MonsterCard'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'

function ButtonTryCapture() {
  const dispatch = useDispatch()
  const [monsterCatched, setMonsterCatched] = useState(null)

  const handleCatchMonster = () => {
    const monster = generateMonster({
      monsterRarity: 'all',
      specificMonsterId: null,
    })
    setMonsterCatched(monster)
    dispatch(updateCapturedMonstersList(monster))
  }

  return (
    <>
      <button onClick={handleCatchMonster}>Catch a monster!</button>
      {monsterCatched && (
        <MonsterCard monster={monsterCatched} showStats={true} />
      )}
    </>
  )
}

export default ButtonTryCapture
