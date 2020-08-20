import React from 'react'
import { Main } from '@aragon/ui'
import { useAppState } from '../providers/AppState'

export default function MainWrapper({ children }) {
  const { appearance } = useAppState()

  return (
    <Main assetsUrl="/aragon-ui/" layout={false} theme={appearance}>
      {children}
    </Main>
  )
}
