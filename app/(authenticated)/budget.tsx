import { Button, FlatList, HStack, IconButton, Text, VStack, useToast } from 'native-base'
import { useEffect, useState } from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { View, useTheme } from 'tamagui'
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

export type Budget = {
  id: number
  limit: number
  month: string
}

export default function BudgetList() {
  const queryClient = useQueryClient()
  const theme = useTheme()
  // const [budgetList, setBudgetList] = useState<Budget[]>([])
  // const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditDate] = useState<Budget>()

  const { top } = useSafeAreaInsets()
  const toast = useToast()

  const { data, isFetching,isRefetching,refetch  } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: (_, deletedBudgetId) => {
      queryClient.setQueryData<Budget[]>([BUDGET_QUERY_KEYS.BUDGETS], (prevData) => {
        if (!prevData) return []

        return prevData.filter((b) => b.id !== deletedBudgetId)
      })

      toast.show({ title: 'Budget deleted successfully!' })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.show({ title: error?.response?.data?.message })
        return
      }
      toast.show({ title: 'Something went wrong.' })
    },
  })


  function handleDeleteBudget(id: number) {
    deleteBudgetMutation.mutate(id)
  }

  const onRefresh = async () => {
    await refetch();
  };

  return (
    <>
      {isFetching || deleteBudgetMutation?.isPending && <LoaderOverlay />}
      <View f={1} pt={top + hp(2)}  marginHorizontal={wp(5)}>
        <View flexDirection="row" gap={wp(4)} alignItems="center" marginBottom={hp(2)}>
          <BackButton onPress={() => router.replace('/expenses')} />
          <Text fontSize={FontSizes.size26} fontWeight={'500'}>
            Your list of budgets
          </Text>
        </View>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={data ?? []}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!isFetching ? <EmptyContent title="No budget has been set yet!" /> : null}
          contentContainerStyle={data?.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : null}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={['#0000ff']} // Customize the refresh indicator colors
              tintColor="#0000ff" // Customize the color of the refresh indicator
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
                    {dayjs(item?.month).format('MMMM')}
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
                    size={6}
                    variant="solid"
                    _icon={{
                      as: EvilIcons,
                      name: 'pencil',
                      size: 5,
                    }}
                    onPress={() => {
                      setShowModal(true)
                      setEditDate(item)
                    }}
                  />
                </View>
                <View>
                  <IconButton
                    size={6}
                    variant="solid"
                    colorScheme="danger"
                    _icon={{
                      as: EvilIcons,
                      name: 'trash',
                      size: 5,
                    }}
                    onPress={() => {
                      handleDeleteBudget(item?.id);
                    }}
                  />
                </View>
              </Button.Group>
            </VStack>
          )}
        />
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
