import React from 'react'
import { GU } from '@aragon/ui'
import AccountModule from './Account/AccountModule'
import Layout from './Layout'

import logoAnt from '../assets/logo-ant.svg'
import headerBackgroundSvg from '../assets/backdrop.png'
import logoSvg from '../assets/logotext.svg'

function Header({ compact }) {
  const antIcon = <img src={logoAnt} height={compact ? 40 : 60} alt="" />
  const headerItemsWidth = compact ? 'auto' : 25 * GU

  return (
    <header
      css={`
        background: linear-gradient(
          90deg,
          rgba(85, 194, 250, 1) 31%,
          rgba(101, 225, 247, 1) 100%,
          rgba(0, 212, 255, 1) 100%
        );
        margin-bottom: ${compact ? `${2 * GU}px` : 0};
      `}
    >
      <div
        css={`
          background: url(${headerBackgroundSvg}) no-repeat;
          background-position: center;
          padding: ${compact
            ? `${3 * GU}px`
            : `${5.625 * GU}px 0 ${8.75 * GU}px 0`};
        `}
      >
        <Layout>
          <div
            css={`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <div
              css={`
                width: ${headerItemsWidth}px;
              `}
            >
              {compact ? antIcon : <img src={logoSvg} height="30" alt="" />}
            </div>
            {!compact && (
              <div
              // css={`
              // background: white;
              // border-radius: 50%/50%;
              // `}
              >
                {antIcon}
              </div>
            )}
            <div
              css={`
                width: ${headerItemsWidth}px;
              `}
            >
              <AccountModule compact={compact} />
            </div>
          </div>
        </Layout>
      </div>
    </header>
  )
}

export default Header
