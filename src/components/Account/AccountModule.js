import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Button, GU, IconConnect, springs, shortenAddress } from '@aragon/ui'
import { Transition, animated } from 'react-spring/renderprops'

import ScreenError from './ScreenError'
import AccountButton from './AccountButton'
import ScreenProviders from './ScreenProviders'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import HeaderPopover from '../Header/HeaderPopover'
import { trackEvent } from '../../lib/trackEvent'

import { getUseWalletProviders } from '../../lib/web3-utils'

const SCREENS = [
  {
    id: 'providers',
    title: 'Ethereum providers',
    height:
      4 * GU + // header
      (12 + 1.5) * GU * Math.ceil(getUseWalletProviders().length / 2) + // buttons
      7 * GU, // footer
  },
  {
    id: 'connecting',
    title: 'Ethereum providers',
    height: 38 * GU,
  },
  {
    id: 'connected',
    title: 'Ethereum Provider',
    height: 29 * GU,
  },
  {
    id: 'error',
    title: 'Ethereum providers',
    height: 50 * GU,
  },
]

function AccountModule({ compact }) {
  const buttonRef = useRef()
  const wallet = useWallet()
  const [opened, setOpened] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const popoverFocusElement = useRef()

  const { connector, status } = wallet

  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleCancelConnection = useCallback(() => {
    wallet.reset()
  }, [wallet])

  const activate = useCallback(
    async providerId => {
      // This will just return a promises that resolves.
      // We should update use-wallet to return a boolean on
      // whether this was successful so we don't have to wait
      // until a next render to figure out the status.
      const ok = await wallet.connect(providerId)
      if (ok) {
        trackEvent('web3_connect', {
          segmentation: {
            provider: providerId,
          },
        })
      }
    },
    [wallet]
  )

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    if (!opened) {
      return
    }
    setAnimate(false)
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [opened])

  useEffect(() => {
    let timer

    if (status === 'error') {
      setActivatingDelayed(null)
    }

    if (status === 'connecting') {
      setActivatingDelayed(connector)
    }

    if (status === 'connected') {
      setActivatingDelayed(null)
    }

    return () => clearTimeout(timer)
  }, [connector, status])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = status === 'disconnected' ? 'providers' : status

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [status])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(
    reject => {
      if (screenId === 'connecting' || screenId === 'error') {
        // reject closing the popover
        return false
      }
      setOpened(false)
    },
    [screenId]
  )

  // Prevents to lose the focus on the popover when a screen leaves while an
  // element inside is focused (e.g. when clicking on the “disconnect” button).
  useEffect(() => {
    if (popoverFocusElement.current) {
      popoverFocusElement.current.focus()
    }
  }, [screenId])

  return (
    <div
      ref={buttonRef}
      tabIndex="0"
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        outline: 0;
        padding-top: ${1.5 * GU}px;
        padding-bottom: ${1.5 * GU}px;
      `}
    >
      {screen.id === 'connected' ? (
        <AccountButton
          label={shortenAddress(wallet.account)}
          onClick={toggle}
        />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
          mode="strong"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
          wide
          css={`
            font-weight: bold;
          `}
        />
      )}

      <HeaderPopover
        animateHeight={animate}
        heading={screen.title}
        height={screen.height}
        width={51 * GU}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        visible={opened}
      >
        <div ref={popoverFocusElement} tabIndex="0" css="outline: 0">
          <Transition
            native
            immediate={!animate}
            config={springs.smooth}
            items={{
              screen,
              // This is needed because use-wallet throws an error when the
              // activation fails before React updates the state of `activating`.
              // A future version of use-wallet might return an
              // `activationError` object instead, making this unnecessary.
              activating: activatingDelayed,
              wallet,
            }}
            keys={({ screenId }) => screenId + status + wallet.error?.name}
            from={{
              opacity: 0,
              transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
            }}
            enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
            leave={{
              opacity: 0,
              transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
            }}
          >
            {({ screen, activating, wallet }) => ({ opacity, transform }) => (
              <animated.div
                style={{ opacity, transform }}
                css={`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                `}
              >
                {(() => {
                  if (screen.id === 'connecting') {
                    return (
                      <ScreenConnecting
                        providerId={activating}
                        onCancel={handleCancelConnection}
                      />
                    )
                  }
                  if (screen.id === 'connected') {
                    return <ScreenConnected wallet={wallet} />
                  }
                  if (screen.id === 'error') {
                    return (
                      <ScreenError error={wallet.error} onBack={wallet.reset} />
                    )
                  }
                  return <ScreenProviders onActivate={activate} />
                })()}
              </animated.div>
            )}
          </Transition>
        </div>
      </HeaderPopover>
    </div>
  )
}

export default AccountModule
