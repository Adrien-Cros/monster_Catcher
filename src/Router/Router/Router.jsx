import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from '../../Components/Header/Header'
import Home from '../../Pages/Home/Home'
import RandomEncounter from '../../Pages/RandomEncounter/RandomEncounter'
import MainMenu from '../../Pages/MainMenu/MainMenu'

function Routing() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<MainMenu />} />
        <Route path="/random-encounter" element={<RandomEncounter />} />
      </Routes>
    </Router>
  )
}

export default Routing
