import {
  Contract as EthersContract,
  getDefaultProvider as getEthersDefaultProvider,
} from 'ethers'
import { getKnownContract } from '../lib/known-contracts'
import env from '../environment'
import { getNetwork } from '../networks'

const readOnlyContractsCache = new Map()

export function useReadOnlyContract(name) {
  const [address, abi] = getKnownContract(name)

  if (readOnlyContractsCache.get(address)) {
    return readOnlyContractsCache.get(address)
  }

  const { ensRegistry: ensAddress, chainId, type: networkName } = getNetwork(
    env('CHAIN_ID')
  )

  const defaultProvider = getEthersDefaultProvider({
    name: networkName,
    chainId,
    ensAddress,
  })

  const contract = new EthersContract(address, abi, defaultProvider)

  readOnlyContractsCache.set(address, contract)

  return contract
}
