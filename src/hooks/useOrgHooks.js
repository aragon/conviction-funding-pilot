import { useEffect, useRef, useState } from 'react'
import ConvictionVoting from '@1hive/connect-conviction-voting'
import { connect } from '@aragon/connect'
import env from '../environment'
import { getNetwork } from '../networks'
import BigNumber from '../lib/bigNumber'
import { transformConfigData, getAppAddressByName } from '../lib/data-utils'
import { getDefaultChain } from '../local-settings'
import { useWallet } from '../providers/Wallet'
import { addressesEqual } from '../lib/web3-utils.js'
import {
  useProposalsSubscription,
  useStakesHistorySubscription,
  // useConfigSubscription,
} from './useSubscriptions'
import { useContractReadOnly } from './useContract'
import minimeTokenAbi from '../abi/minimeToken.json'
import vaultAbi from '../abi/vault-balance.json'

// Organzation
const APP_NAME = 'conviction-beta'

const DEFAULT_APP_DATA = {
  convictionVoting: null,
  stakeToken: {},
  requestToken: {},
  proposals: [],
  stakesHistory: [],
  alpha: BigNumber(0),
  maxRatio: BigNumber(0),
  weight: BigNumber(0),
}

export function useOrganzation() {
  const [organzation, setOrganization] = useState(null)
  const { ethereum, ethers } = useWallet()

  useEffect(() => {
    let cancelled = false

    const fetchOrg = async () => {
      const { orgAddress } = getNetwork(env('CHAIN_ID'))

      const organization = await connect(orgAddress, 'thegraph', {
        network: getDefaultChain(),
      })

      if (!cancelled) {
        setOrganization(organization)
      }
    }

    fetchOrg()

    return () => {
      cancelled = true
    }
  }, [ethers, ethereum])

  return organzation
}

export function useAppData(organization) {
  const [appData, setAppData] = useState(DEFAULT_APP_DATA)

  useEffect(() => {
    if (!organization) {
      return
    }

    let cancelled = false

    const fetchAppData = async () => {
      const apps = await organization.apps()
      const permissions = await organization.permissions()

      const convictionApp = apps.find(app => app.name === APP_NAME)

      const convictionAppPermissions = permissions.filter(({ appAddress }) =>
        addressesEqual(appAddress, convictionApp.address)
      )

      const convictionVoting = await ConvictionVoting(
        convictionApp,
        'https://api.thegraph.com/subgraphs/name/evalir/aragon-cv-rinkeby-staging'
      )

      const config = await convictionVoting.config()

      console.log(convictionVoting, config)

      if (!cancelled) {
        setAppData(appData => ({
          ...appData,
          ...transformConfigData(config),
          installedApps: apps,
          convictionVoting,
          organization,
          permissions: convictionAppPermissions,
        }))
      }
    }

    fetchAppData()

    return () => {
      cancelled = true
    }
  }, [organization])

  const proposals = useProposalsSubscription(appData.convictionVoting)

  // const config = useConfigSubscription(appData.convictionVoting)

  // Stakes done across all proposals on this app
  // Includes old and current stakes
  const stakesHistory = useStakesHistorySubscription(appData.convictionVoting)

  return {
    ...appData,
    // ...transformConfigData(config),
    proposals,
    stakesHistory,
  }
}

export function useVaultBalance(installedApps, token, timeout = 1000) {
  const vaultAddress = getAppAddressByName(installedApps, 'vault')
  const vaultContract = useContractReadOnly(vaultAddress, vaultAbi)
  const [vaultBalance, setVaultBalance] = useState(new BigNumber(-1))
  console.log(installedApps)
  // We are starting in 0 in order to immediately make the fetch call
  const controlledTimeout = useRef(0)

  useEffect(() => {
    let cancelled = false
    let timeoutId

    if (!vaultContract) {
      return
    }

    const fetchVaultBalance = () => {
      timeoutId = setTimeout(async () => {
        try {
          const vaultContractBalance = await vaultContract.balance(token.id)

          if (!cancelled) {
            // Contract value is bn.js so we need to convert it to bignumber.js
            const newValue = new BigNumber(vaultContractBalance.toString())

            if (!newValue.eq(vaultBalance)) {
              setVaultBalance(newValue)
            }
          }
        } catch (err) {
          console.error(`Error fetching balance: ${err} retrying...`)
        }

        if (!cancelled) {
          clearTimeout(timeoutId)
          controlledTimeout.current = timeout
          fetchVaultBalance()
        }
      }, controlledTimeout.current)
    }

    fetchVaultBalance()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [vaultBalance, vaultContract, controlledTimeout, timeout, token.id])

  return vaultBalance
}

export function useTokenBalances(account, token, timer = 3000) {
  const [balances, setBalances] = useState({
    balance: new BigNumber(-1),
    totalSupply: new BigNumber(-1),
  })

  const tokenContract = useContractReadOnly(token.id, minimeTokenAbi)

  useEffect(() => {
    if (!token.id) {
      return
    }

    let cancelled = false
    let timeoutId

    const fetchAccountStakeBalance = async () => {
      try {
        let contractNewBalance = new BigNumber(-1)
        if (account) {
          contractNewBalance = await tokenContract.balanceOf(account)
        }

        const contractTotalSupply = await tokenContract.totalSupply()
        if (!cancelled) {
          // Contract value is bn.js so we need to convert it to bignumber.js
          const newBalance = new BigNumber(contractNewBalance.toString())
          const newTotalSupply = new BigNumber(contractTotalSupply.toString())

          if (
            !newTotalSupply.eq(balances.totalSupply) ||
            !newBalance.eq(balances.balance)
          ) {
            setBalances({ balance: newBalance, totalSupply: newTotalSupply })
          }
        }
      } catch (err) {
        console.error(`Error fetching balance: ${err} retrying...`)
      }
    }

    fetchAccountStakeBalance()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [account, balances, tokenContract, token.id])

  return balances
}
