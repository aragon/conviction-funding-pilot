import React from 'react'
import {
  Button,
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { getProviderFromUseWalletId } from '../../ethereum-providers'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

function AccountScreenConnected({ wallet }) {
  const theme = useTheme()
  const copy = useCopyToClipboard()

  const walletNetworkName = wallet.networkName

  const providerInfo = getProviderFromUseWalletId(wallet.connector)

  return (
    <div
      css={`
        padding: ${2 * GU}px;
        padding-top: ${0.5 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          width: 100%;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            margin-right: ${3 * GU}px;
          `}
        >
          <img
            src={providerInfo.image}
            alt=""
            css={`
              width: ${2.5 * GU}px;
              height: ${2.5 * GU}px;
              margin-right: ${1 * GU}px;
              transform: translateY(-2px);
            `}
          />
          <span>
            {providerInfo.id === 'unknown' ? 'Wallet' : providerInfo.name}
          </span>
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
          `}
        >
          <ButtonBase
            onClick={() => copy(wallet.account)}
            focusRingRadius={RADIUS}
            css={`
              display: flex;
              align-items: center;
              justify-self: flex-end;
              padding: ${0.5 * GU}px;
              &:active {
                background: ${theme.surfacePressed};
              }
            `}
          >
            <span
              css={`
                color: ${theme.contentSecondary};
                ${textStyle('body3')};
                display: block;
                margin-right: ${1 * GU}px;
                line-height: 0;
              `}
            >
              Copy Address
            </span>
            <IconCopy
              css={`
                color: ${theme.hint};
              `}
            />
          </ButtonBase>
        </div>
      </div>
      <div
        css={`
          padding: ${1 * GU};
          background: ${theme.infoSurface};
          ${textStyle('label1')}
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: ${1.5 * GU}px;
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        {wallet.account}
      </div>

      <div
        css={`
          margin-bottom: ${1.5 * GU};
        `}
      >
        <span
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          Current block:&nbsp;
        </span>{' '}
        Block {wallet.getBlockNumber()}
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-top: ${1 * GU}px;
          color: ${theme.positive};
          ${textStyle('label2')};
        `}
      >
        <IconCheck size="small" />
        <span
          css={`
            margin-left: ${0.5 * GU}px;
          `}
        >
          {`Connected to ${walletNetworkName} Network`}
        </span>
      </div>

      <Button
        onClick={() => wallet.reset()}
        wide
        css={`
          margin-top: ${1 * GU}px;
        `}
      >
        Disconnect
      </Button>
    </div>
  )
}

export default AccountScreenConnected
