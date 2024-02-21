import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import React from 'react'
import { FontSizes } from '@/utils/fonts'

interface EmptyContentProps {
  title: string
  containerStyle?: ViewStyle
  textStyle?: TextStyle 
}

const EmptyContent = (props: EmptyContentProps) => {
  return (
    <View style={[styles.emptyContentContaier, {...props?.containerStyle }]}>
      <Text style={[styles.textStyle,{...props?.textStyle}]}>{props?.title}</Text>
    </View>
  )
}

export default EmptyContent

const styles = StyleSheet.create({
  emptyContentContaier: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle:{
    fontSize: FontSizes.size24
  }
})
