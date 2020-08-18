import React from 'react'
import BalanceToken from './BalanceToken'

function Balance(props) {
  const { amount = 0, symbol, icon, verified, color, size } = props

  return (
    <section>
      <BalanceToken
        amount={amount}
        symbol={symbol}
        verified={verified}
        color={color}
        size={size}
        icon={icon}
      />
    </section>
  )
}

export default Balance
