import React, { useCallback, useMemo } from 'react'
import { useViewport } from 'use-viewport'
import {
  BackButton,
  Bar,
  Box,
  GU,
  IconCheck,
  IconCross,
  Link,
  SidePanel,
  textStyle,
  useTheme,
} from '@aragon/ui'
import Balance from '../components/Balance'
import { ConvictionBar } from '../components/ConvictionVisuals'
import IdentityBadge from '../components/IdentityBadge'
import ProposalActions from '../components/ProposalActions'
import SupportProposal from '../components/panels/SupportProposal'

import { useAppState } from '../providers/AppState'
import usePanelState from '../hooks/usePanelState'
import { useWallet } from '../providers/Wallet'

import { getTokenIconBySymbol, formatTokenAmount } from '../lib/token-utils'
import {
  addressesEqualNoSum as addressesEqual,
  soliditySha3,
} from '../lib/web3-utils'
import { ZERO_ADDR } from '../constants'

const CANCEL_ROLE_HASH = soliditySha3('CANCEL_PROPOSAL_ROLE')

const UNABLE_TO_PASS = 0
const MAY_PASS = 1
const AVAILABLE = 2
const EXECUTED = 3

function getOutcomeText(proposalState) {
  if (proposalState === UNABLE_TO_PASS) {
    return "Won't pass"
  }

  if (proposalState === MAY_PASS) {
    return 'Will pass'
  }

  if (proposalState === AVAILABLE) {
    return 'Available for execution'
  }

  if (proposalState === EXECUTED) {
    return 'Executed'
  }
}

function ProposalDetail({
  myStakes,
  proposal,
  onBack,
  onCancelProposal,
  onExecuteProposal,
  onStakeToProposal,
  onWithdrawFromProposal,
  requestToken,
}) {
  const theme = useTheme()
  const panelState = usePanelState()
  const { vaultBalance, permissions } = useAppState()
  const { account: connectedAccount } = useWallet()
  const { below } = useViewport()

  console.log('request', requestToken)

  const compactMode = below('medium')
  const {
    currentConviction,
    id,
    name,
    neededConviction,
    creator,
    beneficiary,
    link,
    remainingTimeToPass,
    requestedAmount,
    threshold,
    executed,
  } = proposal

  const handleCancelProposal = useCallback(() => {
    onCancelProposal(id)
  }, [id, onCancelProposal])

  const hasCancelRole = useMemo(() => {
    if (!connectedAccount) {
      return false
    }

    if (addressesEqual(creator, connectedAccount)) {
      return true
    }

    return permissions.find(
      ({ roleHash, granteeAddress }) =>
        roleHash === CANCEL_ROLE_HASH &&
        addressesEqual(granteeAddress, connectedAccount)
    )
  }, [connectedAccount, creator, permissions])

  console.log(handleCancelProposal, hasCancelRole)

  const proposalState = useMemo(() => {
    if (executed) {
      return EXECUTED
    }
    if (
      !neededConviction.toString().includes('Infinity') &&
      currentConviction.gte(threshold)
    ) {
      return AVAILABLE
    }
    if (remainingTimeToPass > 0) {
      return MAY_PASS
    }
    return UNABLE_TO_PASS
  }, [
    currentConviction,
    executed,
    neededConviction,
    threshold,
    remainingTimeToPass,
  ])

  const outcomeText = getOutcomeText(proposalState)

  const signalingProposal = addressesEqual(beneficiary, ZERO_ADDR)

  return (
    <div>
      <Bar
        css={`
          margin-top: ${4 * GU}px;
        `}
      >
        <BackButton onClick={onBack} />
      </Bar>
      <Box>
        <section
          css={`
            display: flex;
            flex-direction: column;
          `}
        >
          <div
            css={`
              display: flex;
              ${compactMode &&
                `
                  flex-direction: column-reverse;
                `}
            `}
          >
            <h1
              css={`
                ${textStyle('title2')};
              `}
            >
              {name}
            </h1>
            <div css="flex-grow: 1;" />
            <Outcome
              result={outcomeText}
              positive={proposalState !== UNABLE_TO_PASS}
            />
          </div>
          <p
            css={`
                  margin-top: ${1 * GU}px;
                  ${textStyle('body2')}
                  color: ${theme.contentSecondary};
                `}
          >
            This proposal is requesting{' '}
            {formatTokenAmount(requestedAmount, requestToken.decimals)} ANT out
            of {formatTokenAmount(vaultBalance, requestToken.decimals)} ANT
            currently in the common pool.
          </p>
          <div
            css={`
              margin-top: ${4 * GU}px;
              margin-bottom: ${4 * GU}px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              ${compactMode &&
                `
                  flex-direction: column;
              `}
            `}
          >
            {requestToken && (
              <Amount
                requestedAmount={requestedAmount}
                requestToken={requestToken}
              />
            )}
            <DataField
              label="Submitted By"
              value={
                <IdentityBadge
                  connectedAccount={addressesEqual(creator, connectedAccount)}
                  entity={creator}
                />
              }
            />
            {requestToken && !signalingProposal && (
              <DataField
                label="Beneficiary"
                value={
                  <IdentityBadge
                    connectedAccount={addressesEqual(
                      beneficiary,
                      connectedAccount
                    )}
                    entity={beneficiary}
                  />
                }
              />
            )}
            <DataField
              label="Link"
              value={
                link ? (
                  <Link href={link} external>
                    Read more
                  </Link>
                ) : (
                  <span
                    css={`
                      ${textStyle('body2')};
                    `}
                  >
                    No link provided
                  </span>
                )
              }
            />
          </div>
          {!executed && (
            <>
              <DataField
                label="Conviction Progress"
                value={
                  <ConvictionBar
                    proposal={proposal}
                    withThreshold={!!requestToken}
                    hideSeparator={proposal.beneficiary === ZERO_ADDR}
                  />
                }
              />
              <ProposalActions
                hasCancelRole={hasCancelRole}
                myStakes={myStakes}
                proposal={proposal}
                onCancelProposal={handleCancelProposal}
                onExecuteProposal={onExecuteProposal}
                onRequestSupportProposal={panelState.requestOpen}
                onStakeToProposal={onStakeToProposal}
                onWithdrawFromProposal={onWithdrawFromProposal}
              />
            </>
          )}
        </section>
      </Box>
      <SidePanel
        title="Support this proposal"
        opened={panelState.visible}
        onClose={panelState.requestClose}
      >
        <SupportProposal
          id={id}
          onDone={panelState.requestClose}
          onStakeToProposal={onStakeToProposal}
        />
      </SidePanel>
    </div>
  )
}

export const Amount = ({
  requestedAmount = 0,
  requestToken: { symbol, decimals, verified },
}) => {
  const tokenIcon = getTokenIconBySymbol(symbol)

  return (
    <DataField
      label="Amount Requested"
      value={
        <Balance
          amount={requestedAmount}
          decimals={decimals}
          symbol={symbol}
          verified={verified}
          icon={tokenIcon}
        />
      }
    />
  )
}

function DataField({ label, value }) {
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('medium')

  return (
    <div
      css={`
        ${compactMode && `margin-top:${2 * GU}px;`}
      `}
    >
      <h2
        css={`
          ${textStyle('label2')};
          font-weight: 200;
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>

      <div
        css={`
          ${textStyle('body2')};
        `}
      >
        {value}
      </div>
    </div>
  )
}

const Outcome = ({ result, positive }) => {
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('medium')

  return (
    <div
      css={`
        color: ${theme[positive ? 'positive' : 'negative']};
        display: flex;
        align-items: center;
        justify-content: center;
        ${compactMode &&
          `
            justify-content: flex-start;
            margin-bottom: 8px;
        `}
        text-transform: uppercase;
        font-size: 14px;
      `}
    >
      {positive ? <IconCheck /> : <IconCross />}{' '}
      <span
        css={`
          display: inline-block;
          margin-top: ${0.5 * GU}px;
        `}
      >
        {result}
      </span>
    </div>
  )
}

export default ProposalDetail
