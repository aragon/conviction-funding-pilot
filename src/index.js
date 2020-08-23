import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'

import App from './App'
import Main from './components/Main'
import MainView from './components/MainView'
import { WalletProvider } from './providers/Wallet'
import { AppStateProvider } from './providers/AppState'

ReactDOM.render(
  <WalletProvider>
    <AppStateProvider>
      <ViewportProvider>
        <HashRouter>
          <Main>
            <MainView>
              <App />
            </MainView>
          </Main>
        </HashRouter>
      </ViewportProvider>
    </AppStateProvider>
  </WalletProvider>,
  document.getElementById('root')
)
