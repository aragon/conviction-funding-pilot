import React, { useCallback, useMemo, useState } from 'react'
import { useViewport } from 'use-viewport'
import { Button, GU, Info } from '@aragon/ui'

import useAccountTotalStaked from '../hooks/useAccountTotalStaked'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import { addressesEqual } from '../lib/web3-utils'
import BigNumber from '../lib/bigNumber'
import AccountNotConnected from './AccountNotConnected'
import ChangeSupportModal from './ChangeSupportModal'
import ProposalSupported from './ProposalSupported'
import { ZERO_ADDR } from '../constants'

function ProposalActions({
  hasCancelRole,
  myStakes,
  onCancelProposal,
  onExecuteProposal,
  onStakeToProposal,
  onWithdrawFromProposal,
  proposal,
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [mainButtonDisabled, setMainButtonDisabled] = useState(false)
  const { stakeToken, accountBalance, vaultBalance } = useAppState()
  const { account: connectedAccount } = useWallet()
  const { below } = useViewport()

  const compactMode = below('large')
  const {
    beneficiary,
    currentConviction,
    id,
    stakes,
    status,
    threshold,
  } = proposal

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
    if (status.toLowerCase() === 'cancelled') {
      return 'cancelled'
    }

    if (status.toLowerCase() === 'executed') {
      return 'executed'
    }

    if (
      currentConviction.gte(threshold) &&
      !vaultBalance.eq('0') &&
      threshold.toFixed(0) !== '-1'
    ) {
      return 'execute'
    }

    if (didIStake) {
      return 'update'
    }

    return 'support'
  }, [currentConviction, didIStake, status, threshold, vaultBalance])

  const toggleMainButtonDisabled = useCallback(
    () => setMainButtonDisabled(disabled => !disabled),
    [setMainButtonDisabled]
  )

  const closeModal = useCallback(() => {
    setModalVisible(false)
  }, [setModalVisible])

  const openModal = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

  const onDone = useCallback(() => {
    toggleMainButtonDisabled()
  }, [toggleMainButtonDisabled])

  const handleExecute = useCallback(() => {
    toggleMainButtonDisabled()
    onExecuteProposal(id, onDone)
  }, [id, onDone, onExecuteProposal, toggleMainButtonDisabled])

  const handleWithdraw = useCallback(() => {
    toggleMainButtonDisabled()
    onWithdrawFromProposal(id, myStake.amount.toFixed(0), onDone)
  }, [
    id,
    myStake.amount,
    onDone,
    onWithdrawFromProposal,
    toggleMainButtonDisabled,
  ])

  const signalingProposal = addressesEqual(beneficiary, ZERO_ADDR)

  const isExecutable = useMemo(() => !signalingProposal && mode === 'execute', [
    mode,
    signalingProposal,
  ])
  const isCancellable = useMemo(
    () => hasCancelRole && mode !== 'executed' && mode !== 'active',
    [hasCancelRole, mode]
  )
  const isSupportable = useMemo(() => accountBalance.gt('0'), [accountBalance])

  const buttonProps = useMemo(() => {
    // In both cases, we wanna let the users be able to withdraw the tokens manually.
    if (mode === 'executed' || mode === 'cancelled') {
      return {
        text: 'Withdraw staked tokens',
        action: handleWithdraw,
        mode: 'strong',
        disabled: !didIStake,
      }
    }
    // Signaling proposals cannot be executed, so we exclude this case.
    if (mode === 'execute' && !signalingProposal) {
      return {
        text: 'Execute proposal',
        action: handleExecute,
        mode: 'strong',
        disabled: false,
      }
    }

    // We have supported the proposal, but we may wanna change the current support.
    if (mode === 'update') {
      return {
        text: 'Change support',
        mode: 'normal',
        action: openModal,
      }
    }

    // We haven't supported this proposal, and it's not executed or cancelled.
    return {
      text: 'Support this proposal',
      action: openModal,
      mode: 'strong',
      disabled: !accountBalance.gt(0),
    }
  }, [
    accountBalance,
    didIStake,
    handleExecute,
    handleWithdraw,
    mode,
    openModal,
    signalingProposal,
  ])

  return connectedAccount ? (
    <>
      <div
        css={`
          width: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        {didIStake && (
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
        <div
          css={`
            width: 100%;
            display: flex;
            ${compactMode &&
              `
                flex-direction: column;
            `}
          `}
        >
          <Button
            mode="strong"
            wide
            disabled={buttonProps.disabled || mainButtonDisabled}
            onClick={buttonProps.action}
            css={`
              ${!compactMode && `width: 215px;`}
              margin-top: ${3 * GU}px;
              box-shadow: 0px ${0.5 * GU}px ${0.75 *
              GU}px rgba(7, 146, 175, 0.08);
            `}
          >
            {buttonProps.text}
          </Button>
          {isExecutable && (
            <Button
              wide
              onClick={openModal}
              css={`
                ${!compactMode && `width: 215px;`}
                margin-top: ${3 * GU}px;
                margin-left: ${1.5 * GU}px;
                box-shadow: 0px 4px 6px rgba(7, 146, 175, 0.08);
                ${compactMode && `margin-left: 0px;`}
              `}
            >
              Change support
            </Button>
          )}
          {isCancellable && (
            <Button
              wide
              onClick={onCancelProposal}
              css={`
                margin-top: ${3 * GU}px;
                margin-left: ${1.5 * GU}px;
                box-shadow: 0px 4px 6px rgba(7, 146, 175, 0.08);
                ${!compactMode && `width: 215px;`}
                ${compactMode && `margin-left: 0px;`}
              `}
            >
              Withdraw proposal
            </Button>
          )}
        </div>
        {mode === 'support' && !isSupportable && (
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
