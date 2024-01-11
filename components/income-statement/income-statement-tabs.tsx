import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { SizableText, Tabs } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import IncomeExpenseItem from './income-expense-item'
import { THEME_COLORS } from '@/utils/theme'
import AddEditExpenseIncomeModal from './AddEditExpenseIncomeModal'

const IncomeStatementTabs = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')

  const deleteItemHandler = () => {}

  const editItemHandler = () => {}

  return (
    <Tabs onValueChange={setActiveTab} defaultValue="income" fd="column" width={'100%'} jc="center" mt={hp(4)}>
      <Tabs.List px={wp(5)} pb={hp(1)} mt={hp(2)}>
        <Tabs.Tab bg={activeTab === 'income' ? THEME_COLORS.primary[50] : '$background'} w={wp(45)} value="income">
          <SizableText color={activeTab === 'income' ? '$background' : '$foreground'}>Income</SizableText>
        </Tabs.Tab>
        <Tabs.Tab bg={activeTab === 'expense' ? THEME_COLORS.primary[50] : '$background'} w={wp(45)} value="expense">
          <SizableText color={activeTab === 'expense' ? '$background' : '$foreground'}>Expense</SizableText>
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
})
