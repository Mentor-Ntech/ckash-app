import { useState } from 'react'
import { useSettings } from './useSettings'
import { useSettingsStore } from '../store/settingStore'

export const useBalanceVisibility = (initialState: boolean = false) => {
  const [balanceHidden, setBalanceHidden] = useState<boolean>(initialState)
  //const { hideBalance, toggleHideBalance } = useSettings()
  const {
    country,
    hideBalance,
    setCountry,
    toggleHideBalance,
    setHideBalance,
    reset,
  } = useSettingsStore();

  const toggleBalanceVisibility = () => {
    // setBalanceHidden(prev => !prev)
    toggleHideBalance()
  }

  const formatBalance = (balance: number | string, decimals: number = 4): string => {
    return hideBalance ? '****' : Number(balance).toFixed(decimals)
  }

  const formatUsdValue = (balance: number, price: number): string => {
    const value = Number(balance) * Number(price)
    return hideBalance ? '****' : `$${value.toFixed(4)}`
  }

  const formatWalletBalance = (balance: number): string => {
    return hideBalance ? '*****' : balance.toString()
  }

  return {
    balanceHidden,
    toggleBalanceVisibility,
    formatBalance,
    formatUsdValue,
    formatWalletBalance,
  }
}
