import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { hp, wp } from '@/utils/responsive'
import { Text } from 'tamagui'
import { THEME_COLORS } from '@/utils/theme'

const PercentageCard = ({ percentage = '0', subTitle = '' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="percent" size={wp(4)} color={THEME_COLORS.primary[50]} />
      </View>
      <View style={styles.bodyContent}>
        <Text fontFamily={'$heading'} fontSize={'$5'} fontWeight={'bold'}>
          {percentage}%
        </Text>
        <Text fontFamily={'$body'} fontSize={'$3'} color={'$gray9'} numberOfLines={1}>
          {subTitle}
        </Text>
      </View>
    </View>
  )
}

export default PercentageCard

const styles = StyleSheet.create({
  container: {
    borderRadius: wp(4),
    width: '48%',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: wp(4),
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: wp(3),
  },
  iconContainer: {
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
    backgroundColor: THEME_COLORS.primary[50] + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContent: { rowGap: hp(0.5), flex: 1 },
})
