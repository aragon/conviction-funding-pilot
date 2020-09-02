import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as Sentry from '@sentry/browser'

const RETRY_EVERY = 3000

const UNISWAP_URL = 'https://api.thegraph.com/subgraphs/name/lutter/uniswap-v2'
const ANT_ETH_PAIR = '0xfa19de406e8f5b9100e4dd5cad8a503a6d686efe'
const DAI_ETH_PAIR = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'

const ANT_PRICE_QUERY = gql`
  query {
    pair(id: "${ANT_ETH_PAIR}") {
      token1Price
    }
  }
`
const ETH_PRICE_QUERY = gql`
  query {
    pair(id: "${DAI_ETH_PAIR}") {
      token0Price
    }
  }
`

export function useUniswapAntPrice() {
  const [antPrice, setAntPrice] = useState('0')
  const wrapper = new GraphQLWrapper(UNISWAP_URL)

  useEffect(() => {
    let cancelled = false
    let retryTimer
    async function getData() {
      try {
        const antResults = await wrapper.performQuery(ANT_PRICE_QUERY)
        const ethResults = await wrapper.performQuery(ETH_PRICE_QUERY)
        const { pair: antPair } = antResults.data
        const { pair: ethPair } = ethResults.data
        const antToEthPrice = antPair.token1Price
        const daiToEthPrice = ethPair.token0Price
        const antPrice = Number(antToEthPrice) * Number(daiToEthPrice)

        if (!cancelled) {
          setAntPrice(antPrice)
        }
      } catch (err) {
        console.log(err)
        retryTimer = setTimeout(getData, RETRY_EVERY)
        if (process.env.NODE_ENV === 'production') {
          Sentry.captureException(err)
        }
      }
    }

    getData()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [wrapper])

  return antPrice
}
