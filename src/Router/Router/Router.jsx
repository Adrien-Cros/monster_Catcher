import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from '../../Components/Header/Header'
import Home from '../../Pages/Home/Home'

function Routing() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default Routing
