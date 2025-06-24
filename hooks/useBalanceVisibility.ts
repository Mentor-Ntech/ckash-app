import { useState } from 'react'

export const useBalanceVisibility = (initialState: boolean = false) => {
  const [balanceHidden, setBalanceHidden] = useState<boolean>(initialState)

  const toggleBalanceVisibility = () => {
    setBalanceHidden(prev => !prev)
  }

  const formatBalance = (balance: number | string, decimals: number = 4): string => {
    return balanceHidden ? '****' : Number(balance).toFixed(decimals)
  }

  const formatUsdValue = (balance: number, price: number): string => {
    const value = Number(balance) * Number(price)
    return balanceHidden ? '****' : `$${value.toFixed(4)}`
  }

  const formatWalletBalance = (balance: number): string => {
    return balanceHidden ? '*****' : balance.toString()
  }

  return {
    balanceHidden,
    toggleBalanceVisibility,
    formatBalance,
    formatUsdValue,
    formatWalletBalance,
  }
}
