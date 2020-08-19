import React, { useCallback, useMemo, useState } from 'react'
import { Button, GU, Info } from '@aragon/ui'

import useAccountTotalStaked from '../hooks/useAccountTotalStaked'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'
import BigNumber from '../lib/bigNumber'
import AccountNotConnected from './AccountNotConnected'
import ChangeSupportModal from './ChangeSupportModal'
import ProposalSupported from './ProposalSupported'

function ProposalActions({
  myStakes,
  proposal,
  onExecuteProposal,
  onRequestSupportProposal,
  onStakeToProposal,
  onWithdrawFromProposal,
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const { stakeToken, accountBalance } = useAppState()
  const { account: connectedAccount } = useWallet()
  const { id, currentConviction, stakes, threshold } = proposal

  const totalStaked = useAccountTotalStaked()

  // This is the current stake in this proposal
  const myStake = useMemo(
    () =>
      stakes.find(({ entity }) => addressesEqual(entity, connectedAccount)) || {
        amount: new BigNumber('0'),
      },
    [stakes, connectedAccount]
  )

  const myActiveTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const nonStakedTokens = useMemo(() => accountBalance.minus(totalStaked), [
    accountBalance,
    totalStaked,
  ])

  const didIStake = myStake?.amount.gt(0)

  const mode = useMemo(() => {
    if (currentConviction.gte(threshold)) {
      return 'execute'
    }
    if (didIStake) {
      return 'update'
    }
    return 'support'
  }, [currentConviction, didIStake, threshold])

  const closeModal = useCallback(() => {
    setModalVisible(false)
  }, [setModalVisible])

  const openModal = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

  const handleExecute = useCallback(() => {
    onExecuteProposal(id)
  }, [id, onExecuteProposal])

  const buttonProps = useMemo(() => {
    if (mode === 'execute') {
      return {
        text: 'Execute proposal',
        action: handleExecute,
        mode: 'strong',
        disabled: false,
      }
    }

    if (mode === 'update') {
      return {
        text: 'Change support',
        mode: 'normal',
      }
    }
    return {
      text: 'Support this proposal',
      action: onRequestSupportProposal,
      mode: 'strong',
      disabled: !accountBalance.gt(0),
    }
  }, [accountBalance, handleExecute, mode, onRequestSupportProposal])

  return connectedAccount ? (
    <>
      <div>
        {mode === 'update' && (
          <>
            <div
              css={`
                margin-bottom: ${2 * GU}px;
              `}
            >
              <ProposalSupported amountOfTokens={myStake.amount} />
            </div>
          </>
        )}
        <Button
          mode="strong"
          onClick={openModal}
          css={`
            width: 215px;
            margin-top: ${3 * GU}px;
            box-shadow: 0px 4px 6px rgba(7, 146, 175, 0.08);
          `}
        >
          {buttonProps.text}
        </Button>
        <Button
          onClick={openModal}
          css={`
            width: 215px;
            margin-top: ${3 * GU}px;
            margin-left: ${1.5 * GU}px;
            box-shadow: 0px 4px 6px rgba(7, 146, 175, 0.08);
          `}
        >
          Withdraw proposal
        </Button>
        {mode === 'support' && buttonProps.disabled && (
          <Info
            mode="warning"
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            The currently connected account does not hold any{' '}
            <strong>{stakeToken.symbol}</strong> tokens and therefore cannot
            participate in this proposal. Make sure your account is holding{' '}
            <strong>{stakeToken.symbol}</strong>.
          </Info>
        )}
      </div>
      <ChangeSupportModal
        accountBalance={accountBalance}
        availableTokens={nonStakedTokens}
        currentStakedTokens={myStake.amount}
        modalVisible={modalVisible}
        onModalClose={closeModal}
        onStakeToProposal={onStakeToProposal}
        onWithdrawFromProposal={onWithdrawFromProposal}
        proposalId={id}
        totalActiveTokens={myActiveTokens}
      />
    </>
  ) : (
    <AccountNotConnected />
  )
}

export default ProposalActions
