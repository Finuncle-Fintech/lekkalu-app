import React, { FC, PropsWithChildren, createContext, useEffect, useState } from 'react'
import { getData, storeData } from '@/utils/storage/storageHelpers'
import { storageKeys } from '@/utils/storage/storageKeys'

interface IAppContextValue {
  currency: {
    symbol: string
    iso: string
  }
}

export const AppContext = createContext<IAppContextValue>({} as IAppContextValue)

const setDefaultCurrency = () => {
  try {
    const data: IAppContextValue['currency'] = {
      symbol: '₹',
      iso: 'INR',
    }
    storeData(storageKeys.CURRENCY_PREFERENCE, JSON.stringify(data))
  } catch (error) {}
}

const AppContextProvider: FC<PropsWithChildren> = (props) => {
  const [currency, setCurrency] = useState<IAppContextValue['currency']>({ iso: 'INR', symbol: '₹' })

  const handleUserCurrency = async () => {
    try {
      const currentCurrencyPreference = await getData('CURRENCY_PREFERENCE')

      if (currentCurrencyPreference) {
        setCurrency(JSON.parse(currentCurrencyPreference))
      } else {
        setDefaultCurrency()
      }
    } catch (error) {}
  }

  useEffect(() => {
    handleUserCurrency()
  }, [])

  const value: IAppContextValue = { currency }

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
}

export default AppContextProvider
