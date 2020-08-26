/* eslint-disable no-unreachable */
import React, { useState, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import { bigNum } from '../lib/bigNumber'
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
    totalStaked,
    minThresholdStakePercentage,
    pctBase,
    ...appData
  } = useAppData(organization)

  const vaultBalance = useVaultBalance(installedApps, requestToken)

  const { balance, totalSupply } = useTokenBalances(account, stakeToken)

  const effectiveSupply = useMemo(() => {
    if (
      !(totalSupply && totalStaked && minThresholdStakePercentage && pctBase)
    ) {
      return
    }

    const percentageOfTotalSupply = totalSupply
      .multipliedBy(minThresholdStakePercentage)
      .div(bigNum('1'))

    if (totalStaked.lt(percentageOfTotalSupply)) {
      return percentageOfTotalSupply
    }
    return totalStaked
  }, [totalSupply, totalStaked, minThresholdStakePercentage, pctBase])

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)
  const appLoading = !convictionVoting || balancesLoading || !effectiveSupply

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        appearance,
        effectiveSupply,
        setAppearance,
        convictionVoting,
        installedApps,
        isLoading: appLoading,
        requestToken,
        stakeToken,
        totalStaked,
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
