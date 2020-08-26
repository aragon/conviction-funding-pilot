import React, { useCallback, useState } from 'react'
import { animated, useTransition } from 'react-spring'
import { ButtonBase, useTheme, GU } from '@aragon/ui'
import { useAppState } from '../../providers/AppState'

const AnimDiv = animated.div

const LIGHT_INFO_SURFACE_COLOR = '#F8FDFE'

function safeGetPage(pageNumber, contentLength) {
  if (pageNumber < 0) {
    // TODO: Add a warning here
    return 0
  }

  if (pageNumber >= contentLength) {
    return contentLength - 1
  }

  return pageNumber
}

function Carousel({ content }) {
  const [page, setPage] = useState(0)
  const theme = useTheme()
  const { appearance } = useAppState()

  const safePage = safeGetPage(page)
  const pagesArray = content.map((_, i) => i)

  const handlePageClick = useCallback(i => setPage(i), [setPage])

  const transitions = useTransition(safePage, null, {
    from: {
      opacity: 0,
      transform: `translate3d(${3 * GU}px, 0, 0)`,
    },
    enter: { opacity: 1, transform: `translate3d(0, 0, 0)` },
    leave: {
      opacity: 0,
      transform: `translate3d(${3 * GU * -1}px, 0, 0)`,
    },
  })

  return (
    <div
      css={`
        position: relative;
        width: 100%;
        height: ${17 * GU}px;
        padding: ${1.5 * GU}px 0 ${2 * GU}px ${2.5 * GU}px;
        background: ${appearance === 'light'
          ? LIGHT_INFO_SURFACE_COLOR
          : theme.infoSurface};
        border-radius: ${0.5 * GU}px;
        box-shadow: 0px 4px 6px rgba(7, 146, 175, 0.08);
      `}
    >
      {transitions.map(({ item, props, key }) => (
        <AnimDiv
          key={key + item}
          style={props}
          css={`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding: ${2 * GU}px 0 ${2 * GU}px ${2.5 * GU}px;
            width: 100%;
            height: 100%;
          `}
        >
          {content[safePage]}
        </AnimDiv>
      ))}
      <div
        css={`
          position: absolute;
          bottom: ${2 * GU}px;
          display: flex;
        `}
      >
        {pagesArray.map(key => (
          <CarouselButton
            full={key === page}
            key={key}
            id={key}
            onClick={handlePageClick}
          />
        ))}
      </div>
    </div>
  )
}

function CarouselButton({ onClick, id, full }) {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [id, onClick])

  return (
    <ButtonBase
      onClick={handleClick}
      css={`
        background: ${full
          ? 'linear-gradient(204.88deg, #32FFF5 -103.98%, #01BFE3 80.13%)'
          : 'transparent'};
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid #01bfe3;
        margin-right: ${1 * GU}px;
      `}
    />
  )
}

export default Carousel
