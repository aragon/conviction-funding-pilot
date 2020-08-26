import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Box from '3box'
import {
  EthIdenticon,
  GU,
  shortenAddress,
  textStyle,
  useTheme,
} from '@aragon/ui'

import { useWallet } from 'use-wallet'
import HeaderModule from '../Header/HeaderModule'

const IPFS_BASE_URL = 'https://ipfs.io/ipfs/'

function AccountButton({ label, onClick }) {
  const [profile, setProfile] = useState(null)
  const theme = useTheme()
  const wallet = useWallet()

  useEffect(() => {
    let cancelled = false
    async function getProfile() {
      const profile = await Box.getProfile(wallet.account)
      if (!cancelled) {
        setProfile(profile)
      }
    }

    getProfile()

    return () => (cancelled = true)
  }, [wallet.account])

  return (
    <HeaderModule
      icon={
        <div
          css={`
            position: relative;
            width: ${6.5 * GU}px;
          `}
        >
          {profile?.image ? (
            <div
              css={`
                width: ${6.5 * GU}px;
                height: ${6.5 * GU}px;
              `}
            >
              <img
                src={`${IPFS_BASE_URL}${profile.image[0].contentUrl['/']}`}
                css={`
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  object-fit: cover;
                `}
              />
            </div>
          ) : (
            <EthIdenticon address={wallet.account} radius={50} scale={2} />
          )}
          {profile?.image ? (
            <EthIdenticon
              address={wallet.account}
              radius={50}
              scale={0.8}
              css={`
                position: absolute;
                bottom: 0px;
                right: 0px;
              `}
            />
          ) : (
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
          )}
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
            {profile?.name ? (
              <div
                css={`
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `}
              >
                {profile.name}
              </div>
            ) : (
              <div>{shortenAddress(wallet.account)}</div>
            )}
          </div>
          {profile?.name ? (
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
              {shortenAddress(wallet.account)}
            </div>
          ) : (
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
          )}
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
