import React from 'react'
import { animated, useTransition } from 'react-spring'
import { GU, useTheme, useViewport } from '@aragon/ui'
import LoadingFullscreen from '../LoadingFullscreen'
import { useAppState } from '../providers/AppState'

import ConvictionBanner from './ConvictionBanner'
import Footer from './Footer'
import Header from './Header'
import Layout from './Layout'

function MainView({ children }) {
  const theme = useTheme()
  const { below } = useViewport()
  const compactMode = below('medium')
  const { isLoading } = useAppState()

  const loaderExitTransitions = useTransition(isLoading, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {!isLoading && (
        <div
          css={`
            position: relative;
            z-index: 1;
            width: 100%;
            background: ${theme.background};
          `}
        >
          <ConvictionBanner />
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
              `}
            >
              <Layout>{children}</Layout>
            </div>
            <Footer compact={compactMode} />
          </div>
        </div>
      )}
      {loaderExitTransitions.map(
        ({ item: loading, key, props }) =>
          loading && (
            <animated.div
              style={props}
              key={key}
              css={`
                height: 100vh;
                display: flex;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                z-index: 2;
              `}
            >
              <LoadingFullscreen
                css={`
                  flex: 1;
                `}
              />
            </animated.div>
          )
      )}
    </>
  )
}

export default MainView
