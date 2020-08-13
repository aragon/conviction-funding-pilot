import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import {
  useVaultBalance,
  useOrganzation,
  useAppData,
} from '../hooks/useOrgHooks'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const organization = useOrganzation()
  const {
    convictionVoting,
    installedApps,
    requestToken,
    stakeToken,
    ...appData
  } = useAppData(organization)

  const vaultBalance = useVaultBalance(installedApps, requestToken)

  const appLoading = !convictionVoting

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        convictionVoting,
        installedApps,
        isLoading: appLoading,
        requestToken,
        stakeToken,
        vaultBalance,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

AppStateProvider.propTypes = {
  children: PropTypes.node,
}

function useAppState() {
  return useContext(AppStateContext)
}

export { AppStateProvider, useAppState }
