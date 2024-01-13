import { isAxiosError } from 'axios'
import Toast from 'react-native-toast-message'

export function onError(error: unknown) {
  Toast.show({
    type: 'error',
    text1: 'Something went wrong',
    text2: isAxiosError(error) ? error.response?.data?.message : 'Please try again later!',
  })
}
