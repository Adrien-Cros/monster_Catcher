import { useState } from 'react'
import { useDispatch } from 'react-redux'
import GenerateMonster from '../../System/GenerateMonster/GenerateMonster'
import MonsterCard from '../MonsterCard/MonsterCard'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'

function ButtonTryCapture() {
  const dispatch = useDispatch()
  const [monsterCatched, setMonsterCatched] = useState(null)

  const handleCatchMonster = () => {
    const monster = GenerateMonster()
    setMonsterCatched(monster)
    dispatch(updateCapturedMonstersList(monster))
    console.log('generated monster: ', monster)
  }

  return (
    <>
      <button onClick={handleCatchMonster}>Catch a monster!</button>
      {monsterCatched && <MonsterCard monster={monsterCatched} />}
    </>
  )
}

export default ButtonTryCapture
