import { Label as TamaLabel, Text, XStack } from 'tamagui'

type LabelProps = React.ComponentProps<typeof TamaLabel> & {
  children: string
  isRequired?: boolean
}

export default function Label({ children, isRequired, ...props }: LabelProps) {
  return (
    <XStack ai="center">
      <TamaLabel color="$color" {...props}>
        {children}
      </TamaLabel>
      {isRequired ? (
        <Text color="red" ml="$1">
          *
        </Text>
      ) : null}
    </XStack>
  )
}
