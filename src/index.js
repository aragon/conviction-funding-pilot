import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { ViewportProvider } from 'use-viewport'
import * as Sentry from '@sentry/browser'

import App from './App'
import Main from './components/Main'
import MainView from './components/MainView'
import { WalletProvider } from './providers/Wallet'
import { AppStateProvider } from './providers/AppState'
import env from './environment'

if (env('SENTRY_DSN')) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: env('NODE_ENV'),
    release: 'conviction.aragon.org@' + env('BUILD'),
  })
}

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
