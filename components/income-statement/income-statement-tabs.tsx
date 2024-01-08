import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { SizableText, Tabs, useTheme } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import IncomeExpenseItem from './income-expense-item'
import { THEME_COLORS } from '@/utils/theme'
import AddEditExpenseIncomeModal from './AddEditExpenseIncomeModal'

const IncomeStatementTabs = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')

  const theme = useTheme()

  const deleteItemHandler = () => {}

  const editItemHandler = () => {}

  return (
    <Tabs onValueChange={setActiveTab} defaultValue="income" style={styles.tabs}>
      <Tabs.List style={styles.tabsList}>
        <Tabs.Tab
          backgroundColor={activeTab === 'income' ? THEME_COLORS.primary[50] : theme.background.val}
          style={styles.tabTile}
          value="income"
        >
          <SizableText color={activeTab === 'income' ? theme.background.val : theme.foreground.val}>Income</SizableText>
        </Tabs.Tab>
        <Tabs.Tab
          backgroundColor={activeTab === 'expense' ? THEME_COLORS.primary[50] : theme.background.val}
          style={styles.tabTile}
          value="expense"
        >
          <SizableText color={activeTab === 'expense' ? theme.background.val : theme.foreground.val}>
            Expense
          </SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="income">
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          renderItem={() => <IncomeExpenseItem onDelete={deleteItemHandler} onEdit={editItemHandler} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity style={styles.addFab}>
          <AntDesign name="plus" color={'white'} size={wp(6)} />
        </TouchableOpacity>
      </Tabs.Content>
      <Tabs.Content value="expense">
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          renderItem={() => <IncomeExpenseItem onDelete={deleteItemHandler} onEdit={editItemHandler} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.addFab}>
          <AntDesign name="plus" color={'white'} size={wp(6)} />
        </TouchableOpacity>
      </Tabs.Content>

      <AddEditExpenseIncomeModal type={activeTab} />
    </Tabs>
  )
}

export default IncomeStatementTabs

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    marginTop: hp(4),
  },
  listContent: {
    marginTop: hp(1),
    paddingBottom: hp(49),
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
    bottom: 0,
    right: wp(2),
  },
  tabTile: {
    width: wp(45),
  },
  tabsList: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
    marginTop: hp(2),
  },
})
