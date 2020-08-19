import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import { ButtonBase, textStyle, IconSettings, GU } from '@aragon/ui'
import logoAaSvg from '../assets/logo-aa.svg'

function Header() {
  const history = useHistory()
  const navigateHome = useCallback(() => history.push('/'), [history])

  return (
    <div
      css={`
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <img
          src={logoAaSvg}
          width="40"
          onClick={navigateHome}
          css={`
            position: relative;
            cursor: pointer;
            &:active {
              top: 1px;
            }
          `}
        />
        <div
          css={`
            margin-left: ${1.5 * GU}px;
            ${textStyle('title4')}
          `}
        >
          Aragon Association
        </div>
      </div>

      <ButtonBase
        css={`
          height: 100%;
          color: #8fa4b5;
        `}
      >
        <IconSettings />
      </ButtonBase>
    </div>
  )
}

export default Header
