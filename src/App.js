import React from 'react'
import { SidePanel, SyncIndicator } from '@aragon/ui'

import AddProposalPanel from './components/AddProposalPanel'
import MainScreen from './screens/MainScreen'

import useAppLogic from './app-logic'
import useSelectedProposal from './hooks/useSelectedProposal'

const App = React.memo(function App() {
  const {
    actions,
    isLoading,
    myStakes,
    proposals,
    proposalPanel,
    totalActiveTokens,
  } = useAppLogic()

  const selectedProposal = useSelectedProposal(proposals)

  return (
    <div>
      <SyncIndicator visible={isLoading} />
      <MainScreen
        isLoading={isLoading}
        myStakes={myStakes}
        onCancelProposal={actions.cancelProposal}
        onExecuteIssuance={actions.executeIssuance}
        onExecuteProposal={actions.executeProposal}
        onRequestNewProposal={proposalPanel.requestOpen}
        onStakeToProposal={actions.stakeToProposal}
        onWithdrawFromProposal={actions.withdrawFromProposal}
        proposals={proposals}
        selectedProposal={selectedProposal}
        totalActiveTokens={totalActiveTokens}
      />
      <SidePanel
        title="New proposal"
        opened={proposalPanel.visible}
        onClose={proposalPanel.requestClose}
      >
        <AddProposalPanel onSubmit={actions.newProposal} />
      </SidePanel>
    </div>
  )
})

export default App
