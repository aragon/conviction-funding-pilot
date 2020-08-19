import React from 'react'
import PropTypes from 'prop-types'
import {
  EthIdenticon,
  GU,
  shortenAddress,
  textStyle,
  useTheme,
} from '@aragon/ui'

import { useWallet } from 'use-wallet'
import HeaderModule from '../Header/HeaderModule'

function AccountButton({ label, onClick }) {
  const theme = useTheme()
  const wallet = useWallet()

  return (
    <HeaderModule
      icon={
        <div
          css={`
            position: relative;
            width: 52px;
          `}
        >
          <EthIdenticon address={wallet.account} radius={50} scale={2} />
          <div
            css={`
              position: absolute;
              bottom: 0px;
              right: 0px;
              width: 16px;
              height: 16px;
              background: ${theme.positive};
              border: 3px solid ${theme.surface};
              border-radius: 50%;
            `}
          />
        </div>
      }
      content={
        <>
          <div
            css={`
              margin-bottom: -5px;
              ${textStyle('title4')}
            `}
          >
            {label ? (
              <div
                css={`
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `}
              >
                {label}
              </div>
            ) : (
              <div>{shortenAddress(wallet.account)}</div>
            )}
          </div>
          <div
            css={`
              ${textStyle('body4')}
              color: ${theme.contentSecondary};
              text-transform: uppercase;
              margin-top: ${1 * GU}px;
            `}
          >
            Enabled Account
          </div>
        </>
      }
      onClick={onClick}
    />
  )
}
AccountButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

export default AccountButton
