import React from 'react'
import { Text, View, useTheme } from 'tamagui'
import { hp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

const DisplayItem = ({ name, track_kpi, created_at }: any) => {
  const t = useTheme()
  return (
    <View f={1} rowGap={hp(0.6)}>
      <Text fontSize={FontSizes.size18} color={t.foreground.get()} fontWeight={'bold'}>
        {name}
      </Text>
      <Text color={t.mutedForeground.get()} fontSize={FontSizes.size14} fontWeight={'500'}>
        {track_kpi}
      </Text>
      <Text color={t.mutedForeground.get()} fontWeight={'500'} fontSize={FontSizes.size12}>
        {created_at}
      </Text>
    </View>
  )
}

export default DisplayItem
