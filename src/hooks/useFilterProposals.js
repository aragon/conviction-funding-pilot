import { useCallback, useMemo, useState } from 'react'

import {
  getProposalExecutionStatus,
  getProposalSupportStatus,
  getProposalType,
  PROPOSAL_STATUS_SUPPORTED,
  PROPOSAL_STATUS_NOT_SUPPORTED,
  PROPOSAL_STATUS_OPEN,
  PROPOSAL_STATUS_EXECUTED,
  PROPOSAL_TYPE_FUNDING,
  PROPOSAL_TYPE_SIGNALING,
  PROPOSAL_STATUS_CANCELLED,
} from '../proposal-types'
import { checkInitialLetters } from '../lib/search-utils'

const NULL_FILTER_STATE = 0
const STAKE_STATUS_FILTER_SUPPORTED = 1
const STAKE_STATUS_FILTER_NOT_SUPPORTED = 2
const EXECUTION_STATUS_FILTER_OPEN = 1
const EXECUTION_STATUS_FILTER_CLOSED = 2
const TYPE_FILTER_FUNDING = 1
const TYPE_FILTER_SIGNALING = 2

function testSupportFilter(filter, proposalStatus) {
  return (
    filter === NULL_FILTER_STATE ||
    (filter === STAKE_STATUS_FILTER_SUPPORTED &&
      proposalStatus === PROPOSAL_STATUS_SUPPORTED) ||
    (filter === STAKE_STATUS_FILTER_NOT_SUPPORTED &&
      proposalStatus === PROPOSAL_STATUS_NOT_SUPPORTED)
  )
}

function testExecutionFilter(filter, proposalStatus) {
  return (
    filter === NULL_FILTER_STATE ||
    (filter === EXECUTION_STATUS_FILTER_OPEN &&
      proposalStatus === PROPOSAL_STATUS_OPEN) ||
    (filter === EXECUTION_STATUS_FILTER_CLOSED &&
      proposalStatus === PROPOSAL_STATUS_EXECUTED) ||
    (filter === EXECUTION_STATUS_FILTER_CLOSED &&
      proposalStatus === PROPOSAL_STATUS_CANCELLED)
  )
}

function testTypeFilter(filter, proposalStatus) {
  return (
    filter === NULL_FILTER_STATE ||
    (filter === TYPE_FILTER_FUNDING &&
      proposalStatus === PROPOSAL_TYPE_FUNDING) ||
    (filter === TYPE_FILTER_SIGNALING &&
      proposalStatus === PROPOSAL_TYPE_SIGNALING)
  )
}

function testSearchFilter(proposalName, textSearch) {
  return (
    proposalName.toUpperCase().includes(textSearch.toUpperCase()) ||
    checkInitialLetters(proposalName, textSearch)
  )
}

const useFilterProposals = (proposals, myStakes) => {
  const [supportFilter, setSupportFilter] = useState(NULL_FILTER_STATE)
  const [executionFilter, setExecutionFilter] = useState(NULL_FILTER_STATE)
  const [typeFilter, setTypeFilter] = useState(NULL_FILTER_STATE)
  const [textSearch, setTextSearch] = useState('')

  const filteredProposals = useMemo(
    () =>
      proposals.filter(proposal => {
        const proposalExecutionStatus = getProposalExecutionStatus(proposal)
        const proposalSupportStatus = getProposalSupportStatus(
          myStakes,
          proposal
        )
        const proposalTypeStatus = getProposalType(proposal)

        return (
          testExecutionFilter(executionFilter, proposalExecutionStatus) &&
          testTypeFilter(typeFilter, proposalTypeStatus) &&
          testSupportFilter(supportFilter, proposalSupportStatus) &&
          testSearchFilter(proposal.name, textSearch)
        )
      }),
    [
      executionFilter,
      myStakes,
      proposals,
      supportFilter,
      textSearch,
      typeFilter,
    ]
  )

  return {
    filteredProposals,
    proposalExecutionStatusFilter: executionFilter,
    proposalSupportStatusFilter: supportFilter,
    proposalTypeFilter: typeFilter,
    proposalTextFilter: textSearch,
    handleProposalExecutionFilterChange: useCallback(
      index => setExecutionFilter(index),
      [setExecutionFilter]
    ),
    handleProposalSupportFilterChange: useCallback(
      index => setSupportFilter(index),
      [setSupportFilter]
    ),
    handleSearchTextFilterChange: useCallback(
      textSearch => {
        setTextSearch(textSearch)
      },
      [setTextSearch]
    ),
    handleProposalTypeFilterChange: useCallback(index => setTypeFilter(index), [
      setTypeFilter,
    ]),
  }
}

export default useFilterProposals
