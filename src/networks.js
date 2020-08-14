import { getNetworkType, isLocalOrUnknownNetwork } from './lib/web3-utils'
import { getDefaultChain } from './local-settings'

const networks = {
  mainnet: {
    chainId: 1,
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    defaultEthNode: 'wss://mainnet.eth.aragon.network/ws',
    name: 'Mainnet',
    orgAddress: '',
    type: 'main',
  },
  rinkeby: {
    chainId: 4,
    ensRegistry: '0x98df287b6c145399aaa709692c8d308357bc085d',
    defaultEthNode: 'wss://rinkeby.eth.aragon.network/ws',
    name: 'Rinkeby',
    orgAddress: '0xae44412a8d4519bf31143372763328f406c99881',
    type: 'rinkeby',
  },
  xdai: {
    chainId: 100,
    ensRegistry: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    name: 'xDai',
    orgAddress: '',
    type: 'xdai',
  },
}

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId)
}

export function getNetwork(chainId = getDefaultChain()) {
  return networks[getNetworkInternalName(chainId)]
}

export function getAvailableNetworks() {
  return Object.entries(networks).map(([key, { chainId, name, type }]) => ({
    chainId,
    name,
    type,
  }))
}
