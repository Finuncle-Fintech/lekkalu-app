import { AxiosHeaders } from 'axios'
import { Linking } from 'react-native'
import { IntentLauncherParams, startActivityAsync } from 'expo-intent-launcher'
import { Toast } from 'native-base'

import { getToken } from './token'
import { isAndroid, isIOS } from './responsive'

export const formatNumberToCurrency = (value: number = 0, options?: Intl.NumberFormatOptions, locale?: string) => {
  return new Intl.NumberFormat(locale || 'en-IN', {
    style: 'currency',
    currency: options?.currency || 'INR',
    compactDisplay: options?.compactDisplay || 'short',
  }).format(isNaN(value) ? 0 : value)
}

export const getAxiosHeaderWithToken = async () => {
  const headers = new AxiosHeaders()
  const accessToken = await getToken('access')
  if (accessToken) {
    headers.setAuthorization(`Bearer ${accessToken}`)
  }
  return headers
}

const handleOpenMailClientError = () => {
  Toast.show({
    title: 'Failed to open mail app! Please open it manually',
  })
}

const openMailClientIOS = () => {
  Linking.canOpenURL('message:0')
    .then((supported) => {
      if (!supported) {
        handleOpenMailClientError()
      } else {
        return Linking.openURL('message:0').catch(handleOpenMailClientError)
      }
    })
    .catch(handleOpenMailClientError)
}

const openMailClientAndroid = () => {
  const activityAction = 'android.intent.action.MAIN' // Intent.ACTION_MAIN
  const intentParams: IntentLauncherParams = {
    flags: 268435456, // Intent.FLAG_ACTIVITY_NEW_TASK
    category: 'android.intent.category.APP_EMAIL', // Intent.CATEGORY_APP_EMAIL
  }

  startActivityAsync(activityAction, intentParams).catch(handleOpenMailClientError)
}

export const openDeviceMailClientApp = () => {
  if (isIOS) {
    openMailClientIOS()
  }
  if (isAndroid) {
    openMailClientAndroid()
  }
}
