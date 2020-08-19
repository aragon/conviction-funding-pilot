import React from 'react'
import TokenAmount from 'token-amount'
import { GU, IconCheck, RADIUS, textStyle, useTheme } from '@aragon/ui'

function VoteCast({ amountOfTokens }) {
  const theme = useTheme()

  return (
    <div
      css={`
        border-radius: ${RADIUS}px;
        background: #f8fdfe;
        height: ${15.5 * GU}px;
        padding: ${3.5 * GU}px ${10 * GU}px;
        text-align: center;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-template-columns: auto 1fr;
          grid-gap: ${3 * GU}px;
          align-items: center;
          text-align: left;
        `}
      >
        <div>
          <div
            css={`
              border: 3px solid ${theme.accent};
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${theme.accent};
            `}
          >
            <IconCheck />
          </div>
        </div>
        <div>
          <div
            css={`
            ${textStyle('body1')}
            margin-bottom: ${0.5 * GU}px;
          `}
          >
            Your support was cast successfully
          </div>
          <div
            css={`
            ${textStyle('body2')}
            color: ${theme.surfaceContentSecondary};
          `}
          >
            You supported this proposal with{' '}
            {TokenAmount.format(amountOfTokens.toFixed(), 18, {
              symbol: 'ANT',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoteCast
