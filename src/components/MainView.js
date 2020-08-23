import React from 'react'
import { animated, config, useSpring } from 'react-spring'
import { GU, useTheme, useViewport } from '@aragon/ui'

import Footer from './Footer'
import Header from './Header'
import Layout from './Layout'

function MainView({ children }) {
  const theme = useTheme()
  const { below } = useViewport()
  const compactMode = below('medium')

  const revealProps = useSpring({
    from: { opacity: 0, transform: 'scale3d(0.98, 0.98, 1)' },
    to: { opacity: 1, transform: 'scale3d(1, 1, 1)' },
    config: config.slow,
  })

  return (
    <div
      css={`
      position: relative;
      z-index: 100;
      width: 100%;
      height: 100vh;
      background: no-repeat center/170px url(/splash_1.svg),
                linear-gradient(289.78deg, #01E8F7 18.35%, #00C2FF 80.68%); !important

      `}
    >
      <animated.div
        style={revealProps}
        css={`
          background: ${theme.background};
          display: flex;
          flex-direction: column;
          height: 100vh;
        `}
      >
        <Layout>
          <Header compact={compactMode} />
        </Layout>
        <div
          css={`
            ${!compactMode && `transform: translateY(-${4 * GU}px);`}
            flex: 1 0 auto;
          `}
        >
          <div
            css={`
              min-height: 100vh;
              height: 100%;
            `}
          >
            <Layout>{children}</Layout>
          </div>
          <Footer compact={compactMode} />
        </div>
      </animated.div>
    </div>
  )
}

export default MainView
