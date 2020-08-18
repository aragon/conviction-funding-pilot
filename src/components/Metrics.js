import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  GU,
  Link,
  Info,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import AccountModule from './Account/AccountModule'
import BigNumber, { bigNum } from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'
import { useTokenBalanceToUsd } from '../lib/web3-utils'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import StakingTokens from '../screens/StakingTokens'

const Metrics = React.memo(function Metrics({
  commonPool,
  myStakes,
  proposals,
  requestToken,
  stakeToken,
  totalActiveTokens,
  totalSupply,
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
            Ethereum?{' '}
            <Link
              external
              href="https://ethereum.org/en/wallets/"
              css={`
                display: inline;
              `}
            >
              Learn <br />
              more about wallets
            </Link>
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
              <div
                css={`
                  ${textStyle('body4')}
                  color: ${theme.contentSecondary};
                  text-transform: uppercase;
                  margin-bottom: ${1 * GU}px;
                  margin-top: ${1 * GU}px;
                `}
              >
                Supported Proposals
              </div>
              <StakingTokens
                myStakes={myStakes}
                totalActiveTokens={totalActiveTokens}
              />
              <LineSeparator border={theme.border} />
            </>
          )}
          <TokenPrice token={antPrice} uppercased />
          <Button
            wide
            onClick={() => undefined}
            css={`
              margin-top: ${2.5 * GU}px;
            `}
          >
            Get ANT
          </Button>
          <LineSeparator />
          <TokenBalance
            label="Pilot Funds"
            value={commonPool}
            token={requestToken}
            symbol="ANT"
            uppercased
          />
        </div>
      </Box>

      <Box heading="Key Metrics">
        <MetricContainer>
          <TokenBalance
            label="Token Supply"
            value={totalSupply}
            token={stakeToken}
            symbol="ANT"
          />
        </MetricContainer>
        <MetricContainer>
          <TokenBalance
            label="Active"
            value={totalActiveTokens}
            token={stakeToken}
            symbol="ANT"
          />
        </MetricContainer>
        <MetricContainer>
          <Metric label="Proposals" value={proposals.length} />
          <div
            css={`${textStyle('body3')}
            color: ${theme.contentSecondary};
            text-transform: uppercase;
            `}
          >
            Open
          </div>
        </MetricContainer>
        <Metric label="Participants" secondaryValue="MAU" />
      </Box>
    </>
  )
})

function Metric({ label, value, color, secondaryValue, uppercased }) {
  const theme = useTheme()

  return (
    <>
      <p
        css={`
          ${textStyle(uppercased ? 'body4' : 'body2')}
          text-transform: ${uppercased ? 'uppercase' : 'capitalize'};
          color: ${uppercased ? theme.contentSecondary : theme.content};
        `}
      >
        {label}
      </p>
      <div
        css={`
          display: flex;
          align-items: flex-end;
        `}
      >
        <span
          css={`
            ${textStyle('title2')};
            color: ${color || theme.content};
          `}
        >
          {value}
        </span>
        <span
          css={`
            display: inline-block;
            height: 100%;
            ${textStyle('body3')}
            text-transform: uppercase;
            color: ${theme.contentSecondary};
            margin-left: ${0.5 * GU}px;
            margin-bottom: ${1 * GU}px;
            font-weight: 300;
          `}
        >
          {secondaryValue}
        </span>
      </div>
    </>
  )
}

function TokenBalance({ label, token, value, symbol, uppercased }) {
  const theme = useTheme()
  const usdBalance = useTokenBalanceToUsd(symbol, token.decimals, value)

  return (
    <>
      <Metric
        label={label}
        value={formatTokenAmount(value, token.decimals)}
        secondaryValue={symbol}
        uppercased={uppercased}
      />
      <div
        css={`
          ${textStyle('body3')};
          color: ${theme.contentSecondary};
        `}
      >
        {`$ ${formatTokenAmount(usdBalance, 2)}`}
      </div>
    </>
  )
}

function TokenPrice({ token, uppercased }) {
  return (
    <div>
      <Metric
        label="ANT price"
        value={`$${formatTokenAmount(token, 2)}`}
        uppercased={uppercased}
      />
    </div>
  )
}

const LineSeparator = styled.div`
  width: 100%;
  height: 1px;
  border: 1px solid rgba(221, 228, 233, 0.7);
  margin: ${3 * GU}px 0;
`

const MetricContainer = styled.div`
  width: 100%;
  margin-bottom: ${4 * GU}px;
`

export default Metrics
