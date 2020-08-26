import React, { useEffect, useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import TokenAmount from 'token-amount'
import { useViewport } from 'use-viewport'
import {
  Button,
  Modal,
  Info,
  Slider,
  textStyle,
  useTheme,
  GU,
} from '@aragon/ui'
import antLogo from '../assets/logo-ant.svg'

function ChangeSupportModal({
  accountBalance,
  availableTokens,
  currentStakedTokens = new BigNumber('0'),
  modalVisible,
  onModalClose,
  onStakeToProposal,
  onWithdrawFromProposal,
  proposalId,
  totalActiveTokens,
}) {
  const [percentage, setPercentage] = useState(0)
  const [tokensToStake, setTokensToStake] = useState(currentStakedTokens)
  const [movedSlider, setMovedSlider] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('medium')

  useEffect(() => setMovedSlider(true), [percentage])

  useEffect(() => {
    if (
      percentage === 0 &&
      currentStakedTokens.toFixed(0) !== '0' &&
      !accountBalance.eq('-1') &&
      !movedSlider
    ) {
      if (accountBalance.eq('0')) {
        return
      }
      const newPercentage =
        Number(
          currentStakedTokens
            .div(accountBalance)
            .times(new BigNumber('100'))
            .toFixed(0)
        ) / 100
      setPercentage(newPercentage)
      setTokensToStake(currentStakedTokens)
    }
  }, [
    accountBalance,
    availableTokens,
    currentStakedTokens,
    movedSlider,
    percentage,
    setMovedSlider,
    tokensToStake,
  ])

  const fixedPercentage = useMemo(
    () => Math.ceil(percentage.toFixed(2) * 100).toString(),
    [percentage]
  )

  const totalAvailableTokens = useMemo(
    () => availableTokens.plus(currentStakedTokens),
    [availableTokens, currentStakedTokens]
  )

  const amountInOtherProposals = useMemo(
    () => totalActiveTokens.minus(currentStakedTokens),
    [currentStakedTokens, totalActiveTokens]
  )

  const percentageAvailable = useMemo(
    () =>
      totalAvailableTokens
        .div(accountBalance)
        .times(new BigNumber('100'))
        .toFixed(0),
    [accountBalance, totalAvailableTokens]
  )

  const percentageStaked = useMemo(
    () =>
      totalActiveTokens
        .minus(currentStakedTokens)
        .div(accountBalance)
        .times(new BigNumber('100'))
        .toFixed(0),
    [accountBalance, currentStakedTokens, totalActiveTokens]
  )

  const disabled = useMemo(
    () =>
      totalAvailableTokens.isLessThan(tokensToStake.toFixed(0)) ||
      currentStakedTokens.isEqualTo(tokensToStake.toFixed(0)),
    [currentStakedTokens, tokensToStake, totalAvailableTokens]
  )

  useEffect(() => {
    const amountToStake = accountBalance
      .times(new BigNumber(fixedPercentage))
      .div(new BigNumber('100'))
    setTokensToStake(amountToStake)
  }, [accountBalance, availableTokens, fixedPercentage])

  const toggleDisabled = useCallback(
    () => setButtonDisabled(disabled => !disabled),
    [setButtonDisabled]
  )

  const onDone = useCallback(() => {
    toggleDisabled()
    onModalClose()
  }, [onModalClose, toggleDisabled])

  const handleChangeSupport = useCallback(() => {
    toggleDisabled()
    if (tokensToStake.lt(currentStakedTokens)) {
      onWithdrawFromProposal(
        proposalId,
        currentStakedTokens.minus(tokensToStake).toFixed(0),
        onDone
      )
      return
    }

    onStakeToProposal(
      proposalId,
      tokensToStake.minus(currentStakedTokens).toFixed(0),
      onDone
    )
  }, [
    currentStakedTokens,
    onDone,
    onStakeToProposal,
    onWithdrawFromProposal,
    proposalId,
    toggleDisabled,
    tokensToStake,
  ])

  return (
    <Modal visible={modalVisible} onClose={onModalClose}>
      <div
        css={`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')};
          `}
        >
          Support proposal
        </h2>
        <p
          css={`
            margin-top: ${3 * GU}px;
            ${textStyle('body2')}
          `}
        >
          This action will lock your tokens with this proposal. The token weight
          backing the proposal will increase over time from 0 up to the max
          amount specified.
        </p>
        <h2
          css={`
            margin-top: ${4 * GU}px;
            color: ${theme.contentSecondary};
            ${textStyle('label2')}
          `}
        >
          Amount of tokens for this proposal
        </h2>
        <div
          css={`
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: ${2 * GU}px;
            ${compactMode &&
              `
                flex-direction: column;
                justify-content: center;
              `}
          `}
        >
          <AntToken />
          <div
            css={`
              flex-grow: 1;
            `}
          />
          <Slider value={percentage} onUpdate={setPercentage} />
          <div
            css={`
              flex-grow: 1;
            `}
          />
          <div
            css={`
              width: ${20 * GU}px;
              display: flex;
            `}
          >
            <p
              css={`
              ${textStyle('body2')}
              margin-left: ${1 * GU}px;
          `}
            >
              {fixedPercentage}%
            </p>
            <p
              css={`
              ${textStyle('body2')}
              color: ${theme.contentSecondary};
              margin-left: ${1 * GU}px;
          `}
            >
              (
              {TokenAmount.format(tokensToStake.toFixed(0), 18, {
                symbol: 'ANT',
              })}
              )
            </p>
          </div>
        </div>
        <Info
          css={`
            margin-top: ${4 * GU}px;
          `}
        >
          You have{' '}
          {TokenAmount.format(totalAvailableTokens.toFixed(0), 18, {
            symbol: 'ANT',
          })}{' '}
          tokens ({percentageAvailable}% of your balance) available to support
          this proposal. You are supporting other proposals with{' '}
          {TokenAmount.format(amountInOtherProposals.toFixed(0), 18, {
            symbol: 'ANT',
          })}{' '}
          locked tokens ({percentageStaked}% of your balance).
        </Info>

        <Button
          disabled={disabled || buttonDisabled}
          mode="strong"
          wide
          css={`
            margin-top: ${3 * GU}px;
          `}
          onClick={handleChangeSupport}
        >
          Support Proposal
        </Button>
      </div>
    </Modal>
  )
}

function AntToken() {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <img
        src={antLogo}
        width="32px"
        css={`
          margin-bottom: ${1.25 * GU}px;
        `}
      />
      <p
        css={`
          ${textStyle('body2')}
          margin-left: ${1 * GU}px;
        `}
      >
        ANT
      </p>
    </div>
  )
}

export default ChangeSupportModal
