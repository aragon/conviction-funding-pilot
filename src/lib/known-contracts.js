import ercTokenAbi from '../abi/ercToken.json'
import env from '../environment'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    1,
    {
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
    },
  ],
  [
    4,
    {
      TOKEN_ANT: '0x8cf8196c14A654dc8Aceb3cbb3dDdfd16C2b652D',
    },
  ],
])

const ABIS = new Map([['TOKEN_ANT', ercTokenAbi]])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
