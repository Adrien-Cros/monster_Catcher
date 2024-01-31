import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import MonsterCardClassic from '../MonsterCard/MonsterCardClassic/MonsterCardClassic'
import MonsterCardLight from '../MonsterCard/MonsterCardLight/MonsterCardLight'

import './playerTeam.scss'

//Function to show player monsters inventory, and move it to the box or apply various actions
function PlayerTeam({ canAccessMonsterMenu, monsterCardStyle }) {
  const teamMonsters = useSelector(
    (state) => state.monsterTeam.actualMonstersInTeam
  )

  const maxMonstersInTeam = useSelector(
    (state) => state.config.maxMonstersInTeam
  )

  return (
    <>
      <h3>
        Your current team: {teamMonsters.length}/{maxMonstersInTeam}
      </h3>
      <div className="current-team">
        {monsterCardStyle === 'Classic' &&
          teamMonsters.map((monster, index) => (
            <MonsterCardClassic
              key={monster.uniqueKey}
              monster={monster}
              canAccessMenu={canAccessMonsterMenu}
              canBeRemovedFromTeam={true}
              canBeDelete={false}
              showStats={true}
            />
          ))}
        {monsterCardStyle === 'Light' &&
          teamMonsters.map((monster, index) => (
            <MonsterCardLight
              key={monster.uniqueKey}
              monster={monster}
              canAccessMenu={canAccessMonsterMenu}
              canBeRemovedFromTeam={true}
              canBeDelete={false}
              showStats={true}
            />
          ))}
      </div>
    </>
  )
}

PlayerTeam.propTypes = {
  // Flag indicating whether the user has access to the menu for the monster.
  canAccessMonsterMenu: PropTypes.bool,
  // Flag indicating whether the user is in combat or not.
  inCombat: PropTypes.bool,
}

export default PlayerTeam
