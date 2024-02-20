import { AddIcon, Button, VStack } from 'native-base'
import { Link } from 'expo-router'
import { useTheme } from 'tamagui'
import ExpenseList from '@/components/expense-list'
import { FontSizes } from '@/utils/fonts'
import { wp } from '@/utils/responsive'

export default function Expenses() {
  const theme = useTheme()
  return (
    <VStack flex={1} p={4} space={4} bg={theme.backgroundHover.get()}>
      <Link href="/create-expense" asChild>
        <Button _text={{ style: { fontSize: FontSizes.size16, padding: wp(1) } }} startIcon={<AddIcon size={wp(4)} />}>
          Create Expense
        </Button>
      </Link>

      <ExpenseList />
    </VStack>
  )
}
