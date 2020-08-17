import React from 'react'
import { ButtonBase, textStyle, IconSettings, GU } from '@aragon/ui'
import logoAaSvg from '../assets/logo-aa.svg'

function Header() {
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
        <img src={logoAaSvg} width="40" />
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
