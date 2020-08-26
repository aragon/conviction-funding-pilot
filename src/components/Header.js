import React, { useCallback } from 'react'
import { textStyle, GU } from '@aragon/ui'
import { useAppState } from '../providers/AppState'
import logoAaSvg from '../assets/logo-aa.svg'

function Header() {
  const { appearance, setAppearance } = useAppState()

  const toggleAppearance = useCallback(
    () => setAppearance(appearance === 'light' ? 'dark' : 'light'),
    [appearance, setAppearance]
  )

  return (
    <div
      css={`
        min-height: 100px;
        width: 100%;
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
    </div>
  )
}

export default Header
