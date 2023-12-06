import { useAuthContext } from '@/hooks/use-auth'
import { calculateSip } from '@/utils/calculator'
import { Redirect, useRouter } from 'expo-router'
import { useNavigation } from 'expo-router/src/useNavigation'

import {
  Box,
  Text,
  HStack,
  VStack,
  FormControl,
  Input,
  Slider,
  Button,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { Dimensions, Platform, useWindowDimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
export default function SipCalculator() {
  const { width } = useWindowDimensions()
  const router = useRouter()
  const navig = useNavigation()

  const { tokenData } = useAuthContext()

  const { handleSubmit, register, control, setValue, getValues, watch } = useForm({
    defaultValues: {
      sip: '500',
      year: '1',
      aunual_return: '1',
    },
  })

  const summery = calculateSip(Number(watch('sip')), Number(watch('year')), Number(watch('aunual_return')))

  const navLogin = () => {
    router.push('/login')
  }
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

  const sipDescription = (label1: string, label2: string) => {
    return (
      <Box flex={1} flexWrap={'wrap'} flexDirection={'row'} marginX={2}>
        <Text fontSize="sm" color="black" mt={1} fontWeight={'800'} textAlign={'left'} mr={2}>
          {label1}
        </Text>
        <Text fontSize="sm" color="black" fontWeight={'400'} flexWrap={'wrap'}>
          {label2}
        </Text>
      </Box>
    )
  }

  const data = [
    {
      name: 'Seoul',
      population: summery.totalInvested,
      color: '#0D6DDA',
      legendFontColor: '#0D6DDA',
      legendFontSize: 15,
    },
    {
      name: 'parth',
      population: summery.wealthGained,
      color: '#79D40A',
      legendFontColor: '#79D40A',
      legendFontSize: 15,
    },
  ]
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  }
  if (tokenData) {
    return <Redirect href="/dashboard" />
  }

  return (
    <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView flex={1}>
        <Box flex={1} alignItems="center">
          <Button alignSelf={'flex-end'} marginTop={5} marginRight={5} onPress={() => navLogin()}>
            Login
          </Button>
          <Text fontSize="lg" color="black" mt={3} fontWeight={'800'}>
            SIP Calculator
          </Text>

          <Text fontSize="lg" color="black" mt={3}>
            Calculate returns on your SIP investments
          </Text>

          <HStack maxW="sm" w="full" alignSelf={'center'}>
            <Box flex={1}>
              <PieChart
                data={data}
                width={200}
                height={180}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'40'}
                center={[0, -5]}
                hasLegend={false}
              />
              <VStack space={1}>
                <Box flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
                  <Box w={5} h={5} rounded="full" bg={'primary.50'} />
                  <Text fontSize="sm" marginLeft={2} color={'primary.50'}>
                    Total Invested
                  </Text>
                </Box>
                <Box flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
                  <Box w={5} h={5} rounded="full" bg={'green.500'} />
                  <Text fontSize="sm" marginLeft={2} color={'green.500'}>
                    Wealth Gained
                  </Text>
                </Box>
              </VStack>
            </Box>
            <Box flex={0.9}>
              <Text fontSize="sm" color="black" mt={1} alignSelf={'center'} fontWeight={'800'}>
                Summary
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
                    keyboardType={'number-pad'}
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
                    keyboardType={'number-pad'}
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
              <FormControl.Label>Expected annual return (%)</FormControl.Label>
              <Controller
                name="aunual_return"
                control={control}
                render={({ field }) => (
                  <Input
                    keyboardType={'numeric'}
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

          <VStack maxW="sm" w="full" marginX={2}>
            <Text fontSize="sm" color="black" mt={1} alignSelf={'center'} fontWeight={'800'}>
              About SIP Calculator
            </Text>
            <Box mt={2} justifyContent={'center'} marginX={2}>
              <Text fontSize="sm" color="black" mt={1} fontWeight={'500'}>
                To estimate your potential returns with a Systematic Investment Plan (SIP), you need to provide three
                key pieces of information:
              </Text>
              {sipDescription('Monthly Investment Amount:', '- This is the amount you plan to invest each month.')}
              {sipDescription(
                'Duration of the Investment:',
                '- Specify how long you intend to continue your SIP investments.',
              )}
              {sipDescription(
                'Expected Annual Return (%):',
                '- Estimate the average annual return you expect from your investments.',
              )}

              <Text fontSize="sm" color="black" mt={1} fontWeight={'500'}>
                After entering these details, the SIP Calculator will provide you with an estimate of your potential
                wealth creation and returns.
              </Text>
              {sipDescription(
                'SIP Calculator Formula',
                'The formula to calculate the future value of your SIP investment is:',
              )}

              <Box flex={1} flexWrap={'wrap'} flexDirection={'row'} marginX={2}>
                <Text fontSize="sm" color="black" mt={1} fontWeight={'800'} textAlign={'left'} mr={2}>
                  Future Value of SIP Investment (FV)
                </Text>
                <Text fontSize="sm" color="black" fontWeight={'800'} flexWrap={'wrap'}>
                  = P * ([(1 + r)^n - 1]/r)(1 + r)
                </Text>
              </Box>

              <Text fontSize="sm" color="black" fontWeight={'500'} flexWrap={'wrap'}>
                Where:
              </Text>
              <Box flexWrap={'wrap'} marginX={2} flexDirection={'row'}>
                <Text fontSize="sm" color="black" fontWeight={'800'} textAlign={'left'} mr={1}>
                  - FV
                  <Text flex={1} fontSize="sm" color="black" fontWeight={'500'}>
                    is the Future Value of your investment at the end of the SIP duration.
                  </Text>
                </Text>
              </Box>
              <Box flexWrap={'wrap'} marginX={2} flexDirection={'row'}>
                <Text fontSize="sm" color="black" fontWeight={'800'} textAlign={'left'} mr={1}>
                  - P
                </Text>
                <Text flex={1} fontSize="sm" color="black" fontWeight={'500'}>
                  is the Monthly Investment Amount you contribute.
                </Text>
              </Box>
              <Box flexWrap={'wrap'} marginX={2} flexDirection={'row'}>
                <Text fontSize="sm" color="black" fontWeight={'800'} textAlign={'left'} mr={1}>
                  - r
                  <Text flex={1} fontSize="sm" color="black" fontWeight={'500'}>
                    is the monthly interest rate, calculated from the Expected Annual Return. The formula for monthly
                    interest rate is:
                  </Text>
                  <Text fontSize="sm" color="black" fontWeight={'800'}>
                    r = [(Annual rate/100)/12]
                  </Text>
                </Text>
              </Box>

              <Box flexWrap={'wrap'} marginX={2} flexDirection={'row'} marginBottom={3}>
                <Text fontSize="sm" color="black" fontWeight={'800'} textAlign={'left'} mr={1}>
                  - n
                  <Text flex={1} fontSize="sm" color="black" fontWeight={'500'}>
                    is the total number of contributions, calculated as the product of the Duration of Investment (in
                    years) and 12 (for monthly contributions).
                  </Text>
                </Text>
              </Box>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
