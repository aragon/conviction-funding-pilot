// rinkeby
const DEFAULT_CHAIN_ID = 4

const ENV_VARS = {
  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return chainId || DEFAULT_CHAIN_ID
  },
  FORTMATIC_API_KEY() {
    return process.env.REACT_APP_FORTMATIC_API_KEY || ''
  },
  PORTIS_DAPP_ID() {
    return process.env.REACT_APP_PORTIS_DAPP_ID || ''
  },
  WALLETCONNECT_RPC_URL() {
    return (
      process.env.REACT_APP_WALLETCONNECT_RPC_URL ||
      // We're not dynamically setting the network due to the
      // web3-react WalletConnect connector being broken on any chain
      // > 1.
      // https://github.com/NoahZinsmeister/web3-react/blob/v6/packages/walletconnect-connector/src/index.ts#L31
      'https://mainnet.eth.aragon.network/'
    )
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
