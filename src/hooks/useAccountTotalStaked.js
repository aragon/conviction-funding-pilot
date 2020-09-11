import { useMemo } from 'react'
import BigNumber from '../lib/bigNumber'
import { addressesEqual } from '../lib/web3-utils'
import { useWallet } from '../providers/Wallet'
import { useAppState } from '../providers/AppState'

export default function useAccountTotalStaked() {
  const { proposals = [] } = useAppState()
  const { account } = useWallet()

  const totalStaked = useMemo(
    () =>
      proposals
        // NOTE: There can be staked tokens on cancelled or withdrawn proposals,
        // but the smart contract automatically removes this balance when staking an amount higher
        // than the available "unstaked" amount.
        // See: https://github.com/1hive/conviction-voting-app/blob/master/contracts/ConvictionVoting.sol#L489-L508
        .filter(({ status }) => status === 'Active')
        .reduce((acc, { stakes }) => {
          const myStake = stakes.find(({ entity }) =>
            addressesEqual(entity, account)
          )

          if (!myStake) {
            return acc
          }

          return acc.plus(myStake.amount)
        }, new BigNumber(0)),
    [proposals, account]
  )

  return totalStaked
}
