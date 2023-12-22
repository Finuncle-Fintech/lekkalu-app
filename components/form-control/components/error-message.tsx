import { Text, TextProps } from 'tamagui'

type ErrorMessageProps = TextProps & {
  children?: string
}

export default function ErrorMessage({ children, ...props }: ErrorMessageProps) {
  if (!children) {
    return null
  }

  return (
    <Text {...props} color="red">
      {children}
    </Text>
  )
}
