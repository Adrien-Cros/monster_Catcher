import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import Routing from './Routing/Routing'

import './index.scss'
import store from './Store/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Routing />
    </React.StrictMode>
  </Provider>
)
