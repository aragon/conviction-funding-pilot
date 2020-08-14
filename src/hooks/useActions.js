import { useCallback } from 'react'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import { toHex } from 'web3-utils'
import { getAppAddressByName } from '../lib/data-utils'

const GAS_LIMIT = 450000
const EMPTY_HEX_STRING = '0x'

export default function useActions(onDone) {
  const { account, ethers } = useWallet()

  const { convictionVoting, installedApps, organization } = useAppState()

  const newProposal = useCallback(
    async ({ title, link, amount, beneficiary }) => {
      sendIntent(
        organization,
        convictionVoting.address,
        'addProposal',
        [title, link ? toHex(link) : EMPTY_HEX_STRING, amount, beneficiary],
        { ethers, from: account }
      )

      onDone()
    },
    [account, convictionVoting, ethers, onDone, organization]
  )

  const stakeToProposal = useCallback(
    (proposalId, amount) => {
      sendIntent(
        organization,
        convictionVoting.address,
        'stakeToProposal',
        [proposalId, amount],
        { ethers, from: account }
      )

      onDone()
    },
    [account, convictionVoting, ethers, onDone, organization]
  )

  const withdrawFromProposal = useCallback(
    (proposalId, amount) => {
      sendIntent(
        organization,
        convictionVoting.address,
        'withdrawFromProposal',
        [proposalId, amount],
        { ethers, from: account }
      )

      onDone()
    },
    [account, convictionVoting, ethers, onDone, organization]
  )

  const executeProposal = useCallback(
    proposalId => {
      sendIntent(
        organization,
        convictionVoting.address,
        'executeProposal',
        [proposalId, true],
        { ethers, from: account }
      )

      onDone()
    },
    [account, convictionVoting, ethers, onDone, organization]
  )

  const executeIssuance = useCallback(() => {
    const issuanceAddress = getAppAddressByName(installedApps, 'issuance')

    sendIntent(organization, issuanceAddress, 'executeIssuance', [], {
      ethers,
      from: account,
    })
  }, [account, ethers, installedApps, organization])

  return {
    executeIssuance,
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
    console.log(organization, appAddress, fn, params, ethers, from, '??')
    const intent = organization.appIntent(appAddress, fn, params)

    const txPath = await intent.paths(from)
    const { to, data } = txPath.transactions[0] // TODO: Handle errors when no tx path is found
    ethers.getSigner().sendTransaction({ data, to, gasLimit: GAS_LIMIT })
  } catch (err) {
    console.error('Could not create tx:', err)
  }
}
