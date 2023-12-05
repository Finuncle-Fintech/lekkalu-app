import { Box, Text } from 'native-base'

export function Success(title: string) {
  return (
    <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
      <Text color="white">{title}</Text>
    </Box>
  )
}
