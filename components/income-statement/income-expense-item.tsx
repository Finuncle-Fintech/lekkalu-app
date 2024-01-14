import React, { FC, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, View, useTheme } from 'tamagui'
import { Feather } from '@expo/vector-icons'
import { Menu, MenuItem } from 'react-native-material-menu'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

interface IIncomeExpenseItemProps {
  onEdit: () => void
  onDelete: () => void
}

const IncomeExpenseItem: FC<IIncomeExpenseItemProps> = ({ onDelete = () => {}, onEdit = () => {} }) => {
  const [visible, setVisible] = useState(false)
  const theme = useTheme()

  const showMenu = () => {
    setVisible(true)
  }

  const hideMenu = () => {
    setVisible(false)
  }

  const handleEditPress = () => {
    onEdit()
    hideMenu()
  }

  const handleDeletePress = () => {
    onDelete()
    hideMenu()
  }

  return (
    <View
      bg="$background"
      py={hp(1.5)}
      px={wp(4)}
      elevationAndroid={4}
      shadowColor={'black'}
      shadowOffset={{ height: 0, width: 0 }}
      shadowOpacity={0.1}
      shadowRadius={wp(4)}
      br={wp(2)}
      fd="row"
      ai="center"
      jc="space-between"
    >
      <View f={1} rowGap={hp(0.5)} pr={wp(2)}>
        <Text fontFamily={'$body'} color={'$foreground'} fontSize={FontSizes.size20}>
          Hello
        </Text>
        <Text color={'$gray9Dark'} fontFamily={'$body'} fontSize={FontSizes.size15}>
          Hello
        </Text>
      </View>
      <View ai="flex-end" rowGap={hp(1)}>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Feather size={wp(4)} name="more-vertical" color={theme.foreground.get()} />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          style={{ backgroundColor: theme.backgroundHover.get() }}
        >
          <MenuItem textStyle={{ color: theme.foreground.get(), fontSize: FontSizes.size16 }} onPress={handleEditPress}>
            Edit
          </MenuItem>
          <MenuItem textStyle={{ color: 'red', fontSize: FontSizes.size16 }} onPress={handleDeletePress}>
            Delete
          </MenuItem>
        </Menu>
        <Text fontFamily={'$body'} fontSize={FontSizes.size18}>
          $ 20,000
        </Text>
      </View>
    </View>
  )
}

export default IncomeExpenseItem
