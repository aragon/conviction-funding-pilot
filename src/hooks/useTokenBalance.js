import { useCallback, useEffect, useState, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useReadOnlyContract } from './useKnownContract'
import { useWallet } from '../providers/Wallet'

function bigNum(number) {
  return new BigNumber(number)
}

export function useTokenBalance(symbol) {
  const { account } = useWallet()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useReadOnlyContract(`TOKEN_${symbol}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if (!account || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }

    tokenContract.balanceOf(account).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [account, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if (!tokenContract || !account) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (from === account || to === account) {
        updateBalance()
      }
    }
    tokenContract.on('Transfer', onTransfer)

    // Filter transfers from and to the account
    // const filters = [
    //   tokenContract.filters.Transfer(account),
    //   tokenContract.filters.Transfer(null, account),
    // ]
    // filters.forEach(filter => tokenContract.on(filter, onTransfer))

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)

      // filters.forEach(filter =>
      //   tokenContract.removeListener(filter, onTransfer)
      // )
    }
  }, [account, tokenContract, updateBalance])

  return balance
}
