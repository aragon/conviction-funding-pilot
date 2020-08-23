import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformConfigData,
  transformProposalData,
  transformStakeHistoryData,
} from '../lib/data-utils'

export function useConfigSubscription(convictionVoting) {
  const [config, setConfig] = useState([])

  const configSubscription = useRef(null)

  const onConfigHandler = useCallback((configs = []) => {
    const transformedConfigs = transformConfigData(configs[1])
    setConfig(transformedConfigs)
  }, [])

  useEffect(() => {
    if (!convictionVoting) {
      return
    }

    configSubscription.current = convictionVoting.onConfig(onConfigHandler)

    return () => configSubscription.current.unsubscribe()
  }, [convictionVoting, onConfigHandler])

  return config
}

export function useProposalsSubscription(convictionVoting) {
  const [proposals, setProposals] = useState([])

  const proposalsSubscription = useRef(null)

  const onProposalsHandler = useCallback((proposals = []) => {
    const transformedProposals = proposals.map(transformProposalData)
    setProposals(transformedProposals)
  }, [])

  useEffect(() => {
    if (!convictionVoting) {
      return
    }

    proposalsSubscription.current = convictionVoting.onProposals(
      {},
      onProposalsHandler
    )

    return () => proposalsSubscription.current.unsubscribe()
  }, [convictionVoting, onProposalsHandler])

  return proposals
}

export function useStakesHistorySubscription(convictionVoting) {
  const [stakes, setStakes] = useState([])

  const stakesSubscription = useRef(null)

  const onStakesHandler = useCallback((stakes = []) => {
    const transformedStakes = stakes
      .map(transformStakeHistoryData)
      .sort((s1, s2) => s1.time - s2.time) // TODO: Remove when subgraph query updated
    setStakes(transformedStakes)
  }, [])

  useEffect(() => {
    if (!convictionVoting) {
      return
    }

    stakesSubscription.current = convictionVoting.onStakesHistory(
      {},
      onStakesHandler
    )

    return () => {
      stakesSubscription.current.unsubscribe()
    }
  }, [convictionVoting, onStakesHandler])

  return stakes
}
