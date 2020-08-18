import React, { useCallback, useMemo } from 'react'
import { useLayout } from '@aragon/ui'

import FilterBar from '../components/FilterBar/FilterBar'
import ProposalsView from '../components/ProposalsView'

const Proposals = React.memo(
  ({
    filteredProposals,
    proposalExecutionStatusFilter,
    proposalSupportStatusFilter,
    proposalTextFilter,
    proposalTypeFilter,
    handleProposalSupportFilterChange,
    handleExecutionStatusFilterChange,
    handleSearchTextFilterChange,
    handleProposalTypeFilterChange,
    requestToken,
    onRequestNewProposal,
  }) => {
    const { layoutName } = useLayout()
    const compactMode = layoutName === 'small'

    const sortedProposals = useMemo(
      () =>
        filteredProposals.sort(
          (a, b) => b.currentConviction - a.currentConviction
        ),
      [filteredProposals]
    )

    const updateTextFilter = useCallback(
      textValue => {
        handleSearchTextFilterChange(textValue)
      },
      [handleSearchTextFilterChange]
    )

    return (
      <div>
        {!compactMode && (
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <FilterBar
              proposalsSize={filteredProposals.length}
              proposalExecutionStatusFilter={proposalExecutionStatusFilter}
              proposalStatusFilter={proposalSupportStatusFilter}
              proposalTextFilter={proposalTextFilter}
              proposalTypeFilter={proposalTypeFilter}
              handleExecutionStatusFilterChange={
                handleExecutionStatusFilterChange
              }
              handleProposalStatusFilterChange={
                handleProposalSupportFilterChange
              }
              handleRequestNewProposal={onRequestNewProposal}
              handleTextFilterChange={updateTextFilter}
              handleProposalTypeFilterChange={handleProposalTypeFilterChange}
            />
          </div>
        )}

        <ProposalsView
          proposals={sortedProposals}
          requestToken={requestToken}
        />
      </div>
    )
  }
)

export default Proposals
