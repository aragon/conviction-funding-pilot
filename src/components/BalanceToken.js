import React from 'react'
import styled from 'styled-components'
import TokenAmount from 'token-amount'
import { useTheme, GU } from '@aragon/ui'

import { useTokenBalanceToUsd } from '../lib/web3-utils'
import logoAnt from '../assets/logo-ant.svg'

const BalanceToken = ({ amount, symbol, color, size }) => {
  const theme = useTheme()
  const antBalance = useTokenBalanceToUsd(symbol, 18, amount)

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
      {TokenAmount.format(amount, 18)}
      &nbsp;
      <span
        css={`
          color: ${theme.contentSecondary};
        `}
      >
        {` ${'ANT'}` || ''}
      </span>
      <div
        css={`
          margin-left: ${1 * GU}px;
          color: ${theme.contentSecondary};
        `}
      >
        (${' '}
        {antBalance === '-' ? '' : TokenAmount.format(antBalance.toFixed(0), 2)}
        )
      </div>
    </div>
  )
}

const TokenIcon = styled.img.attrs({ alt: '', width: '20', height: '20' })`
  margin-right: ${1 * GU}px;
`

export default BalanceToken
