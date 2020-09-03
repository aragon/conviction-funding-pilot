import React from 'react'
import { useSpring, animated } from 'react-spring'
import { keyframes, css } from 'styled-components'
import { useTheme, GU } from '@aragon/ui'

const AnimatedDiv = animated.div

const ringSpinAnimation = css`
  mask-image: linear-gradient(35deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `} 0.75s linear infinite;
`

function LoadingFullscreen({ ...props }) {
  const theme = useTheme()

  const ringTransitionIn = useSpring({
    config: { mass: 1, tension: 200, friction: 20 },
    from: { opacity: 0, transform: `scale3d(1.5, 1.5, 1)` },
    to: { opacity: 1, transform: `scale3d(1, 1, 1)` },
  })

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          135deg,
          ${theme.accentEnd} 30%,
          ${theme.accentStart} 100%
        );
      `}
      {...props}
    >
      <AnimatedDiv
        css={`
          display: flex;
          position: relative;
          width: ${11 * GU}px;
          height: ${11 * GU}px;
        `}
        style={ringTransitionIn}
      >
        <LoadingGraphic />

        <div
          css={`
            position: absolute;
            /* Pull outside of bounding element to create visual space */
            top: -${1.5 * GU}px;
            left: -${1.5 * GU}px;
            right: -${1.5 * GU}px;
            bottom: -${1.5 * GU}px;
            border-radius: 100%;
            border: 3px solid white;
            ${ringSpinAnimation}
          `}
        />
      </AnimatedDiv>
    </div>
  )
}

function LoadingGraphic() {
  return (
    <svg
      viewBox="0 0 125 125"
      css={`
        width: 100%;
      `}
    >
      <defs>
        <linearGradient
          id="a"
          x1="-179.67"
          y1="747.77"
          x2="-176.94"
          y2="712.64"
          gradientTransform="matrix(1 0 0 -1 287 789.7)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="-242.58"
          y1="770.56"
          x2="-205.64"
          y2="711.93"
          gradientTransform="matrix(1 0 0 -1 287 789.7)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#c2f5ff" />
          <stop offset="1" stopColor="#8eedff" />
        </linearGradient>
        <linearGradient
          id="c"
          x1="-260.39"
          y1="753.48"
          x2="-204.01"
          y2="671.03"
          gradientTransform="matrix(1 0 0 -1 287 789.7)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#c2f5ff" />
          <stop offset="1" stopColor="#f5fdff" />
        </linearGradient>
      </defs>
      <path
        d="M118.5 52.38c.49-10.33-6.72-17.18-14.86-21.89l-5.3 31.1c3.67-.21 5.46 1.18 6.11 1.84.81.82 2.85 3.27.41 7.16 5.14-.82 13.04-5.73 13.64-18.21z"
        fill="url(#a)"
      />
      <path
        d="M49.06 16.18l-6.31-6.34c9.5-1.16 34.57.32 58.84 15.55a12.78 12.78 0 010 4.09l2 1c1.77 2.52 4.77 9.7 2.65 18.21s-5.74 12.16-7.3 12.91c-3.26 0-8.79 1.88-10.59 10.22s-5.22 10.16-6.71 10l-35.83.41-23.62-13.88-3.46-28.85 6.72-9 12-9.82L46 17.2zM91.38 28.1a13.25 13.25 0 01-3.48 2.64C78.68 28.78 75.35 24 75.35 24c8.7-.05 16.56 2 22.31 5.52a41 41 0 00-6.28-1.42z"
        fillRule="evenodd"
        fill="url(#b)"
      />
      <path
        d="M88 71.83a49.8 49.8 0 01-21.86 4.9c-22.6 0-40.92-14.2-40.92-31.71 0-12.94 10-24.07 24.33-29C22.33 17.59.42 39.49.42 66.52c0 31.18 27.8 57 62.09 57 25.61 0 46.92-14.85 58.07-34.71-15.34 3.4-33.49-3.16-32.58-16.98z"
        fillRule="evenodd"
        fill="url(#c)"
      />
    </svg>
  )
}

export default LoadingFullscreen
