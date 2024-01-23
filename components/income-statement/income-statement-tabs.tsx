import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { Tabs, Text } from 'tamagui'
import { useNavigation } from 'expo-router'

import { hp, wp } from '@/utils/responsive'
import IncomeExpenseItem from './income-expense-item'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'

const IncomeStatementTabs = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')
  const navigation = useNavigation()

  const deleteItemHandler = () => {}

  const editItemHandler = (type: 'income' | 'expense') => {
    navigation.navigate('add-edit-income-expense', { type, editItem: { id: 1, name: '' } })
  }

  const onPressAdd = (type: 'income' | 'expense') => {
    navigation.navigate('add-edit-income-expense', { type })
  }

  return (
    <Tabs onValueChange={setActiveTab} defaultValue="income" fd="column" w={'100%'} jc="center" mt={hp(4)}>
      <Tabs.List px={wp(5)} pb={hp(1)} mt={hp(2)}>
        <Tabs.Tab
          bg={activeTab === 'income' ? THEME_COLORS.primary[50] : '$background'}
          w={wp(45)}
          h={hp(5)}
          value="income"
        >
          <Text fontSize={FontSizes.size15} color={activeTab === 'income' ? '$background' : '$foreground'}>
            Income
          </Text>
        </Tabs.Tab>
        <Tabs.Tab
          bg={activeTab === 'expense' ? THEME_COLORS.primary[50] : '$background'}
          w={wp(45)}
          h={hp(5)}
          value="expense"
        >
          <Text fontSize={FontSizes.size15} color={activeTab === 'expense' ? '$background' : '$foreground'}>
            Expense
          </Text>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="income">
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          renderItem={() => <IncomeExpenseItem onDelete={deleteItemHandler} onEdit={() => editItemHandler('income')} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity style={styles.addFab} onPress={() => onPressAdd('income')}>
          <AntDesign name="plus" color={'white'} size={wp(6)} />
        </TouchableOpacity>
      </Tabs.Content>
      <Tabs.Content value="expense">
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          renderItem={() => (
            <IncomeExpenseItem onDelete={deleteItemHandler} onEdit={() => editItemHandler('expense')} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: hp(58),
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
