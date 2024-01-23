import React, { FC } from 'react'
import { StackProps, View } from 'tamagui'
import { hp, wp } from '@/utils/responsive'

const Card: FC<StackProps> = ({ children, ...props }) => {
  return (
    <View
      bg="$background"
      px={wp(4)}
      py={hp(1.5)}
      br={wp(4)}
      elevationAndroid={3}
      shadowOffset={{ height: 0, width: 0 }}
      shadowColor="black"
      shadowOpacity={0.1}
      shadowRadius={wp(1)}
      mx={wp(4)}
      {...props}
    >
      {children}
    </View>
  )
}

export default Card
