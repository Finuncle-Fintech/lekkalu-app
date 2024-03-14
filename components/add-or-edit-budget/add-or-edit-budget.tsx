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
  SetBudgetSchema3,
  UpdateBudgetSchema,
  setBudgetSchema,
  setBudgetSchema2,
  setBudgetSchema3,
  updateBudgetSchema,
} from '@/schema/budget'
import FormControl from '../form-control/form-control'
import { hp, wp } from '@/utils/responsive'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import CustomButton from '../custom-button'
import { formatDate, getLastTenYears, getMonthIndex } from '@/utils/fn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBudgets, getSingleMonthBudget, setBudget, updateBudget } from '@/queries/budget'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import dayjs from 'dayjs'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { Budget } from '@/types/budget'
import { SelectMonthYearItem } from './select-month-year'
import Label from '../form-control/components/label'
import { isAxiosError } from 'axios'
import { monthName } from '@/utils/constant/constant'
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

  const toast = useToast()

  const { data, isFetching } = useQuery({
    queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
    queryFn: fetchBudgets,
  })

  useEffect(() => {
    if (showModal && asset) {
      setDate(new Date(asset.month).toString())
    }
    if(!showModal){
      setSelectedMonthExist(false)
    }
  }, [showModal])

  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [isOpenDatePicker, setOpenDatePicker] = useState(false)
  const [isSelectedMonthExist, setSelectedMonthExist] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const monthData: string[] = monthName;
  const yearData: string[] = getLastTenYears()

  const [selectedMonth, setSelectedMonth] = useState<string>(monthData[new Date().getMonth()])
  const [selectedYear, setSelectedYear] = useState<string>(yearData[0])

  useEffect(() => {
    setSelectedMonthExist(false)
    const month = getMonthIndex(selectedMonth)
    const customDate = dayjs(new Date(`${Number(selectedYear)}-${month+1}`)).format('YYYY-MM-DD')
    setDate(customDate)
    console.log('customDate',customDate)
  }, [selectedMonth, selectedYear])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SetBudgetSchema3>({
    resolver: zodResolver(setBudgetSchema3),
    defaultValues: {
      ...omit(asset, 'id'),
      limit: asset?.limit ? Number(asset.limit) : undefined,
    },
  })

  const setBudgetMutation = useMutation({
    mutationFn: setBudget,
    onSuccess : async () => {
      await queryClient.invalidateQueries({
        queryKey: [BUDGET_QUERY_KEYS.BUDGETS],
      })
      reset({})
      setSelectedMonth(monthData[new Date().getMonth()])
      setSelectedYear(yearData[0])
      setShowModal(false)
      toast.show({ title: 'Budget set successfully!' })
    },
    onError: async (error) => {
      // queryClient.setQueryData([BUDGET_QUERY_KEYS.BUDGETS], context?.previousData);
      setShowModal(false)
      if (isAxiosError(error)) {
        console.log(error)
        toast.show({ title: error?.message })
        return
      }
      console.log(error)
      toast.show({ title: 'Something went wrong while setting budget. Please try again!' })
    },
  })

  const handleAddBudget = async (values: SetBudgetSchema3) => {
    console.log(values)

    const isExist = await getSingleMonthBudget(new Date(date), data || [])

    if (!isExist) {
      setBudgetMutation.mutate({
        limit: parseFloat(Number(values.limit).toFixed(2)),
        month: dayjs(date).format('YYYY-MM-DD'),
        year: selectedYear,
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
    onError: async (error) => {
      // queryClient.setQueryData([BUDGET_QUERY_KEYS.BUDGETS], context?.previousData);
      setShowModal(false)
      if (isAxiosError(error)) {
        console.log(error)
        toast.show({ title: error?.message })
        return
      }
      console.log(error)
      toast.show({ title: 'Something went wrong while edit budget. Please try again!' })
    },
    onSuccess(data) {
      queryClient.setQueryData([BUDGET_QUERY_KEYS.BUDGETS], (oldBudgetList: Budget[]) =>
        oldBudgetList.map((budget: Budget) => {
          if (budget.id === data.data.id) {
            return {
              ...data.data,
              limit: Number(data.data.limit).toFixed(2),
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

  function handleUpdateBudget(values: SetBudgetSchema3) {
    updateBudgetMutation.mutate({
      limit: parseFloat(Number(values.limit).toFixed(2)),
      month: asset?.month || '',
      year: asset?.year || '',
    })
  }

  const handleCancelPress = () => {
    setShowModal(false)
  }

  return (
    <>
      <Dialog modal open={showModal}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" />

          <Dialog.Content bordered elevate key="content" gap={wp(2)}>
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 50} alignItems="center">
                <Text fontSize={FontSizes.size26} adjustsFontSizeToFit>{title}
                  {isEdit && asset && <Text fontSize={FontSizes.size26} adjustsFontSizeToFit>{' (' + formatDate(asset?.month,'MMM, YYYY') + ')'}</Text>}
                </Text>
                <Dialog.Close asChild>
                  <Button size="$2" circular icon={X} onPress={() => setShowModal(false)} />
                </Dialog.Close>
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label
                  fontSize={FontSizes.size16}
                  lineHeight={FontSizes.size20}
                  isRequired                 
                >
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
              <>
                <View>
                  <Label children={'Month'} fontSize={FontSizes.size16} lineHeight={FontSizes.size20} isRequired />
                  <View flexDirection="row" alignItems="center">
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Select month please"
                      value={selectedMonth}
                      disabled={true}
                      flex={1}
                    />
                    <CalendarDays
                      onPress={() => setShowMonthPicker(true)}
                      size="$1"
                      style={{ position: 'absolute', right: 8 }}
                      color={THEME_COLORS.primary[700]}
                    />
                  </View>
                  {isSelectedMonthExist && (
                    <FormControl.ErrorMessage fontSize={FontSizes.size15}>
                      Budget already alloted for this month.
                    </FormControl.ErrorMessage>
                  )}
                </View>
                
                <View>
                  <Label children={'Year'} fontSize={FontSizes.size16} lineHeight={FontSizes.size20} isRequired />
                  <View flexDirection="row" alignItems="center">
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Enter year please"
                      value={selectedYear}
                      disabled={true}
                      flex={1}
                    />
                    <CalendarDays
                      onPress={() => setShowYearPicker(true)}
                      size="$1"
                      style={{ position: 'absolute', right: 8 }}
                      color={THEME_COLORS.primary[700]}
                    />
                  </View>                 
                </View>
              </>
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
      </Dialog>
      <SelectMonthYearItem
        items={monthData}
        placeHolder="Select month"
        selectedItem={selectedMonth}
        setSelectedItem={setSelectedMonth}
        showPicker={showMonthPicker}
        setShowPicker={setShowMonthPicker}
      />

      <SelectMonthYearItem
        items={yearData}
        placeHolder="Select year"
        selectedItem={selectedYear}
        setSelectedItem={setSelectedYear}
        showPicker={showYearPicker}
        setShowPicker={setShowYearPicker}
      />
    </>
  )
}
