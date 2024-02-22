import { useNavigation } from 'expo-router/src/useNavigation'
import { Button } from 'native-base'
import React from 'react'
import { View, Text } from 'tamagui'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import FeatureCard from '@/components/feature-card'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'

const features = [
  {
    title: 'Income Statement',
    image: <Feather name="dollar-sign" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
  {
    title: 'EMI Calculator',
    image: <FontAwesome name="calculator" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
  {
    title: 'CAGR Calculator',
    image: <FontAwesome name="calculator" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
]

const Dashboard = () => {
  const handleOnPressFeature = (title: string) => {
    switch (title) {
      case 'Income Statement':
        router.push('/income-statement')
        break
      case 'EMI Calculator':
        router.push('/emi-calculator')
        break
      case 'CAGR Calculator':
        router.push('/cagr-calculator')
        break
      default:
        break
    }
  }

  const navigation  = useNavigation()
  const CAGRCalculator = () => {
    console.log("object")
    // return <Redirect href="/cagrcalculator" />
    navigation.navigate('cagrcalculator')
  }

  return (
    <View p={wp(4)} f={1} bg="$backgroundHover">
      <Text mb={hp(2)} fontSize={FontSizes.size26} fontFamily={'$heading'}>
        Browse Features
      </Text>
      <View fd="row" ai="center" columnGap={wp(3)}>
        {features.map((item, index) => (
          <FeatureCard
            onPress={() => handleOnPressFeature(item.title)}
            containerStyle={{ width: wp(28.5) }}
            key={`feature-${index}`}
            {...item}
          />
        ))}
      </View>
    </View>
  )
}

export default Dashboard
