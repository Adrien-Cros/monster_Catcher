import { useSelector } from 'react-redux'

import playerLevelsData from '../../../Data/playerLevels.json'

import './playerInfosHUD.scss'

// Return the full header HUD with all informations of the player current infos
function PlayerInfosHUD() {
  const playerInformations = useSelector((state) => state.playerInfo)
  const xpToNext =
    playerLevelsData.levels[playerInformations.playerLevel - 1].xpRequiredToNext

  return (
    <div className="HUD-container HUD-apparition">
      <div className="username">{playerInformations.username}</div>
      <div className="level-container">
        <div className="xp-bar">
          Level: {playerInformations.playerLevel}
          <div className="xp-container">
            {playerInformations.playerXp}/{xpToNext}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerInfosHUD
