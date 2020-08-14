import React, { useState, useRef, useCallback } from 'react'
import {
  Button,
  DropDown,
  Tabs,
  useLayout,
  useTheme,
  GU,
  IconPlus,
} from '@aragon/ui'
import PropTypes from 'prop-types'

import TextFilter from './TextFilter'
import DropdownFilter from './DropdownFilter'
import { useWallet } from '../../providers/Wallet'

const PROPOSAL_STATUSES = ['Open', 'Paused', 'Disputed', 'Closed']

const FilterBar = React.memo(
  ({
    proposalsSize = 0,
    proposalExecutionStatusFilter,
    proposalStatusFilter,
    proposalTextFilter,
    proposalTypeFilter,
    handleExecutionStatusFilterChange,
    handleProposalStatusFilterChange,
    handleRequestNewProposal,
    handleTextFilterChange,
    handleProposalTypeFilterChange,
  }) => {
    const [textFieldVisible, setTextFieldVisible] = useState(false)
    const textFilterOpener = useRef(null)
    const { connected } = useWallet()
    const theme = useTheme()
    const { layoutName } = useLayout()
    const compactMode = layoutName === 'small'

    const handlerTextFilterClick = useCallback(() => {
      setTextFieldVisible(true)
    }, [setTextFieldVisible])

    const statusFilterDisabled = proposalExecutionStatusFilter === 1

    return (
      <div
        css={`
          margin-top: 32px;
          width: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <Tabs
          items={PROPOSAL_STATUSES}
          css={`
            width: 100% !important;
            background: red;
            margin: 0;
          `}
          style={{
            width: '100%',
          }}
        />
        <div
          css={`
            width: 100%;
            background: ${theme.surface};
            border: 1px solid ${theme.border};
            border-radius: ${0.5 * GU}px;
            padding: ${1.5 * GU}px ${3 * GU}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              width: 100%;
              display: flex;
            `}
          >
            <DropDown
              header="Type"
              placeholder="Type"
              selected={proposalTypeFilter}
              onChange={handleProposalTypeFilterChange}
              items={['Funding', 'Signaling']}
            />
            <DropDown
              header="Status"
              selected={proposalExecutionStatusFilter}
              onChange={handleExecutionStatusFilterChange}
              items={['Open', 'Closed']}
              css={`
                margin-left: ${1.5 * GU}px;
              `}
            />
            {!statusFilterDisabled && (
              <DropdownFilter
                proposalsSize={proposalsSize}
                proposalStatusFilter={proposalStatusFilter}
                handleProposalStatusFilterChange={
                  handleProposalStatusFilterChange
                }
              />
            )}
            <TextFilter
              textFilter={proposalTextFilter}
              updateTextFilter={handleTextFilterChange}
              placeholder="Search by name"
              visible={textFieldVisible}
              setVisible={setTextFieldVisible}
              openerRef={textFilterOpener}
              onClick={handlerTextFilterClick}
            />
          </div>
          {connected && (
            <Button
              mode="strong"
              onClick={handleRequestNewProposal}
              label="New proposal"
              icon={<IconPlus />}
              display={compactMode ? 'icon' : 'label'}
              css={`
                justify-self: flex-end;
              `}
            />
          )}
        </div>
      </div>
    )
  }
)

FilterBar.propTypes = {
  proposalsSize: PropTypes.number,
  proposalExecutionStatusFilter: PropTypes.number.isRequired,
  proposalStatusFilter: PropTypes.number.isRequired,
  proposalTextFilter: PropTypes.string.isRequired,
  handleExecutionStatusFilterChange: PropTypes.func.isRequired,
  handleProposalStatusFilterChange: PropTypes.func.isRequired,
  handleTextFilterChange: PropTypes.func.isRequired,
}

export default FilterBar
