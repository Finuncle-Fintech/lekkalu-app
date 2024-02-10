import React, { FC } from 'react'
import { Text, View } from 'tamagui'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import Card from '../card/card'
import { formatNumberToCurrency } from '@/utils/helpers'
import EditDeleteMenu from '../edit-delete-menu'

interface IIncomeExpenseItemProps {
  onEdit: () => void
  onDelete: () => void
  title: string
  type: string
  amount: string
}

const IncomeExpenseItem: FC<IIncomeExpenseItemProps> = (props) => {
  const { onDelete, onEdit, amount, title, type } = props

  return (
    <Card mx={0} br={wp(2)} fd="row" ai="center" jc="space-between">
      <View f={1} rowGap={hp(0.5)} pr={wp(2)}>
        <Text fontFamily={'$body'} color={'$foreground'} fontSize={FontSizes.size20}>
          {title}
        </Text>
        <Text color={'$gray9Dark'} fontFamily={'$body'} fontSize={FontSizes.size15}>
          {type}
        </Text>
      </View>
      <View ai="flex-end" rowGap={hp(1)}>
        <EditDeleteMenu onDelete={onDelete} onEdit={onEdit} />
        <Text fontFamily={'$body'} fontSize={FontSizes.size18}>
          {formatNumberToCurrency(+amount)}
        </Text>
      </View>
    </Card>
  )
}

export default IncomeExpenseItem
