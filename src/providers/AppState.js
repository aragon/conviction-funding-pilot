import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import {
  useAppData,
  useVaultBalance,
  useOrganzation,
  useTokenBalances,
} from '../hooks/useOrgHooks'
import { useWallet } from '../providers/Wallet'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const [appearance, setAppearance] = useState('light')
  const { account } = useWallet()
  const organization = useOrganzation()
  const {
    convictionVoting,
    installedApps,
    requestToken,
    stakeToken,
    ...appData
  } = useAppData(organization)

  const vaultBalance = useVaultBalance(installedApps, requestToken)
  const { balance, totalSupply } = useTokenBalances(account, stakeToken)
  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)
  const appLoading = !convictionVoting || balancesLoading

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        appearance,
        setAppearance,
        convictionVoting,
        installedApps,
        isLoading: appLoading,
        requestToken,
        stakeToken,
        totalSupply: totalSupply,
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
