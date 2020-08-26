import React, { useCallback, useEffect, useState } from 'react'
import { animated, useTransition } from 'react-spring'
import { useViewport } from 'use-viewport'
import { ButtonBase, IconCross, springs, GU, RADIUS } from '@aragon/ui'

const BANNER_HEIGHT = 48
const MOBILE_BANNER_HEIGHT = 64

function ConvictionBanner() {
  const [visible, setVisible] = useState(true)
  const { below } = useViewport()

  const compactMode = below('medium')

  useEffect(() => {
    let timeout
    if (compactMode && visible) {
      timeout = setTimeout(() => setVisible(false), 5000)
    }

    return () => clearTimeout(timeout)
  }, [compactMode, visible])

  const toggleVisible = useCallback(() => {
    setVisible(v => !v)
  }, [setVisible])

  const transitions = useTransition(visible, null, {
    from: { height: 0 },
    enter: { height: compactMode ? MOBILE_BANNER_HEIGHT : BANNER_HEIGHT },
    leave: { height: 0 },
    config: springs.smooth,
  })

  return transitions.map(({ item: visible, key, props }) => {
    return (
      visible && (
        <animated.div
          key={key}
          style={{ ...props, overflow: 'hidden' }}
          css={`
            width: 100%;
            background: linear-gradient(
              204.88deg,
              #32fff5 -103.98%,
              #01bfe3 80.13%
            );
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
            box-sizing: border-box;
            color: white;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            text-align: center;
          `}
        >
          <p
            css={`
              ${compactMode && `font-size: ${1.75 * GU}px;`}
            `}
          >
            We just released the Conviction funding pilot! Learn about how to
            participate!
            <ButtonBase
              focusRingRadius={RADIUS}
              focusRingSpacing={2}
              css={`
                position: relative;
                margin-left: ${3 * GU}px;
                background: linear-gradient(
                  0deg,
                  rgba(255, 255, 255, 0.18),
                  rgba(255, 255, 255, 0.18)
                );
                /* surface */

                border: 1.5px solid white;
                box-sizing: border-box;
                backdrop-filter: blur(60px);
                /* Note: backdrop-filter has minimal browser support */
                border-radius: 3px;
                color: white;
                padding: ${0.25 * GU}px ${2 * GU}px;

                ${compactMode &&
                  `
                display: inline;
                font-size: ${1.75 * GU}px;
                margin-left: ${1 * GU}px;
                `}

                &:active {
                  top: 1px;
                }
              `}
              href="https://aragon.org/blog/introducing-the-conviction-funding-pilot"
            >
              Discover
            </ButtonBase>
          </p>
          <ButtonBase
            onClick={toggleVisible}
            css={`
              opacity: ${compactMode ? '0' : '1'};
              position: absolute;
              top: ${1.5 * GU}px;
              right: ${2 * GU}px;
              align-self: center;
            `}
          >
            <IconCross />
          </ButtonBase>
        </animated.div>
      )
    )
  })
}

export default ConvictionBanner
