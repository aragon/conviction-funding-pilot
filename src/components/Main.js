import React, { useCallback, useEffect } from 'react'
import { Main } from '@aragon/ui'
import { useAppState } from '../providers/AppState'

export default function MainWrapper({ children }) {
  const { appearance } = useAppState()

  const scrollTop = useCallback(() => window.scrollTo(0, 0), [])

  useEffect(() => {
    window.addEventListener('beforeunload', scrollTop)

    return () => window.removeEventListener('beforeunload', scrollTop)
  }, [scrollTop])

  return (
    <Main assetsUrl="./aragon-ui/" layout={false} theme={appearance}>
      {children}
    </Main>
  )
}
