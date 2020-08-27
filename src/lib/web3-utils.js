/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { toChecksumAddress } from 'web3-utils'
import env from '../environment'
import { getDefaultChain } from '../local-settings'

const DEFAULT_LOCAL_CHAIN = '1337'

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }]

  if (env('WALLETCONNECT_RPC_URL')) {
    providers.push({
      id: 'walletconnect',
      useWalletConf: { rpcUrl: env('WALLETCONNECT_RPC_URL') },
    })
  }

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  if (env('PORTIS_DAPP_ID')) {
    providers.push({
      id: 'portis',
      useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
    })
  }

  return providers
}

export function isLocalOrUnknownNetwork(chainId = getDefaultChain()) {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

export function getNetworkType(chainId = getDefaultChain()) {
  chainId = String(chainId)

  if (chainId === '1') return 'mainnet'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'
  if (chainId === '100') return 'xdai'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkName(chainId = getDefaultChain()) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'
  if (chainId === '100') return 'xDai'

  return 'unknown'
}

// Check address equality with checksums
export function addressesEqual(first, second) {
  first = first && toChecksumAddress(first)
  second = second && toChecksumAddress(second)
  return first === second
}

export const addressPattern = '(0x)?[0-9a-fA-F]{40}'
const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses(str, callback) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) =>
      callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index)
    )
}

export function addressesEqualNoSum(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

/**
 * Convert a token into a USD price
 *
 * @param {String} symbol The symbol of the token to convert from.
 * @param {Number} decimals The amount of decimals for the token.
 * @param {BigNumber} balance The balance to convert into USD.
 * @returns {String} the amount of the token in USD
 */
export function useTokenBalanceToUsd(symbol, decimals, balance) {
  const [usd, setUsd] = useState(BigNumber('0'))
  useEffect(() => {
    let cancelled = false

    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${'ANT'}&tsyms=USD`
    )
      .then(res => res.json())
      .then(price => {
        if (cancelled || !balance || !(parseFloat(price.USD) > 0)) {
          return
        }

        const usdDigits = 2
        const precision = 6

        const usdBalance = balance
          .times(
            BigNumber(parseInt(price.USD * 10 ** (precision + usdDigits), 10))
          )
          .div(10 ** precision)
          .div(BigNumber(10).pow(decimals))
        setUsd(usdBalance)
      })
      .catch(err => console.log(err))

    return () => {
      cancelled = true
    }
  }, [balance, decimals, symbol])

  return usd
}

// Re-export some web3-utils functions
export { isAddress, toChecksumAddress, toUtf8, soliditySha3 } from 'web3-utils'
