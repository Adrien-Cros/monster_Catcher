import { useState } from 'react'
import { useDispatch } from 'react-redux'
import CaptureMonstersCheck from '../../System/CaptureMonstersCheck/CaptureMonstersCheck'
import MonsterCard from '../MonsterCard/MonsterCard'
import { updateCapturedMonstersList } from '../../Store/Slice/monstersSlice'

function ButtonTryCapture() {
  const dispatch = useDispatch()
  const [monsterCatched, setMonsterCatched] = useState(null)

  const handleCatchMonster = () => {
    const monster = CaptureMonstersCheck()
    setMonsterCatched(monster)
    dispatch(updateCapturedMonstersList(monster))
  }

  return (
    <>
      <button onClick={handleCatchMonster}>Catch a monster!</button>
      {monsterCatched && <MonsterCard monster={monsterCatched} />}
    </>
  )
}

export default ButtonTryCapture
