import { AddIcon, Button, VStack } from 'native-base'
import { Link, router, useFocusEffect } from 'expo-router'
import { Text, View, useTheme } from 'tamagui'
import ExpenseList from '@/components/expense-list'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { THEME_COLORS } from '@/utils/theme'
import { AntDesign } from '@expo/vector-icons'
import CreateOrEditBudget from '@/components/add-or-edit-budget/add-or-edit-budget'
import { useQuery } from '@tanstack/react-query'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import { fetchBudgets, getSingleMonthBudget } from '@/queries/budget'

interface Budget {
  id: any
  limit: number
  month: string
}

export default function Expenses() {
  const theme = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentMonthData, setCurrentMonthData] = useState<Budget | null>(null)

  const { data, isFetching, isLoading, isError } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  console.log(currentMonthData)

  async function getData() {
    if (data) {
      setLoading(true)
      const monthData = await getSingleMonthBudget(new Date(), data || [])
      setCurrentMonthData(monthData)
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [data, isLoading, isError])

  return (
    <View flex={1} p={4} width={'90%'} alignSelf="center" marginTop={12}>
      <View flexDirection="row" justifyContent="space-around" marginBottom={10}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setShowModal(true)
          }}
          style={[styles.container, { backgroundColor: theme.backgroundStrong.get() }]}
        >
          <Text numberOfLines={1} adjustsFontSizeToFit fontSize={FontSizes.size14} fontFamily={'$heading'}>
            Current Month Budget
          </Text>
          {isLoading || loading ? <ActivityIndicator color={THEME_COLORS.brand[900]}/> :<Text numberOfLines={1} adjustsFontSizeToFit fontSize={FontSizes.size17} fontFamily={'$heading'} fontWeight={'bold'}>
            {currentMonthData ? '₹ ' + currentMonthData?.limit : 'Add'}
          </Text>}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            router.push('/budget')
          }}
          style={[styles.container, { backgroundColor: theme.backgroundStrong.get(), justifyContent: 'center' }]}
        >
          <Text numberOfLines={1} adjustsFontSizeToFit fontSize={FontSizes.size14} fontFamily={'$heading'}>
            View All Budget
          </Text>
        </TouchableOpacity>
      </View>

      <Text fontSize={FontSizes.size22} fontWeight={'500'} marginBottom={10}>
        All Expensess
      </Text>

      <ExpenseList />
      <TouchableOpacity style={styles.addFab}>
        <Link href="/create-expense" asChild>
          <AntDesign name="plus" color={'white'} size={wp(6)} />
        </Link>
      </TouchableOpacity>
      <CreateOrEditBudget setShowModal={setShowModal} showModal={showModal} title="Add Budget" />
    </View>
  )
}

const styles = StyleSheet.create({
  addFab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[50],
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: wp(4),
    bottom: wp(2),
  },
  container: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderRadius: wp(4),
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    alignItems: 'center',
    rowGap: hp(1),
    flex: 0.45,
  },
})
