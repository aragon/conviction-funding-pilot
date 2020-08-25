import { useCallback } from 'react'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { toHex } from 'web3-utils'

const GAS_LIMIT = 450000
const EMPTY_HEX_STRING = '0x'

const noop = () => {}

export default function useActions() {
  const { account, ethers } = useWallet()

  const { convictionVoting, organization } = useAppState()

  const newProposal = useCallback(
    async ({ title, link, amount, beneficiary }, onDone = noop) => {
      try {
        await sendIntent(
          organization,
          convictionVoting.address,
          'addProposal',
          [title, link ? toHex(link) : EMPTY_HEX_STRING, amount, beneficiary],
          { ethers, from: account }
        )
      } catch (err) {
        console.log(err)
      } finally {
        onDone()
      }
    },
    [account, convictionVoting, ethers, organization]
  )

  const stakeToProposal = useCallback(
    async (proposalId, amount, onDone = noop) => {
      try {
        await sendIntent(
          organization,
          convictionVoting.address,
          'stakeToProposal',
          [proposalId, amount],
          { ethers, from: account }
        )
      } catch (err) {
        console.log(err)
      } finally {
        onDone()
      }
    },
    [account, convictionVoting, ethers, organization]
  )

  const withdrawFromProposal = useCallback(
    async (proposalId, amount, onDone = noop) => {
      try {
        await sendIntent(
          organization,
          convictionVoting.address,
          'withdrawFromProposal',
          [proposalId, amount],
          { ethers, from: account }
        )
      } catch (err) {
        console.log(err)
      } finally {
        onDone()
      }
    },
    [account, convictionVoting, ethers, organization]
  )

  const executeProposal = useCallback(
    async (proposalId, onDone = noop) => {
      try {
        await sendIntent(
          organization,
          convictionVoting.address,
          'executeProposal',
          [proposalId],
          { ethers, from: account }
        )
      } catch (err) {
        console.log(err)
      } finally {
        onDone()
      }
    },
    [account, convictionVoting, ethers, organization]
  )

  const cancelProposal = useCallback(
    async (proposalId, onDone = noop) => {
      try {
        await sendIntent(
          organization,
          convictionVoting.address,
          'cancelProposal',
          [proposalId],
          { ethers, from: account }
        )
      } catch (err) {
        console.log(err)
      } finally {
        onDone()
      }
    },
    [account, convictionVoting, ethers, organization]
  )

  return {
    cancelProposal,
    executeProposal,
    newProposal,
    stakeToProposal,
    withdrawFromProposal,
  }
}

async function sendIntent(
  organization,
  appAddress,
  fn,
  params,
  { ethers, from }
) {
  try {
    const intent = organization.appIntent(appAddress, fn, params)

    const txPath = await intent.paths(from)
    const { to, data } = txPath.transactions[0]
    await ethers.getSigner().sendTransaction({ data, to, gasLimit: GAS_LIMIT })
  } catch (err) {
    console.error('Could not create tx:', err)
  }
}
