import { Heading, View } from 'native-base'
import { FontSizes } from '@/utils/fonts'

type LoadingProps = {
  title?: string
}

export default function Loading({ title = 'Loading...' }: LoadingProps) {
  return (
    <View alignItems="center" justifyContent="center">
      <Heading fontSize={FontSizes.size28}>{title}</Heading>
    </View>
  )
}
