import React, { useState, useRef, useCallback, useMemo } from 'react'
import { useViewport } from 'use-viewport'
import { Button, DropDown, useTheme, IconAdd, GU } from '@aragon/ui'
import PropTypes from 'prop-types'

import TextFilter from './TextFilter'
import DropdownFilter from './DropdownFilter'
import { useWallet } from '../../providers/Wallet'

const PROPOSAL_TYPE_LABELS = ['All', 'Funding', 'Signaling']

const PROPOSAL_STATUS_LABELS = ['All', 'Open', 'Closed']

const FilterBar = React.memo(
  ({
    handleExecutionStatusFilterChange,
    handleProposalStatusFilterChange,
    handleProposalTypeFilterChange,
    handleRequestNewProposal,
    handleTextFilterChange,
    proposalExecutionStatusFilter,
    proposalsSize = 0,
    proposalStatusFilter,
    proposalTextFilter,
    proposalTypeFilter,
  }) => {
    const [textFieldVisible, setTextFieldVisible] = useState(false)
    const textFilterOpener = useRef(null)
    const { status } = useWallet()
    const theme = useTheme()
    const { below } = useViewport()

    const tabletMode = below(1400)
    const compactMode = below(900)

    const buttonDisplay = useMemo(() => {
      if (!compactMode && tabletMode) {
        return 'icon'
      }

      return 'label'
    }, [tabletMode, compactMode])

    const handlerTextFilterClick = useCallback(() => {
      setTextFieldVisible(true)
    }, [setTextFieldVisible])

    const statusFilterDisabled =
      proposalExecutionStatusFilter === 2 || status !== 'connected'

    if (compactMode && status !== 'connected') {
      return (
        <div
          css={`
            margin-top: ${4 * GU}px;
            margin-bottom: ${3 * GU}px;
          `}
        />
      )
    }

    return (
      <div
        css={`
          margin-top: ${4 * GU}px;
          width: 100%;
          margin-bottom: ${3 * GU}px;
        `}
      >
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
          {!compactMode && (
            <div
              css={`
                width: 100%;
                display: flex;
              `}
            >
              <DropDown
                header="Type"
                selected={proposalTypeFilter}
                onChange={handleProposalTypeFilterChange}
                items={PROPOSAL_TYPE_LABELS}
              />
              <DropDown
                header="Status"
                selected={proposalExecutionStatusFilter}
                onChange={handleExecutionStatusFilterChange}
                items={PROPOSAL_STATUS_LABELS}
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
              <div
                css={`
                  flex-grow: 1;
                `}
              />
              <TextFilter
                textFilter={proposalTextFilter}
                updateTextFilter={handleTextFilterChange}
                placeholder="Search"
                visible={textFieldVisible}
                setVisible={setTextFieldVisible}
                openerRef={textFilterOpener}
                onClick={handlerTextFilterClick}
              />
            </div>
          )}
          {status === 'connected' && (
            <Button
              mode="strong"
              wide={compactMode}
              onClick={handleRequestNewProposal}
              label="Create new proposal"
              display={buttonDisplay}
              icon={<IconAdd />}
              css={`
                ${!compactMode &&
                  `
                justify-self: flex-end;
                margin-left: ${1 * GU}px;`}
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
