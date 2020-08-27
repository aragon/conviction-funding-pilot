import React from 'react'
import styled from 'styled-components'
import TokenAmount from 'token-amount'
import { useTheme, GU } from '@aragon/ui'

import { useUniswapAntPrice } from '../hooks/useUniswapAntPrice'
import logoAnt from '../assets/logo-ant.svg'

const ANT_DECIMALS = 18

const BalanceToken = ({ amount, symbol, color, size }) => {
  const theme = useTheme()
  const uniAntPrice = useUniswapAntPrice()

  const valueFormatted = TokenAmount.format(
    amount.toFixed(0),
    ANT_DECIMALS
  ).replace(/,/g, '')

  const antFinalPrice = Number(uniAntPrice) * Number(valueFormatted)

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        color: ${color};
        ${size}
      `}
    >
      <TokenIcon src={logoAnt} />
      {TokenAmount.format(amount.toFixed(0), ANT_DECIMALS)}
      &nbsp;
      <span
        css={`
          color: ${theme.contentSecondary};
        `}
      >
        {` ${symbol}` || ''}
      </span>
      <div
        css={`
          margin-left: ${1 * GU}px;
          color: ${theme.contentSecondary};
        `}
      >
        ($ {antFinalPrice.toLocaleString()})
      </div>
    </div>
  )
}

const TokenIcon = styled.img.attrs({ alt: '', width: '20', height: '20' })`
  margin-right: ${1 * GU}px;
`

export default BalanceToken
