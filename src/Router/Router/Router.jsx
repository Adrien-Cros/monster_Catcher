import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

import Header from '../../Components/Header/Header'
import Home from '../../Pages/Home/Home'
import RandomEncounter from '../../Pages/RandomEncounter/RandomEncounter'
import MainMenu from '../../Pages/MainMenu/MainMenu'

function Routing() {
  //used to track where the player is, to give access or not at certain parts of the app
  const whereIsTheUser = useSelector((state) => state.gameStatus)

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {whereIsTheUser.inMainMenu ? (
          <>
            <Route path="/main" element={<MainMenu />} />
          </>
        ) : (
          <>
            <Route path="/main" element={<Navigate to="/" />} />
          </>
        )}
        {whereIsTheUser.inRandomEncounter ? (
          <Route path="/random-encounter" element={<RandomEncounter />} />
        ) : (
          <Route path="/random-encounter" element={<Navigate to="/main" />} />
        )}
      </Routes>
    </Router>
  )
}

export default Routing
