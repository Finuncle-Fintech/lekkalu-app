import React from 'react'
import { View, Text } from 'tamagui'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import FeatureCard from '@/components/feature-card'
import { wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'

const features = [
  {
    title: 'Income Statement',
    image: <Feather name="dollar-sign" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
  {
    title: 'EMI Calculator',
    image: <FontAwesome name="calculator" size={wp(6)} color={THEME_COLORS.primary[100]} />,
  },
]

const Dashboard = () => {
  const handleOnPressFeature = (title: string) => {
    switch (title) {
      case 'Income Statement':
        router.push('income-statement')
        break
      case 'EMI Calculator':
        router.push('emi-calculator')
        break
      default:
        break
    }
  }

  return (
    <View p="$4" flex={1} bg="$backgroundHover">
      <Text>Dashboard</Text>
      <Text my="$4" fontSize={'$8'} fontFamily={'$heading'}>
        Browse Features
      </Text>
      <View flexDirection="row" alignItems="center" columnGap={wp(3)}>
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
