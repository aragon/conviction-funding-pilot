import React, { useState, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Link, Pagination, textStyle, useTheme, GU } from '@aragon/ui'
import { ConvictionBar } from './ConvictionVisuals'
import IdentityBadge from './IdentityBadge'
import { Amount } from '../screens/ProposalDetail'
import { ZERO_ADDR } from '../constants'

const PROPOSALS_PER_PAGE = 5

function ProposalsView({ proposals }) {
  const [page, setPage] = useState(0)
  const theme = useTheme()
  const history = useHistory()

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
        <ProposalCard key={proposal.id} background={theme.surface}>
          <div
            css={`
              width: 100%;
              display: flex;
            `}
          >
            <ProposalProperty title="Proposal Title">
              <ProposalTitleLink
                handleSelectProposal={handleSelectProposal}
                title={proposal.name}
                id={proposal.id}
              />
            </ProposalProperty>
            <div css="flex-grow: 0.8;" />
            <Amount
              requestedAmount={proposal.requestedAmount}
              requestToken={{
                symbol: 'ANT',
                decimals: 18,
                verified: true,
              }}
            />
            <div
              css={`
                margin-left: ${10 * GU}px;
              `}
            >
              <ProposalProperty title="Submitted by">
                <p
                  css={`
                    ${textStyle('body2')}
                  `}
                >
                  <IdentityBadge entity={proposal.creator} />
                </p>
              </ProposalProperty>
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

function ProposalTitleLink({ handleSelectProposal, id, title }) {
  const theme = useTheme()

  const handleClick = useCallback(() => {
    handleSelectProposal(id)
  }, [handleSelectProposal, id])

  return (
    <p
      css={`
        ${textStyle('body2')}
      `}
    >
      {' '}
      <Link
        onClick={handleClick}
        css={`
          color: ${theme.content};
        `}
      >
        {title}
      </Link>
    </p>
  )
}

function ProposalProperty({ title, children }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        width: 200px;
        overflow: visible;
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

const ProposalCard = styled.div`
  width: 100%;
  margin-bottom: ${2 * GU}px;
  border-radius: 4px;
  padding: ${3 * GU}px;
  background: ${props => props.background};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
`

export default ProposalsView
