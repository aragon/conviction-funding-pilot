import { ZERO_ADDR } from './constants'

export const PROPOSAL_STATUS_OPEN = 1
export const PROPOSAL_STATUS_EXECUTED = 2
export const PROPOSAL_STATUS_CANCELLED = 3

export const PROPOSAL_STATUS_SUPPORTED = 1
export const PROPOSAL_STATUS_NOT_SUPPORTED = 2

export const PROPOSAL_TYPE_FUNDING = 1
export const PROPOSAL_TYPE_SIGNALING = 2

export function getProposalSupportStatus(stakes, proposal) {
  if (stakes.find(stake => stake.proposalId === proposal.id)) {
    return PROPOSAL_STATUS_SUPPORTED
  }

  return PROPOSAL_STATUS_NOT_SUPPORTED
}

export function getProposalExecutionStatus({ status }) {
  const proposalStatus = status.toLowerCase()

  if (proposalStatus === 'executed') {
    return PROPOSAL_STATUS_EXECUTED
  }

  if (proposalStatus === 'cancelled') {
    return PROPOSAL_STATUS_CANCELLED
  }

  return PROPOSAL_STATUS_OPEN
}

export function getProposalType({ beneficiary, name }) {
  if (beneficiary === ZERO_ADDR) {
    return PROPOSAL_TYPE_SIGNALING
  }
  return PROPOSAL_TYPE_FUNDING
}
