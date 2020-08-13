import { useEffect, useRef, useState } from 'react'
import ConvictionVoting from '@1hive/connect-conviction-voting'
import { connect } from '@aragon/connect'
import { getDefaultChain } from '../local-settings'
import { transformConfigData, getAppAddressByName } from '../lib/data-utils'
import { addressesEqual } from '../lib/web3-utils.js'
import { useContractReadOnly } from './useContract'

import BigNumber from '../lib/bigNumber'

import vaultAbi from '../abi/vault-balance.json'
import { useWallet } from '../providers/Wallet'
import {
  useProposalsSubscription,
  useStakesHistorySubscription,
} from './useSubscriptions'

console.log(ConvictionVoting)

// Organzation
const ORG_ADDRESS = '0x7050ead31291e288fee6f34f8616b58a86064d4f'

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
  console.log(ethereum, ethers)
  useEffect(() => {
    let cancelled = false
    const fetchOrg = async () => {
      const organization = await connect(ORG_ADDRESS, 'thegraph', {
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
      console.log(convictionApp, 'conviction', apps)
      const convictionAppPermissions = permissions.filter(({ appAddress }) =>
        addressesEqual(appAddress, convictionApp.address)
      )

      const convictionVoting = await ConvictionVoting(convictionApp)

      console.log(convictionVoting, 'conviction')

      const config = await convictionVoting.config()

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

  // Stakes done across all proposals on this app
  // Includes old and current stakes
  const stakesHistory = useStakesHistorySubscription(appData.convictionVoting)

  return { ...appData, proposals, stakesHistory }
}

export function useVaultBalance(installedApps, token, timeout = 1000) {
  const vaultAddress = getAppAddressByName(installedApps, 'vault')
  const vaultContract = useContractReadOnly(vaultAddress, vaultAbi)

  const [vaultBalance, setVaultBalance] = useState(new BigNumber(-1))

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
