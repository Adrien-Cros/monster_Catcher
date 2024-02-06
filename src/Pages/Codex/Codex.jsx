import { useState } from 'react'

import monsterData from '../../Data/monsters.json'
import MonsterCardCodex from '../../Components/MonsterCard/MonsterCardCodex/MonsterCardCodex'
import MenuButton from '../../Components/Button/MenuButton/MenuButton'

import './codex.scss'

function Codex() {
  const [whichFilterIsOn, setWhichFilterIsOn] = useState()

  const handleFilterClick = (filter) => {
    setWhichFilterIsOn(filter)
  }

  const handleShowOnly = (element) => {}

  const handleSortBy = (property) => {}

  const filterMonsters = () => {
    if (!whichFilterIsOn) {
      return monsterData.monsters
    }

    if (whichFilterIsOn === 'id') {
      return monsterData.monsters.slice().sort((a, b) => a.id - b.id)
    }

    if (whichFilterIsOn === 'element') {
      return monsterData.monsters
        .slice()
        .sort((a, b) => a.type[0].localeCompare(b.type[0]))
    }

    if (whichFilterIsOn === 'type') {
      return monsterData.monsters
        .slice()
        .sort((a, b) => a.type[0].localeCompare(b.type[0]))
    }

    if (whichFilterIsOn === 'stats') {
      return monsterData.monsters
        .slice()
        .sort((a, b) => a.stats.attack - b.stats.attack)
    }

    return monsterData.monsters
  }

  return (
    <section className="codex">
      <div className="filter-button">
        Filter by:
        <MenuButton boutonName={'Id'} onClick={() => handleFilterClick('id')} />
        <MenuButton
          boutonName={'Element'}
          onClick={() => handleFilterClick('element')}
        />
        <MenuButton
          boutonName={'Type'}
          onClick={() => handleFilterClick('type')}
        />
        <MenuButton
          boutonName={'Base stats'}
          onClick={() => handleFilterClick('stats')}
        />
        {whichFilterIsOn === 'element' && (
          <div className="filter-button-extra">
            <MenuButton
              boutonName={'Ice'}
              onClick={() => handleShowOnly('Ice')}
            />
            <MenuButton
              boutonName={'Water'}
              onClick={() => handleShowOnly('Water')}
            />
            <MenuButton
              boutonName={'Fire'}
              onClick={() => handleShowOnly('Fire')}
            />
            <MenuButton
              boutonName={'Lightning'}
              onClick={() => handleShowOnly('Lightning')}
            />
            <MenuButton
              boutonName={'Arcane'}
              onClick={() => handleShowOnly('Arcane')}
            />
            <MenuButton
              boutonName={'Dark'}
              onClick={() => handleShowOnly('Dark')}
            />
            <MenuButton
              boutonName={'Holy'}
              onClick={() => handleShowOnly('Holy')}
            />
          </div>
        )}
        {whichFilterIsOn === 'stats' && (
          <div className="filter-button-extra">
            <MenuButton
              boutonName={'Attack'}
              onClick={() => handleSortBy('attack')}
            />
            <MenuButton
              boutonName={'Magic'}
              onClick={() => handleSortBy('magic')}
            />
            <MenuButton
              boutonName={'Defense'}
              onClick={() => handleSortBy('defense')}
            />
            <MenuButton
              boutonName={'Spirit'}
              onClick={() => handleSortBy('spirit')}
            />
            <MenuButton
              boutonName={'Speed'}
              onClick={() => handleSortBy('speed')}
            />
            <MenuButton
              boutonName={'Despair'}
              onClick={() => handleSortBy('despair')}
            />
            <MenuButton
              boutonName={'Luck'}
              onClick={() => handleSortBy('speed')}
            />
          </div>
        )}
      </div>
      <div className="monster-card-container">
        {filterMonsters().map((monster, index) => (
          <MonsterCardCodex key={index} monster={monster} />
        ))}
      </div>
    </section>
  )
}

export default Codex
