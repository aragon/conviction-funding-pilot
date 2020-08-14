import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Box, GU, Info, textStyle, useLayout, useTheme } from '@aragon/ui'
import AccountModule from './Account/AccountModule'
import BigNumber, { bigNum } from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'
import { useTokenBalanceToUsd } from '../lib/web3-utils'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import StakingTokens from '../screens/StakingTokens'

const Metrics = React.memo(function Metrics({
  totalSupply,
  commonPool,
  myStakes,
  stakeToken,
  requestToken,
  totalActiveTokens,
}) {
  const { accountBalance } = useAppState()
  const { connected } = useWallet()
  const { layoutName } = useLayout()
  const theme = useTheme()
  const compactMode = layoutName === 'small'
  const antPrice = useTokenBalanceToUsd('ANT', 18, bigNum(1))

  const myActiveTokens = useMemo(() => {
    if (!myStakes) {
      return new BigNumber('0')
    }
    return myStakes.reduce((accumulator, stake) => {
      return accumulator.plus(stake.amount)
    }, new BigNumber('0'))
  }, [myStakes])

  const inactiveTokens = useMemo(() => {
    if (!accountBalance.gte(0) || !myActiveTokens) {
      return new BigNumber('0')
    }
    return accountBalance.minus(myActiveTokens)
  }, [accountBalance, myActiveTokens])

  return (
    <>
      <Box
        css={`
          margin-top: ${4 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <AccountModule compact={compactMode} />
        {!connected && (
          <Info
            css={`
              margin-top: ${3 * GU}px;
              margin-bottom: ${4 * GU}px;
            `}
          >
            This application requires the use of a Ethereum wallet. New to
            Ethereum? Learn more about wallets
          </Info>
        )}
        <div
          css={`
            display: ${compactMode ? 'block' : 'flex'};
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
          `}
        >
          {connected && (
            <>
              <div>
                <TokenBalance
                  label="Active"
                  value={totalActiveTokens}
                  token={stakeToken}
                />
              </div>
              <div>
                <TokenBalance
                  label="Inactive"
                  value={inactiveTokens}
                  token={stakeToken}
                />
              </div>
              <LineSeparator border={theme.border} />
              <StakingTokens
                myStakes={myStakes}
                totalActiveTokens={totalActiveTokens}
              />
              <LineSeparator border={theme.border} />
            </>
          )}
          <div
            css={`
              display: flex;
              align-items: center;
              margin-bottom: ${(compactMode ? 2 : 0) * GU}px;
              width: 100%;
            `}
          >
            {compactMode && <TokenPrice token={antPrice} />}
          </div>
          {!compactMode && <TokenPrice token={antPrice} />}
          <div>
            <TokenBalance
              label="Organization Funds"
              value={commonPool}
              token={requestToken}
            />
          </div>
        </div>
      </Box>

      <Box heading="Key Metrics">
        <div>
          <TokenBalance
            label="Token Supply"
            value={totalSupply}
            token={stakeToken}
          />
        </div>
      </Box>
    </>
  )
})

function Metric({ label, value, color }) {
  const theme = useTheme()

  return (
    <>
      <p
        css={`
          color: ${theme.contentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </p>
      <span
        css={`
          ${textStyle('title2')};
          color: ${color || theme.content};
        `}
      >
        {value}
      </span>
    </>
  )
}

function TokenBalance({ label, token, value }) {
  const theme = useTheme()

  return (
    <>
      <Metric label={label} value={formatTokenAmount(value, token.decimals)} />
      <div
        css={`
          color: ${theme.green};
        `}
      >
        $ 0
      </div>
    </>
  )
}

function TokenPrice({ token }) {
  return (
    <div>
      <Metric label="ANT price" value={`$${token.toString()}`} />
    </div>
  )
}

const LineSeparator = styled.div`
  height: 1px;
  border: 0.5px solid ${({ border }) => border};
  margin: ${3 * GU}px 0;
`

export default Metrics
