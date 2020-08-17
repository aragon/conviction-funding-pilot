import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import TokenAmount from 'token-amount'
import { getProfile } from '3box'
import {
  Box,
  EthIdenticon,
  GU,
  shortenAddress,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'

import BigNumber, { bigNum } from '../lib/bigNumber'
import { getTokenIconBySymbol } from '../lib/token-utils'
// import { useTokenBalanceToUsd } from '../lib/web3-utils'

function Wallet({ myStakes }) {
  const [profileName, setProfileName] = useState(null)
  const theme = useTheme()
  const { account } = useWallet()
  const { accountBalance, stakeToken } = useAppState()
  // const balanceUsdValue = useTokenBalanceToUsd('ANT', 18, accountBalance)

  useEffect(() => {
    let cancelled = false

    async function getProfileForAccount() {
      if (account) {
        const { name } = await getProfile(account)
        if (!cancelled) {
          setProfileName(name)
        }
      }
    }
    getProfileForAccount()

    return () => {
      cancelled = true
    }
  }, [account])

  return (
    <Box padding={0}>
      <div
        css={`
          display: flex;
          align-items: center;
          padding: ${3 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <EthIdenticon
          address={account}
          radius={100}
          scale={1.7}
          css={`
            margin-right: ${1.5 * GU}px;
          `}
        />
        <span
          css={`
            ${textStyle('title4')}
          `}
        >
          {profileName || shortenAddress(account, 4)}
        </span>
      </div>
      <div
        css={`
          padding: ${3 * GU}px;
        `}
      >
        <h5
          css={`
            ${textStyle('title4')};
            color: ${theme.contentSecondary};
            margin-bottom: ${3 * GU}px;
          `}
        >
          Wallet
        </h5>
        <div>
          <Balance
            amount={accountBalance}
            decimals={18}
            label="Balance"
            symbol="ANT"
          />
          <LineSeparator border={theme.border} />
          <Balance
            amount={inactiveTokens}
            decimals={stakeToken.decimals}
            inactive
            label="Inactive"
            symbol={stakeToken.symbol}
          />
        </div>
      </div>
    </Box>
  )
}

const Balance = ({
  amount = bigNum(0),
  decimals,
  inactive = false,
  label,
  symbol,
  value,
}) => {
  const theme = useTheme()
  const tokenIcon = getTokenIconBySymbol(symbol)

  return (
    <div
      css={`
        display: flex;
        align-items: flex-start;
      `}
    >
      <div
        css={`
          margin-right: ${3 * GU}px;
        `}
      >
        <img
          src={tokenIcon}
          height="50"
          alt=""
          css={`
            opacity: ${inactive ? 0.5 : 1};
          `}
        />
      </div>
      <div>
        <h5
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          {label}
        </h5>
        <span
          css={`
            ${textStyle('title4')};
            color: ${theme[inactive ? 'negative' : 'content']};
          `}
        >
          {TokenAmount.format(
            amount.toFixed ? amount.toFixed() : amount.toString(),
            decimals
          )}
        </span>
        {value && (
          <div
            css={`
              color: ${theme.green};
              ${textStyle('body3')}';
            `}
          >
            $ {value}
          </div>
        )}
      </div>
    </div>
  )
}

const LineSeparator = styled.div`
  height: 1px;
  border: 0.5px solid ${({ border }) => border};
  margin: ${3 * GU}px 0;
`

export default Wallet
