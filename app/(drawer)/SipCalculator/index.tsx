import { calculateSip } from '@/utils/calculator'
import { Box, Text, HStack, VStack, FormControl, Input, Slider } from 'native-base'
import { Controller, useForm } from 'react-hook-form'

export default function Page() {
  const { handleSubmit, register, control, setValue, getValues, watch } = useForm({
    defaultValues: {
      sip: '500',
      year: '1',
      aunual_return: '1',
    },
  })

  const summery = calculateSip(Number(watch('sip')), Number(watch('year')), Number(watch('aunual_return')))

  const summaryText = (title: string, value: string | number) => {
    return (
      <VStack marginLeft={1} alignItems={'flex-start'}>
        <Text fontSize="xs" color="black" mt={1} fontWeight={'700'}>
          {title}
        </Text>
        <Text fontSize="xs" color="black" mt={0.5} fontWeight={'500'}>
          {`${value}₹`}
        </Text>
      </VStack>
    )
  }

  return (
    <Box flex={1} alignItems="center">
      <Text fontSize="lg" color="black" mt={3}>
        {'Calculate returns on your SIP investments'}
      </Text>
      <HStack maxW="sm" w="full" alignSelf={'center'}>
        <Box flex={1} borderWidth={1}>
          <Text fontSize="lg" color="black" mt={5} alignItems={'center'} alignSelf={'center'}>
            {'Calculate returns on your SIP investments'}
          </Text>
        </Box>
        <Box flex={0.9} borderWidth={1}>
          <Text fontSize="sm" color="black" mt={1} alignSelf={'center'} fontWeight={'800'}>
            {'Summary'}
          </Text>
          {summaryText('Total invested:', summery.totalInvested)}
          {summaryText('Final value:', summery.finalValue)}
          {summaryText('Wealth gained:', summery.wealthGained)}
        </Box>
      </HStack>
      <VStack maxW="sm" w="full" p="5" space={4}>
        <FormControl>
          <FormControl.Label>Monthly investment amount ₹</FormControl.Label>
          <Controller
            name="sip"
            control={control}
            render={({ field }) => (
              <Input
                size="md"
                placeholder="Monthly investment amount ₹"
                {...register('sip')}
                {...field}
                onChangeText={field.onChange}
              />
            )}
          />
          <Box alignItems="center" w="100%" mt={2}>
            <Slider
              w="100%"
              colorScheme="cyan"
              defaultValue={500}
              minValue={500}
              size="sm"
              maxValue={100000}
              step={500}
              onChange={(e) => {
                setValue('sip', e.toString())
              }}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
        </FormControl>
        <FormControl>
          <FormControl.Label>Duration of the investment (Yr)</FormControl.Label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Input
                size="md"
                placeholder="Duration of the investment (Yr)"
                {...register('year')}
                {...field}
                onChangeText={field.onChange}
              />
            )}
          />
          <Box alignItems="center" w="100%" mt={2}>
            <Slider
              w="100%"
              colorScheme="cyan"
              defaultValue={1}
              minValue={1}
              size="sm"
              maxValue={40}
              step={1}
              onChange={(e) => {
                setValue('year', e.toString())
              }}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
        </FormControl>
        <FormControl>
          <FormControl.Label>{'Expected annual return (%)'}</FormControl.Label>
          <Controller
            name="aunual_return"
            control={control}
            render={({ field }) => (
              <Input
                size="md"
                placeholder="Expected annual return (%)"
                {...register('aunual_return')}
                {...field}
                onChangeText={field.onChange}
              />
            )}
          />
          <Box alignItems="center" w="100%" mt={2}>
            <Slider
              w="100%"
              colorScheme="cyan"
              defaultValue={1}
              minValue={1}
              size="sm"
              maxValue={30}
              step={0.1}
              onChange={(e) => {
                setValue('aunual_return', e.toString())
              }}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
        </FormControl>
      </VStack>
    </Box>
  )
}
