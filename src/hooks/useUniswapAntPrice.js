import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as Sentry from '@sentry/browser'

const UNISWAP_URL = 'https://api.thegraph.com/subgraphs/name/lutter/uniswap-v2'
const DAI_ANT_PAIR_ID = '0x7286656f87b60e7560ef0a0e53cfa41f450ef993'

const UNISWAP_PAIR_QUERY = gql`
  query {
    pair(id: "${DAI_ANT_PAIR_ID}") {
      token0Price
    }
  }
`

export function useUniswapAntPrice() {
  const [antPrice, setAntPrice] = useState('0')
  const wrapper = new GraphQLWrapper(UNISWAP_URL)

  useEffect(() => {
    let cancelled = false
    async function getData() {
      try {
        const results = await wrapper.performQuery(UNISWAP_PAIR_QUERY)

        const { pair } = results.data
        if (!cancelled) {
          setAntPrice(pair.token0Price)
        }
      } catch (err) {
        Sentry.captureException(err)
      }
    }

    getData()

    return () => (cancelled = true)
  })

  return antPrice
}
