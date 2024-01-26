import React, { FC } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view'
import { hp } from '@/utils/responsive'

const KeyboardScrollView: FC<KeyboardAwareScrollViewProps> = (props) => {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      bounces={false}
      enableOnAndroid
      showsVerticalScrollIndicator={false}
      extraScrollHeight={Platform.select({ android: hp(4), ios: 0 })}
      {...props}
      contentContainerStyle={[styles.scrollContent, props.contentContainerStyle]}
      enableResetScrollToCoords={false}
    >
      {props.children}
    </KeyboardAwareScrollView>
  )
}

export default KeyboardScrollView

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
})
