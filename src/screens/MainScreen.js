import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Split } from '@aragon/ui'

import Metrics from '../components/Metrics'
import Proposals from './Proposals'
import ProposalDetail from './ProposalDetail'
import { useAppState } from '../providers/AppState'
import useFilterProposals from '../hooks/useFilterProposals'

const MainScreen = React.memo(
  ({
    isLoading,
    myStakes,
    onCancelProposal,
    onExecuteIssuance,
    onExecuteProposal,
    onRequestNewProposal,
    onStakeToProposal,
    onWithdrawFromProposal,
    proposals,
    selectedProposal,
    totalActiveTokens,
  }) => {
    const {
      requestToken,
      stakeToken,
      totalSupply,
      vaultBalance,
    } = useAppState()

    const {
      filteredProposals,
      proposalExecutionStatusFilter,
      proposalSupportStatusFilter,
      proposalTextFilter,
      proposalTypeFilter,
      handleProposalSupportFilterChange,
      handleProposalExecutionFilterChange,
      handleSearchTextFilterChange,
      handleProposalTypeFilterChange,
    } = useFilterProposals(proposals, myStakes)

    const history = useHistory()
    const handleBack = useCallback(() => {
      history.push(`/`)
    }, [history])
    const handleTabChange = tabIndex => {
      handleProposalExecutionFilterChange(tabIndex)
      handleProposalSupportFilterChange(0)
    }

    if (isLoading) {
      return null
    }

    return (
      <>
        {selectedProposal ? (
          <Split
            primary={
              <ProposalDetail
                myStakes={myStakes}
                onBack={handleBack}
                onCancelProposal={onCancelProposal}
                onExecuteProposal={onExecuteProposal}
                onStakeToProposal={onStakeToProposal}
                onWithdrawFromProposal={onWithdrawFromProposal}
                proposal={selectedProposal}
                requestToken={requestToken}
              />
            }
            secondary={
              <Metrics
                totalSupply={totalSupply}
                commonPool={vaultBalance}
                myStakes={myStakes}
                onExecuteIssuance={onExecuteIssuance}
                amountOfProposals={proposals.length}
                stakeToken={stakeToken}
                requestToken={requestToken}
                totalActiveTokens={totalActiveTokens}
              />
            }
            invert="horizontal"
          />
        ) : (
          <Split
            primary={
              <Proposals
                filteredProposals={filteredProposals}
                proposalExecutionStatusFilter={proposalExecutionStatusFilter}
                proposalSupportStatusFilter={proposalSupportStatusFilter}
                proposalTextFilter={proposalTextFilter}
                proposalTypeFilter={proposalTypeFilter}
                handleProposalSupportFilterChange={
                  handleProposalSupportFilterChange
                }
                handleExecutionStatusFilterChange={handleTabChange}
                handleSearchTextFilterChange={handleSearchTextFilterChange}
                handleProposalTypeFilterChange={handleProposalTypeFilterChange}
                requestToken={requestToken}
                onRequestNewProposal={onRequestNewProposal}
              />
            }
            secondary={
              <Metrics
                commonPool={vaultBalance}
                myStakes={myStakes}
                onExecuteIssuance={onExecuteIssuance}
                amountOfProposals={proposals.length}
                requestToken={requestToken}
                stakeToken={stakeToken}
                totalActiveTokens={totalActiveTokens}
                totalSupply={totalSupply}
              />
            }
            invert="horizontal"
          />
        )}
      </>
    )
  }
)

export default MainScreen
