import React, { FC, useState } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { Tabs, Text } from 'tamagui'
import { useNavigation } from 'expo-router'
import { useToast } from 'native-base'

import { hp, wp } from '@/utils/responsive'
import IncomeExpenseItem from './income-expense-item'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'
import {
  APIIncomeExpenseItemType,
  APIIncomeSourceItemType,
  useDeleteIncomeExpense,
  useDeleteIncomeSource,
} from '@/queries/income-statement'

interface IncomeStatementTabsProps {
  incomeList: APIIncomeSourceItemType[]
  expenseList: APIIncomeExpenseItemType[]
  refetchIncomeExpense: () => Promise<any>
  refetchIncomeSource: () => Promise<any>
}

type TabType = 'income' | 'expense'

const IncomeStatementTabs: FC<IncomeStatementTabsProps> = ({
  expenseList = [],
  incomeList = [],
  refetchIncomeExpense,
  refetchIncomeSource,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('income')
  const navigation = useNavigation()
  const { mutateAsync: deleteIncomeExpense } = useDeleteIncomeExpense()
  const { mutateAsync: deleteIncomeSource } = useDeleteIncomeSource()
  const toast = useToast()

  const deleteItemHandler = async (type: TabType, id: number) => {
    Alert.alert('Delete', 'Are you sure you want to delete ?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            if (type === 'income') {
              await deleteIncomeSource(id)
              await refetchIncomeSource()
              toast.show({ title: 'Income deleted successfully' })
            }
            if (type === 'expense') {
              await deleteIncomeExpense(id)
              await refetchIncomeExpense()
              toast.show({ title: 'Expense deleted successfully' })
            }
          } catch (error) {
            toast.show({ title: 'Failed to delete the item!' })
          }
        },
      },
    ])
  }

  const editItemHandler = (type: TabType, item: APIIncomeSourceItemType) => {
    navigation.navigate('add-edit-income-expense', { type, editItem: item })
  }

  const onPressAdd = (type: TabType) => {
    navigation.navigate('add-edit-income-expense', { type })
  }

  return (
    <Tabs onValueChange={(val: TabType) => setActiveTab(val)} defaultValue="income" fd="column" w={'100%'} mt={hp(1)}>
      <Tabs.List px={wp(5)} pb={hp(1)} mt={hp(2)}>
        <Tabs.Tab
          bg={activeTab === 'income' ? THEME_COLORS.primary[50] : '$background'}
          w={wp(45)}
          h={hp(5)}
          value="income"
        >
          <Text fontSize={FontSizes.size16} color={activeTab === 'income' ? '$background' : '$foreground'}>
            Income
          </Text>
        </Tabs.Tab>
        <Tabs.Tab
          bg={activeTab === 'expense' ? THEME_COLORS.primary[50] : '$background'}
          w={wp(45)}
          h={hp(5)}
          value="expense"
        >
          <Text fontSize={FontSizes.size16} color={activeTab === 'expense' ? '$background' : '$foreground'}>
            Expense
          </Text>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="income">
        <FlatList
          data={incomeList}
          renderItem={({ item }) => (
            <IncomeExpenseItem
              amount={item.amount}
              title={item.name}
              type={item.type}
              onDelete={() => deleteItemHandler('income', item.id)}
              onEdit={() => editItemHandler('income', item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity style={styles.addFab} onPress={() => onPressAdd('income')}>
          <AntDesign name="plus" color={'white'} size={wp(6)} />
        </TouchableOpacity>
      </Tabs.Content>
      <Tabs.Content value="expense">
        <FlatList
          data={expenseList}
          renderItem={({ item }) => (
            <IncomeExpenseItem
              amount={item.amount}
              title={item.name}
              type={item.type}
              onDelete={() => deleteItemHandler('expense', item.id)}
              onEdit={() => editItemHandler('expense', item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.addFab} onPress={() => onPressAdd('expense')}>
          <AntDesign name="plus" color={'white'} size={wp(6)} />
        </TouchableOpacity>
      </Tabs.Content>
    </Tabs>
  )
}

export default IncomeStatementTabs

const styles = StyleSheet.create({
  listContent: {
    marginTop: hp(1),
    paddingBottom: hp(70),
    rowGap: hp(1.5),
    paddingHorizontal: wp(5),
  },
  addFab: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: THEME_COLORS.primary[50],
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: wp(6),
    top: hp(41),
  },
})
