import { Button, FlatList, HStack, IconButton, VStack, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { Text, View, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { RefreshControl, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackButton from '@/components/back-button'
import LoaderOverlay from '@/components/loader-overlay'
import EmptyContent from '@/components/empty-content'
import CreateOrEditBudget from '@/components/add-or-edit-budget/add-or-edit-budget'
import dayjs from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import { deleteBudget, fetchBudgets } from '@/queries/budget'
import { isAxiosError } from 'axios'
import { Budget } from '@/types/budget'

export default function BudgetList() {
  const queryClient = useQueryClient()
  const theme = useTheme()
  // const [budgetList, setBudgetList] = useState<Budget[]>([])
  // const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditDate] = useState<Budget>()

  const { top } = useSafeAreaInsets()
  const toast = useToast()

  const { data, isFetching, isRefetching, isLoading, refetch } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })
  const [sortedBudgetList, setSortedBudgetList] = useState<Budget[]>([])

  
  useEffect(()=>{
    refetch()
  },[])

  console.log(isFetching,isLoading,isRefetching);
  

  function sortBudgetData(budgetData: Budget[]): Budget[] {
    try {
      budgetData?.forEach((item) => {
        const [year, month] = item.month.split('-')
        item.month = new Date(parseInt(year), parseInt(month)).toISOString().substr(0, 7)
      })
  
      const sortedBudgetData = budgetData.sort((a, b) => b.month.localeCompare(a.month))
  
      return sortedBudgetData 
    } catch (error: any) {
      console.log(error?.message);
      return [];      
    }    
  }

  useEffect(() => {    
    setSortedBudgetList(sortBudgetData(data || []))
  }, [data])

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onMutate: async (deleteBudgetId: number) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [BUDGET_QUERY_KEYS.BUDGETS] })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData([BUDGET_QUERY_KEYS.BUDGETS])

      // Optimistically update to the new value
      queryClient.setQueryData([BUDGET_QUERY_KEYS.BUDGETS], (oldBudgetList: Budget[]) =>
        oldBudgetList.filter((budget: Budget) => budget.id != deleteBudgetId),
      )
      return { previousData }
    },
    onSuccess: (_, deletedBudgetId) => {
      console.log('Budget Deleted !! ')
      // toast.show({ title: 'Budget deleted successfully!' })
    },
    onError: async (error, deleteBudgetId, context) => {
      // queryClient.setQueryData([BUDGET_QUERY_KEYS.BUDGETS], context?.previousData);
      if (isAxiosError(error)) {
        console.log(error)
        toast.show({ title: error?.message })
        return
      }
      console.log(error)
      toast.show({ title: `${error?.message}` })
      await refetch()
    },
  })

  function handleDeleteBudget(id: number) {
    deleteBudgetMutation.mutate(id)
  }

  const onRefresh = async () => {
    await refetch()
  }

  return (
    <>
      {(isLoading || deleteBudgetMutation.isPending) && <LoaderOverlay />}
      <View f={1} bg="$backgroundHover">
        <View pt={top + hp(2)} marginHorizontal={wp(5)} flex={1}>
          <View flexDirection="row" gap={wp(4)} alignItems="center" marginBottom={hp(2)}>
            <BackButton onPress={() => router.replace('/expenses')} />
            <Text fontSize={FontSizes.size26} fontWeight={'500'} adjustsFontSizeToFit fontFamily={'$heading'}>
              Your list of budgets
            </Text>
          </View>
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={sortedBudgetList ?? []}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={data?.length === 0 ? <EmptyContent title="No budget has been set yet!" /> : null}
            contentContainerStyle={sortedBudgetList?.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : null}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={onRefresh}
                colors={[THEME_COLORS.brand[900]]} // Customize the refresh indicator colors
                tintColor={THEME_COLORS.brand[900]} // Customize the color of the refresh indicator
              />
            }
            renderItem={({ item }) => (
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
                  <HStack space={1}>
                    <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                      Month :{' '}
                    </Text>
                    <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600">
                      {dayjs(item?.month).format('MMMM YYYY')}
                    </Text>
                  </HStack>
                  <HStack space={1} display={'flex'} flexWrap={'wrap'}>
                    <Text color={theme.foreground.get()} fontSize={FontSizes.size18}>
                      Limit :{' '}
                    </Text>
                    <Text color={theme.foreground.get()} fontSize={FontSizes.size18} fontWeight="600" flex={1}>
                      ₹ {item?.limit}
                    </Text>
                  </HStack>
                </View>
                <Button.Group display={'flex'} alignItems={'center'}>
                  <View>
                    <IconButton
                      size={wp(6)}
                      variant="solid"
                      _icon={{
                        as: EvilIcons,
                        name: 'pencil',
                        size: 6,
                      }}
                      onPress={() => {
                        setShowModal(true)
                        setEditDate(item)
                      }}
                    />
                  </View>
                  <View>
                    <IconButton
                      size={wp(6)}
                      variant="solid"
                      colorScheme="danger"
                      _icon={{
                        as: EvilIcons,
                        name: 'trash',
                        size: 6,
                      }}
                      onPress={() => {
                        handleDeleteBudget(item?.id)
                      }}
                    />
                  </View>
                </Button.Group>
              </VStack>
            )}
          />
        </View>
      </View>
      <CreateOrEditBudget
        setShowModal={setShowModal}
        showModal={showModal}
        title="Edit Budget"
        isEdit={true}
        asset={editData}
      />
    </>
  )
}

const styles = StyleSheet.create({
  back: {
    height: wp(10),
    width: wp(10),
    backgroundColor: THEME_COLORS.primary[100] + 20,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
