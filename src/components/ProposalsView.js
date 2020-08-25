import React, { useState, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useViewport } from 'use-viewport'
import {
  ButtonBase,
  Pagination,
  IconCheck,
  IconWarning,
  IconVote,
  textStyle,
  useTheme,
  GU,
  RADIUS,
} from '@aragon/ui'
import { ConvictionBar } from './ConvictionVisuals'
import IdentityBadge from './IdentityBadge'
import { Amount } from '../screens/ProposalDetail'
import { ZERO_ADDR } from '../constants'

const PROPOSALS_PER_PAGE = 5

function ProposalsView({ proposals }) {
  const [page, setPage] = useState(0)
  const theme = useTheme()
  const history = useHistory()
  const { below } = useViewport()

  const compactMode = below('large')

  const handleSelectProposal = useCallback(
    id => {
      history.push(`/proposal/${id}`)
    },
    [history]
  )

  const pages = useMemo(
    () => Math.ceil(proposals.length / PROPOSALS_PER_PAGE),
    [proposals]
  )

  const displayFrom = page * PROPOSALS_PER_PAGE
  const displayTo = displayFrom + PROPOSALS_PER_PAGE

  const shownProposals = useMemo(
    () => proposals.slice(displayFrom, displayTo),
    [displayFrom, displayTo, proposals]
  )

  return (
    <div
      css={`
        width: 100%;
      `}
    >
      {shownProposals.map(proposal => (
        <ProposalCard
          key={proposal.id}
          background={theme.surface}
          onClick={() => handleSelectProposal(proposal.id)}
          focusRingRadius={RADIUS}
          css={`
            text-align: left;
            word-wrap: break-word;
            text-overflow: ellipsis;
          `}
        >
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
            <ProposalProperty
              title="Proposal Title"
              css={`
                margin-top: ${2 * GU}px;
              `}
            >
              <ProposalTitleLink
                handleSelectProposal={handleSelectProposal}
                title={proposal.name}
                id={proposal.id}
              />
            </ProposalProperty>
            <div css="flex-grow: 0.8;" />
            {proposal.beneficiary === ZERO_ADDR ? (
              <SignalingIndicator />
            ) : (
              <Amount
                requestedAmount={proposal.requestedAmount}
                requestToken={{
                  symbol: 'ANT',
                  decimals: 18,
                  verified: true,
                }}
              />
            )}
            <div
              css={`
                ${!compactMode && `margin-left: ${10 * GU}px;`}
              `}
            >
              {proposal.status.toLowerCase() === 'executed' ? (
                <ExecutedIndicator />
              ) : proposal.status.toLowerCase() !== 'cancelled' ? (
                <ProposalProperty title="Submitted by">
                  <p
                    css={`
                      ${textStyle('body2')}
                    `}
                  >
                    <IdentityBadge entity={proposal.creator} badgeOnly />
                  </p>
                </ProposalProperty>
              ) : (
                <CancelledIndicator />
              )}
            </div>
          </div>
          <h2
            css={`
              ${textStyle('body4')}
              text-transform: uppercase;
              color: ${theme.contentSecondary};
              margin-top: ${4 * GU}px;
              margin-bottom: ${1 * GU}px;
            `}
          >
            Conviction Progress
          </h2>
          <ConvictionBar
            hideSeparator={proposal.beneficiary === ZERO_ADDR}
            proposal={proposal}
            withThreshold={proposal.status !== 'Cancelled'}
          />
        </ProposalCard>
      ))}
      <Pagination pages={pages} selected={page} onChange={setPage} />
    </div>
  )
}

function ProposalTitleLink({ title }) {
  const theme = useTheme()

  return (
    <p
      css={`
        ${textStyle('body2')}
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    >
      {' '}
      <span
        css={`
          color: ${theme.content};
        `}
      >
        {title}
      </span>
    </p>
  )
}

function ProposalProperty({ title, children }) {
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('large')

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        ${compactMode && `margin-top: ${2 * GU}px;`}
      `}
    >
      <h2
        css={`
          ${textStyle('body4')}
          text-transform: uppercase;
          color: ${theme.contentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

const SignalingIndicator = () => {
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('large')

  return (
    <div
      css={`
        margin-top: ${2 * GU}px;
        color: ${theme.infoSurfaceContent};
        display: flex;
        align-items: center;
        justify-content: center;
        ${compactMode &&
          `
            justify-content: flex-start;
            margin-bottom: ${1 * GU}px;
        `}
        text-transform: uppercase;
        font-size: 14px;
      `}
    >
      <IconVote />
      <span
        css={`
          display: inline-block;
          margin-top: ${0.5 * GU}px;
        `}
      >
        Signaling proposal
      </span>
    </div>
  )
}

const CancelledIndicator = () => {
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('large')

  return (
    <div
      css={`
        margin-top: ${2 * GU}px;
        color: ${theme.warningSurfaceContent};
        display: flex;
        align-items: center;
        justify-content: center;
        ${compactMode &&
          `
            justify-content: flex-start;
            margin-bottom: ${1 * GU}px;
        `}
        text-transform: uppercase;
        font-size: 14px;
      `}
    >
      <IconWarning />
      <span
        css={`
          display: inline-block;
          margin-top: ${0.5 * GU}px;
        `}
      >
        Proposal Withdrawn
      </span>
    </div>
  )
}

const ExecutedIndicator = () => {
  const theme = useTheme()
  const { below } = useViewport()

  const compactMode = below('large')

  return (
    <div
      css={`
        margin-top: ${2 * GU}px;
        color: ${theme.positive};
        display: flex;
        align-items: center;
        justify-content: center;
        ${compactMode &&
          `
            justify-content: flex-start;
            margin-bottom: ${1 * GU}px;
        `}
        text-transform: uppercase;
        font-size: 14px;
      `}
    >
      <IconCheck />
      <span
        css={`
          display: inline-block;
          margin-top: ${0.5 * GU}px;
        `}
      >
        Proposal Executed
      </span>
    </div>
  )
}

const ProposalCard = styled(ButtonBase)`
  position: relative;
  width: 100%;
  margin-bottom: ${2 * GU}px;
  border-radius: 4px;
  padding: ${3 * GU}px;
  background: ${props => props.background};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &:active {
    top: 1px;
  }
`

export default ProposalsView
