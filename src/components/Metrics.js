import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  Box,
  ButtonBase,
  GU,
  Help,
  Link,
  Info,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import AccountModule from './Account/AccountModule'
import Carousel from './Carousel/Carousel'
import BigNumber, { bigNum } from '../lib/bigNumber'
import { formatTokenAmount } from '../lib/token-utils'
import { useTokenBalanceToUsd } from '../lib/web3-utils'
import { useAppState } from '../providers/AppState'
import { useWallet } from '../providers/Wallet'
import StakingTokens from '../screens/StakingTokens'

const Metrics = React.memo(function Metrics({
  amountOfProposals,
  commonPool,
  myStakes,
  requestToken,
  stakeToken,
  totalActiveTokens,
  totalSupply,
}) {
  const { accountBalance } = useAppState()
  const { status } = useWallet()
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

  const carouselContent = useMemo(
    () => [
      <CarouselBalance label="Active" amount={myActiveTokens} />,
      <CarouselBalance label="Inactive" amount={inactiveTokens} />,
      <CarouselBalance label="Total" amount={accountBalance} />,
    ],
    [accountBalance, myActiveTokens, inactiveTokens]
  )

  return (
    <>
      <Box
        css={`
          margin-top: ${4 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <AccountModule compact={compactMode} />
        {status === 'disconnected' && (
          <Info
            css={`
              margin-top: ${3 * GU}px;
              margin-bottom: ${4 * GU}px;
            `}
          >
            This application requires the use of a Ethereum wallet. New to
            Ethereum?{' '}
            <Link external href="https://ethereum.org/en/wallets/">
              Learn more about wallets
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
          {status === 'connected' && (
            <>
              <p
                css={`
                  margin-top: ${3 * GU}px;
                  margin-bottom: ${1.5 * GU}px;
                  ${textStyle('body4')};
                  text-transform: uppercase;
                  color: ${theme.contentSecondary};
                `}
              >
                Voting influence
              </p>
              <Carousel content={carouselContent} />
              <div
                css={`
                  margin-top: ${3 * GU}px;
                  display: flex;
                `}
              >
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: ${2.5 * GU}px;
                  `}
                >
                  <h3
                    css={`
                    color: ${theme.help};
                    ${textStyle('body2')}
                    margin-right: ${1 * GU}px;
                    padding-top: ${0.5 * GU}px;
                  `}
                  >
                    What is voting influence?
                  </h3>
                  <Help hint="What is voting influence?">
                    We captured a snapshot of your ANT balance on 2020/08/24
                    that has been translated into your current voting influence.{' '}
                    <Link external href="https://blog.aragon.org/">
                      Learn more
                    </Link>
                  </Help>
                </div>
              </div>
              {!myActiveTokens.eq('0') && (
                <>
                  <LineSeparator
                    border={theme.border}
                    css={`
                      margin-top: 0px;
                    `}
                  />
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
            </>
          )}
          <TokenPrice token={antPrice} uppercased />
          <ButtonBase
            wide
            href="https://aragon.org/token/ant"
            css={`
              position: relative;
              width: 100%;
              height: 40px;
              background: ${theme.surfaceInteractive};
              border: 1px solid ${theme.border};
              box-sizing: border-box;
              box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
              border-radius: 4px;
              margin-top: ${2.5 * GU}px;
              display: flex;
              align-items: center;
              justify-content: center;
              ${textStyle('body2')}
              &:active {
                top: 1px;
              }
            `}
          >
            Get ANT
          </ButtonBase>
          <div
            css={`
                  width: 100%;
                  height: 1px;
                  border: 1px solid ${theme.border};
                  margin: ${3 * GU}px 0;l`}
          />
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
        <Metric label="Proposals" value={amountOfProposals} />
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

function CarouselBalance({ amount, label, symbol = 'ANT' }) {
  const theme = useTheme()

  return (
    <div
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3
        css={`
          ${textStyle('body2')}
        `}
      >
        {label}
      </h3>
      <h2
        css={`
          ${textStyle('title1')}
        `}
      >
        {formatTokenAmount(amount.toFixed(), 18)}{' '}
        <span
          css={`
            color: ${theme.contentSecondary};
            ${textStyle('body2')}
          `}
        >
          {symbol}
        </span>
      </h2>
    </div>
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
  border: 1px solid ${props => props.border};
  margin: ${3 * GU}px 0;
`

const MetricContainer = styled.div`
  width: 100%;
  margin-bottom: ${4 * GU}px;
`

export default Metrics
