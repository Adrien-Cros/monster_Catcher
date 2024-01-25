import { useSelector } from 'react-redux'
import MonsterCard from '../MonsterCard/MonsterCard'
import './playerTeam.scss'

function PlayerTeam() {
  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  return (
    <div className="player-team">
      <h3>Your current team</h3>
      {teamMonsters.map((monster, index) => (
        <MonsterCard
          key={index}
          monster={monster}
          canAccessMenu={true}
          canBeRemovedFromTeam={true}
          canBeDelete={false}
        />
      ))}
    </div>
  )
}

export default PlayerTeam
