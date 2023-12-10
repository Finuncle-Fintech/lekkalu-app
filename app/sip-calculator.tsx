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
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Dimensions, Platform, useWindowDimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'

const SummaryText = (props: { title: string; value: string | number }) => {
  return (
    <VStack marginLeft={1} alignItems={'flex-start'}>
      <Text fontSize="xs" color="black" mt={1} fontWeight={'700'}>
        {props.title}
      </Text>
      <Text fontSize="xs" color="black" mt={0.5} fontWeight={'500'}>
        {`${props.value}₹`}
      </Text>
    </VStack>
  )
}

const SipDescription = (props: { label1: string; label2: string }) => {
  return (
    <Box flex={1} flexWrap={'wrap'} flexDirection={'row'} marginX={2}>
      <Text fontSize="sm" color="black" mt={1} fontWeight={'800'} textAlign={'left'} mr={2}>
        {props.label1}
      </Text>
      <Text fontSize="sm" color="black" fontWeight={'400'} flexWrap={'wrap'}>
        {props.label2}
      </Text>
    </Box>
  )
}

export default function SipCalculator() {
  const [sip, setSip] = useState('500')
  const [year, setYear] = useState('1')
  const [annualReturn, setAnnualReturn] = useState('1')

  const router = useRouter()

  const { tokenData } = useAuthContext()
  // This code commect becasue onece abouve issue solve then i remove it
  // const { register, control, setValue, watch } = useForm({
  //   defaultValues: {
  //     sip: '500',
  //     year: '1',
  //     aunual_return: '1',
  //   },
  // })

  const summery = calculateSip(Number(sip), Number(year), Number(annualReturn))

  const navLogin = () => {
    router.push('/login')
  }

  const data = [
    {
      name: 'Seoul',
      population: Number(summery.totalInvested),
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
              <SummaryText title={'Total invested:'} value={summery.totalInvested} />
              <SummaryText title={'Final value:'} value={summery.finalValue} />
              <SummaryText title={'Wealth gained:'} value={summery.wealthGained} />
            </Box>
          </HStack>
          <VStack maxW="sm" w="full" p="5" space={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mt={1} fontWeight={'600'}>
                Monthly investment amount ₹
              </Text>

              <Input
                mt={1.5}
                keyboardType={'number-pad'}
                size="md"
                h={10}
                placeholder="Monthly investment amount ₹"
                value={sip}
                onChangeText={(text) => {
                  setSip(text)
                }}
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
                    setSip(e.toString())
                    // setValue('sip', e.toString())
                  }}
                >
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
              </Box>
            </Box>
            {/* <FormControl>
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
            </FormControl> */}
            <Box>
              <Text fontSize="sm" color="gray.500" mt={1} fontWeight={'600'}>
                Duration of the investment (Yr)
              </Text>

              <Input
                mt={1.5}
                keyboardType={'number-pad'}
                size="md"
                h={10}
                placeholder="Duration of the investment (Yr)"
                value={year}
                onChangeText={(text) => {
                  setYear(text)
                }}
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
                    setYear(e.toString())
                    // setValue('sip', e.toString())
                  }}
                >
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
              </Box>
            </Box>
            {/* <FormControl>
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
            </FormControl> */}
            <Box>
              <Text fontSize="sm" color="gray.500" mt={1} fontWeight={'600'}>
                Expected annual return (%)
              </Text>

              <Input
                mt={1.5}
                keyboardType={'numeric'}
                size="md"
                h={10}
                placeholder="Expected annual return (%)"
                value={annualReturn}
                onChangeText={(text) => {
                  setAnnualReturn(text)
                }}
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
                    setAnnualReturn(e.toString())
                  }}
                >
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
              </Box>
            </Box>
            {/* <FormControl>
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
            </FormControl> */}
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
              <SipDescription
                label1="Monthly Investment Amount:"
                label2="- This is the amount you plan to invest each month."
              />
              <SipDescription
                label1="Duration of the Investment:"
                label2="- Specify how long you intend to continue your SIP investments."
              />
              <SipDescription
                label1="Expected Annual Return (%):"
                label2="- Estimate the average annual return you expect from your investments."
              />

              <Text fontSize="sm" color="black" mt={1} fontWeight={'500'}>
                After entering these details, the SIP Calculator will provide you with an estimate of your potential
                wealth creation and returns.
              </Text>
              <SipDescription
                label1="SIP Calculator Formula"
                label2="The formula to calculate the future value of your SIP investment is:"
              />

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
                </Text>
                <Text flex={1} fontSize="sm" color="black" fontWeight={'500'}>
                  is the Future Value of your investment at the end of the SIP duration.
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
                </Text>
                <Text fontSize="sm" color="black" fontWeight={'500'}>
                  is the monthly interest rate, calculated from the Expected Annual Return. The formula for monthly
                  interest rate is:-
                  <Text fontSize="sm" color="black" fontWeight={'800'} marginLeft={1}>
                    r = [(Annual rate/100)/12]
                  </Text>
                </Text>
              </Box>

              <Box flexWrap={'wrap'} marginX={2} flexDirection={'row'} marginBottom={3}>
                <Text fontSize="sm" color="black" fontWeight={'800'} textAlign={'left'} mr={1}>
                  - n
                </Text>
                <Text flex={1} fontSize="sm" color="black" fontWeight={'500'}>
                  is the total number of contributions, calculated as the product of the Duration of Investment (in
                  years) and 12 (for monthly contributions).
                </Text>
              </Box>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
