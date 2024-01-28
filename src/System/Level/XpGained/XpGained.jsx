//function used to check how many xp the monster win
//victoriousMonster = monster object you want to add xp
//defeatedMonster  = monster object you want to check how many xp it gives
//return the xp value gained
const XpGained = ({ victoriousMonster, defeatedMonster }) => {
  //check xpModifier from the difficulty
  // const xpModifier = useSelector((state) => state.config.xpRate)

  //base xp for a kill
  const BASE_XP_GIVEN = 100
  //base xp lose or gain per level difference
  const XP_PER_LEVEL_DIFF = 10
  //variance factor in %
  const VARIANCE = 25

  let xpValue = 0

  const levelDiff = victoriousMonster.level - defeatedMonster.level

  //victorious monster is higher level than defeated monster
  if (levelDiff > 0) {
    xpValue = BASE_XP_GIVEN - XP_PER_LEVEL_DIFF * levelDiff
    // Apply random XP factor
    const halfVariance = VARIANCE / 2
    const randomVariance = Math.random() * VARIANCE - halfVariance
    xpValue += randomVariance
  }
  //victorious monster is lower or equal level than defeated monster
  else if (levelDiff <= 0) {
    xpValue = BASE_XP_GIVEN + XP_PER_LEVEL_DIFF * levelDiff
    // Apply random XP factor
    const halfVariance = VARIANCE / 2
    const randomVariance = Math.random() * VARIANCE - halfVariance
    xpValue += randomVariance
  } else {
    console.log('An error occured: ', victoriousMonster, ' + ', defeatedMonster)
  }
  //rounded up
  if (xpValue < 0) {
    xpValue = 0
  }

  xpValue = Math.ceil(xpValue)

  return xpValue
}
export default XpGained
