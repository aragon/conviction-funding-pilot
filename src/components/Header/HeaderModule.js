import React from 'react'
import { ButtonBase, GU, useTheme, useViewport } from '@aragon/ui'

function HeaderModule({ icon, content, onClick }) {
  const { above } = useViewport()
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      css={`
        height: 100%;
        background: ${theme.surface};
        width: 100%;
        &:active {
          background: ${theme.surfacePressed};
        }
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          text-align: left;
        `}
      >
        <>
          {icon}
          {above('medium') && (
            <React.Fragment>
              <div
                css={`
                  width: 100%;
                  padding-left: ${1 * GU}px;
                  padding-right: ${0.5 * GU}px;
                `}
              >
                {content}
              </div>
            </React.Fragment>
          )}
        </>
      </div>
    </ButtonBase>
  )
}

export default HeaderModule
