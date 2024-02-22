import { useEffect, useState } from 'react'
import { useToast } from 'native-base'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { omit, round } from 'lodash'
import { Text, View, useTheme, Input } from 'tamagui'
import { CalendarDays, X } from '@tamagui/lucide-icons'
import { Button, Dialog, XStack } from 'tamagui'
import { Dimensions, useColorScheme } from 'react-native'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import {
  SetBudgetSchema,
  SetBudgetSchema2,
  UpdateBudgetSchema,
  setBudgetSchema,
  setBudgetSchema2,
  updateBudgetSchema,
} from '@/schema/budget'
import FormControl from '../form-control/form-control'
import { hp, wp } from '@/utils/responsive'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import CustomButton from '../custom-button'
import { formatDate } from '@/utils/fn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBudgets, getSingleMonthBudget, setBudget, updateBudget } from '@/queries/budget'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import dayjs from 'dayjs'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { Budget } from '@/types/budget'
const { width, height } = Dimensions.get('window')

type AddOrEditBudgetProps = {
  title: string
  asset?: SetBudgetSchema
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
}

export default function CreateOrEditBudget({
  title,
  asset,
  showModal,
  setShowModal,
  isEdit = false,
}: AddOrEditBudgetProps) {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(new Date())
  const [isOpenDatePicker, setOpenDatePicker] = useState(false)
  const [isSelectedMonthExist, setSelectedMonthExist] = useState(false)

  const toast = useToast()

  const { data, isFetching } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  useEffect(() => {
    if (showModal && asset) {
      setDate(new Date(asset.month))
    }
  }, [showModal])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SetBudgetSchema2>({
    resolver: zodResolver(setBudgetSchema2),
    defaultValues: {
      ...omit(asset, 'id'),
      limit: asset?.limit ? Number(asset.limit) : undefined,
      month: asset?.month
        ? dayjs().set('month', Number(asset.month)).format(SERVER_DATE_FORMAT)
        : dayjs().set('month', Number(new Date().getMonth())).format(SERVER_DATE_FORMAT),
    },
  })

  const setBudgetMutation = useMutation({
    mutationFn: setBudget,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
      })
      reset({})
      setShowModal(false)
      toast.show({ title: 'Budget set successfully!' })
    },
    onError() {
      setShowModal(false)
      toast.show({ title: 'Something went wrong while setting budget. Please try again!' })
    },
  })

  const handleAddBudget = async (values: SetBudgetSchema2) => {
    console.log(values)

    const isExist = await getSingleMonthBudget(new Date(date), data || [])

    if (!isExist) {
      setBudgetMutation.mutate({
        limit: parseFloat(Number(values.limit).toFixed(2)),
        month: dayjs(date).format('YYYY-MM-DD'),
      })
    } else {
      setSelectedMonthExist(true)
    }
  }

  const updateBudgetMutation = useMutation({
    mutationFn: async (dto: SetBudgetSchema2) => {
      if (asset?.id) {
        return updateBudget(asset.id, dto)
      } else {
        throw new Error('Asset ID is undefined')
      }
    },
    onError() {
      setShowModal(false)
      toast.show({ title: 'Something went wrong while edit budget. Please try again!' })
    },
    onSuccess(data) {      
      queryClient.setQueryData([BUDGET_QUERY_KEYS.BUDGETS], (oldBudgetList: Budget[]) =>
        oldBudgetList.map((budget: Budget) => {
          if (budget.id === data.data.id) {
            return {              
              ...data.data,
              limit: Number(data.data.limit).toFixed(2)
            }
          }
          return budget
        }),
      )

      setShowModal(false)
      toast.show({
        title: 'Budget edited successfully!',
      })
    },
  })

  function handleUpdateBudget(values: SetBudgetSchema2) {
    updateBudgetMutation.mutate({
      limit: parseFloat(Number(values.limit).toFixed(2)),
      month: values.month,
    })
  }

  const handleCancelPress = () => {
    setShowModal(false)
  }

  return (
    <>
      <Dialog modal open={showModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"            
          />

          <Dialog.Content
            bordered
            elevate
            key="content"            
            gap="$2"
          >
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 50} alignItems="center">
                <Text fontSize={FontSizes.size30}>{title}</Text>
                <Dialog.Close asChild>
                  <Button size="$2" circular icon={X} onPress={() => setShowModal(false)} />
                </Dialog.Close>
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20} isRequired>
                  Limit
                </FormControl.Label>
                <Controller
                  name="limit"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      defaultValue={asset?.limit?.toString() || ''}
                      br={wp(1.8)}
                      inputMode="numeric"
                      keyboardType="numeric"
                      placeholder="Enter Limit"
                      onChangeText={field.onChange}
                    />
                  )}
                />

                <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.limit?.message}</FormControl.ErrorMessage>
              </FormControl>
            </View>

            {!isEdit && (
              <View>
                <FormControl>
                  <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                    Month
                  </FormControl.Label>
                  <Controller
                    name="month"
                    control={control}
                    render={({ field }) => (
                      <View flexDirection="row" alignItems="center">
                        <Input
                          fontSize={FontSizes.size15}
                          h={hp(6)}
                          br={wp(1.8)}
                          keyboardType="numeric"
                          placeholder="Select budget month"
                          defaultValue={asset?.month}
                          value={dayjs(date).format('MMMM YYYY')}
                          disabled={true}
                          flex={1}
                        />
                        <CalendarDays
                          onPress={() => setOpenDatePicker(true)}
                          size="$1"
                          style={{ position: 'absolute', right: 8 }}
                          color={THEME_COLORS.primary[700]}
                        />
                      </View>
                    )}
                  />
                  {isSelectedMonthExist && (
                    <FormControl.ErrorMessage fontSize={FontSizes.size15}>
                      Budget already alloted for this month.
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>
              </View>
            )}

            <XStack marginTop={'$2'} gap={10} justifyContent="space-between">
              <CustomButton
                isDisable={updateBudgetMutation.isPending || setBudgetMutation.isPending}
                onPress={() => handleCancelPress()}
                hasLikeOutline={true}
                text="Cancel"
              />

              <CustomButton
                isLoading={updateBudgetMutation.isPending || setBudgetMutation.isPending}
                onPress={isEdit ? handleSubmit(handleUpdateBudget) : handleSubmit(handleAddBudget)}
                text="Save"
              />
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
        {isOpenDatePicker && (
          <RNDateTimePicker
            value={date}
            display="calendar"
            onChange={(event, selectedDate) => {
              if (selectedDate !== undefined) {
                setOpenDatePicker(false)
                setDate(selectedDate)
                setSelectedMonthExist(false)
              }
            }}
          />
        )}
      </Dialog>
    </>
  )
}
