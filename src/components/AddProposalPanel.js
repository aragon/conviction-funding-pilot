import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  DropDown,
  Field,
  GU,
  Info,
  Link,
  isAddress,
  TextInput,
  useTheme,
} from '@aragon/ui'
import { useAppState } from '../providers/AppState'

import BigNumber from '../lib/bigNumber'
import { toDecimals } from '../lib/math-utils'
import { formatTokenAmount } from '../lib/token-utils'
import { calculateThreshold, getMaxConviction } from '../lib/conviction'

import { ZERO_ADDR } from '../constants'

const NULL_PROPOSAL_TYPE = -1
const FUNDING_PROPOSAL = 1

const DEFAULT_FORM_DATA = {
  title: '',
  link: '',
  proposalType: NULL_PROPOSAL_TYPE,
  amount: {
    value: '0',
    valueBN: new BigNumber(0),
  },
  beneficiary: '',
}

const AddProposalPanel = React.memo(({ onSubmit }) => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const theme = useTheme()
  const {
    alpha,
    maxRatio,
    requestToken,
    stakeToken,
    totalSupply,
    vaultBalance,
    weight,
  } = useAppState()

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const fundingMode = formData.proposalType === FUNDING_PROPOSAL

  const handleAmountEditMode = useCallback(
    editMode => {
      setFormData(formData => {
        const { amount } = formData

        const newValue = amount.valueBN.gte(0)
          ? formatTokenAmount(
              amount.valueBN,
              stakeToken.decimals,
              false,
              false,
              {
                commas: !editMode,
                replaceZeroBy: editMode ? '' : '0',
                rounding: stakeToken.decimals,
              }
            )
          : ''

        return {
          ...formData,
          amount: {
            ...amount,
            value: newValue,
          },
        }
      })
    },
    [stakeToken]
  )

  const handleProposalTypeChange = useCallback(selected => {
    setFormData(formData => ({
      ...formData,
      proposalType: selected,
    }))
  }, [])

  const handleTitleChange = useCallback(event => {
    const updatedTitle = event.target.value
    setFormData(formData => ({ ...formData, title: updatedTitle }))
  }, [])

  const handleAmountChange = useCallback(
    event => {
      const updatedAmount = event.target.value

      const newAmountBN = new BigNumber(
        isNaN(updatedAmount)
          ? -1
          : toDecimals(updatedAmount, stakeToken.decimals)
      )

      setFormData(formData => ({
        ...formData,
        amount: {
          value: updatedAmount,
          valueBN: newAmountBN,
        },
      }))
    },
    [stakeToken.decimals]
  )

  const handleBeneficiaryChange = useCallback(event => {
    const updatedBeneficiary = event.target.value

    setFormData(formData => ({ ...formData, beneficiary: updatedBeneficiary }))
  }, [])

  const handleLinkChange = useCallback(event => {
    const updatedLink = event.target.value
    setFormData(formData => ({ ...formData, link: updatedLink }))
  }, [])

  const handleFormSubmit = useCallback(
    event => {
      event.preventDefault()

      const { amount, beneficiary = ZERO_ADDR, link, title } = formData
      const convertedAmount = amount.valueBN.toString()
      onSubmit({
        title,
        link,
        amount: convertedAmount,
        beneficiary: beneficiary || ZERO_ADDR,
      })
    },
    [formData, onSubmit]
  )

  const errors = useMemo(() => {
    const errors = []

    const { amount, beneficiary, title } = formData
    if (requestToken) {
      if (amount.valueBN.eq(-1)) {
        errors.push('Invalid requested amount')
      }

      if (beneficiary && !isAddress(beneficiary)) {
        errors.push('Beneficiary is not a valid ethereum address')
      }

      return errors
    }

    return !title
  }, [formData, requestToken])

  const neededThreshold = useMemo(() => {
    const threshold = calculateThreshold(
      formData.amount.valueBN,
      vaultBalance,
      totalSupply,
      alpha,
      maxRatio,
      weight
    )

    const max = getMaxConviction(totalSupply, alpha)
    return Math.round((threshold / max) * 100)
  }, [alpha, formData.amount, maxRatio, totalSupply, vaultBalance, weight])

  const submitDisabled =
    formData.proposalType === NULL_PROPOSAL_TYPE ||
    (formData.proposalType === FUNDING_PROPOSAL &&
      (formData.amount.value === '0' || !formData.beneficiary)) ||
    !formData.title ||
    !termsAccepted

  return (
    <form onSubmit={handleFormSubmit}>
      <Field
        label="Select proposal type"
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        <DropDown
          header="Select proposal type"
          placeholder="Proposal type"
          selected={formData.proposalType}
          onChange={handleProposalTypeChange}
          items={['Signaling proposal', 'Funding proposal']}
          required
          wide
        />
      </Field>
      <Field
        label="Title"
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <TextInput
          onChange={handleTitleChange}
          value={formData.title}
          wide
          required
        />
      </Field>
      {requestToken && fundingMode && (
        <>
          <Field
            label="Requested Amount"
            onFocus={() => handleAmountEditMode(true)}
            onBlur={() => handleAmountEditMode(false)}
          >
            <TextInput
              value={formData.amount.value}
              onChange={handleAmountChange}
              required
              wide
              adornment={
                <span
                  css={`
                    background: ${theme.background};
                    border-left: 1px solid ${theme.border};
                    border-radius: 0px ${4}px ${4}px 0px;
                    padding: 7px ${1.5 * GU}px;
                  `}
                >
                  {requestToken.symbol}
                </span>
              }
              adornmentPosition="end"
              adornmentSettings={{ padding: 1 }}
            />
          </Field>
          <Field label="Beneficiary">
            <TextInput
              onChange={handleBeneficiaryChange}
              value={formData.beneficiary}
              wide
              required
            />
          </Field>
        </>
      )}
      <Field label="Link">
        <TextInput onChange={handleLinkChange} value={formData.link} wide />
      </Field>
      <label
        css={`
          margin-bottom: ${2 * GU}px;
          display: flex;
          align-items: center;
        `}
      >
        <Checkbox checked={termsAccepted} onChange={setTermsAccepted} />I accept
        the&nbsp;
        <Link
          href="https://ipfs.eth.aragon.network/ipfs/QmVwTFJRkCkp9h8enqk8WZcu7GuqpJprCBDuejo6QL9QCm"
          external
        >
          Terms and Conditions
        </Link>
      </label>
      <Button
        wide
        mode="strong"
        type="submit"
        disabled={errors.length > 0 || submitDisabled}
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        Submit
      </Button>
      {formData.proposalType !== NULL_PROPOSAL_TYPE && (
        <Info
          title="Action"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {fundingMode ? (
            <>
              <span>
                This action will create a proposal which can be voted on
              </span>{' '}
              <span
                css={`
                  font-weight: 700;
                `}
              >
                by staking {stakeToken.symbol}.
              </span>{' '}
              <span>
                The action will be executable if the accrued total stake reaches
                above the threshold.
              </span>
            </>
          ) : (
            <>
              <span>
                This action will create a proposal which can be voted on,
              </span>{' '}
              <span
                css={`
                  font-weight: 700;
                `}
              >
                it's a proposal without a requested amount.
              </span>{' '}
              <span>The action will not be executable.</span>
            </>
          )}
        </Info>
      )}
      {fundingMode && formData.amount.valueBN.gte(0) && (
        <Info
          mode={neededThreshold ? 'info' : 'warning'}
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {neededThreshold
            ? `Required conviction for requested amount in order for the proposal to
          pass is ~%${neededThreshold}`
            : `Proposal might never pass with requested amount`}
        </Info>
      )}
      {errors.length > 0 && (
        <Info
          mode="warning"
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Info>
      )}
    </form>
  )
})

export default AddProposalPanel
