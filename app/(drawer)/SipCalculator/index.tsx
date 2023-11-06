import { Box, Text, HStack, VStack } from 'native-base'

export default function Page() {
  const summaryText = (title: string, value: string | number) => {
    return (
      <VStack marginLeft={1} alignItems={'flex-start'}>
        <Text fontSize="xs" color="black" mt={1} fontWeight={'700'}>
          {title}
        </Text>
        <Text fontSize="xs" color="black" mt={0.5} fontWeight={'500'}>
          {value}
        </Text>
      </VStack>
    )
  }
  return (
    <Box flex={1} alignItems="center">
      <Text fontSize="lg" color="black" mt={3}>
        Calculate returns on your SIP investments
      </Text>
      <HStack maxW="sm" w="full" alignSelf={'center'}>
        <Box flex={1} borderWidth={1}>
          <Text fontSize="lg" color="black" mt={5} alignItems={'center'} alignSelf={'center'}>
            Calculate returns on your SIP investments
          </Text>
        </Box>
        <Box flex={0.9} borderWidth={1}>
          <Text fontSize="sm" color="black" mt={1} alignSelf={'center'} fontWeight={'800'}>
            Summary
          </Text>
          {summaryText('Total invested:', '1200')}
          {summaryText('Final value:', '2000')}
          {summaryText('Wealth gained:', '2200')}
        </Box>
      </HStack>
    </Box>
  )
}
