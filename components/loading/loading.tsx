import { Heading, View } from 'native-base'

type LoadingProps = {
  title?: string
}

export default function Loading({ title = 'Loading...' }: LoadingProps) {
  return (
    <View alignItems="center" justifyContent="center">
      <Heading>{title}</Heading>
    </View>
  )
}
