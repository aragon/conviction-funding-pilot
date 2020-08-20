import React, { useCallback } from 'react'
import { ButtonBase, textStyle, IconSettings, useTheme, GU } from '@aragon/ui'
import { useAppState } from '../providers/AppState'
import logoAaSvg from '../assets/logo-aa.svg'

function Header() {
  const { appearance, setAppearance } = useAppState()
  const theme = useTheme()

  const toggleAppearance = useCallback(
    () => setAppearance(appearance === 'light' ? 'dark' : 'light'),
    [appearance, setAppearance]
  )

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
          onClick={toggleAppearance}
          css={`
            background: ${theme.background}
            position: relative;
            cursor: pointer;
            &:active {
              top: 2px;
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
