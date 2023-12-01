import { Box } from 'native-base'

export function Success(title: string) {
  return (
    <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5} color="white">
      {title}
    </Box>
  )
}
