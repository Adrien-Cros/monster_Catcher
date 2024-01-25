import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import Router from './Router/Router/Router'

import './index.scss'
import store from './Store/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </Provider>
)
