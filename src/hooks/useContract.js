/* eslint-disable no-unused-vars */
import { useMemo } from 'react'
import Ethers, {
  Contract as EthersContract,
  providers as Providers,
} from 'ethers'
import { getNetwork } from '../networks'

export function useContractReadOnly(address, abi) {
  const {
    defaultEthNode: readProvider,
    ensRegistry,
    type: networkName,
  } = getNetwork()

  const ethProvider = useMemo(
    () =>
      readProvider.includes('wss')
        ? Ethers.getDefaultProvider(networkName)
        : new Providers.JsonRpcProvider(readProvider),
    [networkName, readProvider]
  )

  return useMemo(() => {
    if (!address) {
      return null
    }
    return new EthersContract(address, abi, ethProvider)
  }, [abi, address, ethProvider])
}
