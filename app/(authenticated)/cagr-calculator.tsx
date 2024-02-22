import {  StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons'
import { View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import KeyboardScrollView from '@/components/keyboard-scroll-view'
import { router } from 'expo-router'
import { THEME_COLORS } from '@/utils/theme'
import CagrCalculatorForm from '@/components/cagr-calculator-form'
import CagrCalculatorFormula from '@/components/cage-calculator-formula/cagr-calculator-formula'
import CagrCalculatorChartCard from '@/components/cagr-calculator-chart-card'

export default function cagrcalculator({ }) {
    const theme = useTheme()
    const { top } = useSafeAreaInsets()
    
    return (
        <View f={1} pt={top + hp(2)} bg="$backgroundHover">
      <KeyboardScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={router.back} style={styles.back}>
          <Entypo name="chevron-thin-left" size={wp(5)} color={theme.foreground.get()} />
        </TouchableOpacity>
        <CagrCalculatorChartCard/>
        <CagrCalculatorForm/>
        <CagrCalculatorFormula/>
      </KeyboardScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0058e2",
        paddingTop: 50
    },
    subContainer: {
        alignItems: 'center',
        marginTop: 12,
        marginHorizontal: 16,
    },
    back: {
        height: wp(10),
        width: wp(10),
        backgroundColor: THEME_COLORS.primary[100] + 20,
        borderRadius: wp(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: wp(5),
      },
    scrollContent: { paddingBottom: hp(4) },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        alignItems: 'center',
        marginBottom: 12,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "92%",
        alignItems: 'center',
        marginTop: 8
    },
    backButtonBackground: {
        backgroundColor: '#66c4fb54',
        marginHorizontal: 16,
        padding: 4,
        borderRadius: 100,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        height: 14,
        width: 14,
        tintColor: 'white'
    },
    whiteContainer: {
        backgroundColor: "white",
        flex: 1,
        marginTop: 18,
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22
    },
    inputFeildStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: "gray",
        maxWidth: 140,
        width: 120
    },
})
