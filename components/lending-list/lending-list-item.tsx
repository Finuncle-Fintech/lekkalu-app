import React from 'react'
import { HStack, Text, VStack } from 'native-base'
import moment from 'moment'
import { Menu, MenuItem } from 'react-native-material-menu'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { View, useTheme } from 'tamagui'
import { describeTransaction } from '@/utils/lending'
import DeleteTransaction from '@/components/delete-transaction/delete-transaction'
import { Transaction } from '@/types/lending'
import { FontSizes } from '@/utils/fonts'
import { wp } from '@/utils/responsive'
import CreateOrEditLendingTransaction from '../create-or-edit-lending-transaction'
import useToggle from '@/hooks/use-toggle'

const LendingListItem = ({ item, accountHistory }: { item: Transaction; accountHistory: Transaction[] }) => {
  // * hooks
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isOpen, closeModal, openModal } = useToggle()

  return (
    <VStack
      space={4}
      bg={theme.background.get()}
      rounded="md"
      p="3"
      shadow="sm"
      mb="4"
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-between'}
    >
      <View flex={1} mr={wp(3)}>
        <HStack alignItems="center" space={2}>
          <HStack flexDir={'column'} space={2}>
            <HStack space={1} alignItems="baseline">
              {item.reference_no && (
                <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600">
                  {item.reference_no} •
                </Text>
              )}
              <Text color={theme.gray10.get()} fontSize={FontSizes.size16} fontWeight="500">
                {moment(item.time).format('MMM DD, YYYY')}
              </Text>
              {item.payment_method && (
                <Text
                  borderColor={'primary.600'}
                  borderWidth={1}
                  borderRadius={wp(10)}
                  fontSize={FontSizes.size15}
                  paddingX={3}
                  marginX={2}
                >
                  {item.payment_method}
                </Text>
              )}
            </HStack>
            {item.note && (
              <Text maxWidth={wp(48)} color={theme.foreground.get()} fontSize={FontSizes.size15}>
                {item.note.length > 55 ? item.note.substring(0, 55) + '...' : item.note}
              </Text>
            )}
            <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
              {describeTransaction(item.amount)}
            </Text>
          </HStack>
        </HStack>
      </View>
      <HStack alignItems="center" space={2}>
        <Menu
          visible={isOpen}
          anchor={
            <TouchableOpacity onPress={openModal}>
              <Feather size={wp(4)} name="more-vertical" color={theme.foreground.get()} />
            </TouchableOpacity>
          }
          onRequestClose={closeModal}
          style={{ backgroundColor: theme.backgroundHover.get() }}
        >
          <CreateOrEditLendingTransaction
            lending_account={id}
            transaction={item}
            afterFn={closeModal}
            trigger={
              <MenuItem textStyle={{ color: theme.foreground.get(), fontSize: FontSizes.size16 }}>Edit</MenuItem>
            }
          />
          <DeleteTransaction
            afterFn={closeModal}
            trigger={<MenuItem textStyle={{ color: 'red', fontSize: FontSizes.size16 }}>Delete</MenuItem>}
            transactions={accountHistory}
            id={item.id}
          />
        </Menu>
      </HStack>
    </VStack>
  )
}

export default LendingListItem
