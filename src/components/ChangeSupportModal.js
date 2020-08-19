import React, { useCallback } from 'react'
import {
  Button,
  Modal,
  Info,
  Slider,
  textStyle,
  useTheme,
  GU,
} from '@aragon/ui'
import antLogo from '../assets/logo-ant.svg'

function ChangeSupportModal({ modalVisible, onModalClose }) {
  const theme = useTheme()

  const changeSupport = useCallback(async () => {
    onModalClose()
  }, [onModalClose])

  return (
    <Modal visible={modalVisible} onClose={onModalClose}>
      <div
        css={`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')};
          `}
        >
          Support proposal
        </h2>
        <p
          css={`
            margin-top: ${3 * GU}px;
            ${textStyle('body2')}
          `}
        >
          This action will lock your tokens with this proposal. The token weight
          backing the proposal will increase over time from 0 up to the max
          amount specified.
        </p>

        <h2
          css={`
            margin-top: ${4 * GU}px;
            color: ${theme.contentSecondary};
            ${textStyle('label2')}
          `}
        >
          Amount of tokens for this proposal
        </h2>
        <div
          css={`
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: ${2 * GU}px;
          `}
        >
          <AntToken />
          <div
            css={`
              flex-grow: 1;
            `}
          />
          <Slider />
          <div
            css={`
              flex-grow: 1;
            `}
          />
          <p
            css={`
              ${textStyle('body2')}
              margin-left: ${1 * GU}px;
          `}
          >
            18%
          </p>
          <p
            css={`
              ${textStyle('body2')}
              color: ${theme.contentSecondary};
              margin-left: ${1 * GU}px;
          `}
          >
            (450 ANT)
          </p>
        </div>
        <Info
          css={`
            margin-top: ${4 * GU}px;
          `}
        >
          You have 830 ANT tokens (33% of your balance) available to support
          this proposal. You are supporting other proposals with 1,480 locked
          tokens (66% of your balance).
        </Info>

        <Button
          mode="strong"
          wide
          css={`
            margin-top: ${3 * GU}px;
          `}
          onClick={changeSupport}
        >
          Support Proposal
        </Button>
      </div>
    </Modal>
  )
}

function AntToken() {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <img
        src={antLogo}
        width="32px"
        css={`
          margin-bottom: ${1.25 * GU}px;
        `}
      />
      <p
        css={`
          ${textStyle('body2')}
          margin-left: ${1 * GU}px;
        `}
      >
        ANT
      </p>
    </div>
  )
}

export default ChangeSupportModal
