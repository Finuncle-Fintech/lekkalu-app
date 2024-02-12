import { cloneElement, useState } from 'react'
import { Modal, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { Text, View, useTheme } from 'tamagui'
import { CalendarDays, X } from '@tamagui/lucide-icons'
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Paragraph,
  Sheet,
  TooltipSimple,
  Unspaced,
  XStack,
} from 'tamagui'
import { Dimensions, useColorScheme } from 'react-native'

import { CashAssets, MutualFundAssets, PhysicalAsset, PhysicalFundAssets } from '@/types/balance-sheet'
import {
  AddNewPhysicalAssetSchema,
  AddPhysicalAssetSchema,
  addNewPhysicalAssetSchema,
  addPhysicalAssetSchema,
} from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import InputFields from '../input-fields'
import { ASSET_INPUTS, PHYSICAL_ASSET_TYPE } from './config'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { SelectAssetsItem } from './select-assets-item'
import FormControl from '@/components/form-control'
import { Controller } from 'react-hook-form'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

const { width, height } = Dimensions.get('window')

type AddPhysicalAssetsDialogProps = {
  showAssetsDialog: any
  setAddAssetsDialogVisibility: (type: any) => void
  asset?: PhysicalFundAssets
}

export default function AddPhysicalAssetsDialog({
  showAssetsDialog,
  setAddAssetsDialogVisibility,
  asset,
}: AddPhysicalAssetsDialogProps) {
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const title = isEdit ? 'Edit Asset' : 'Add Asset'
  const theme = useTheme()
  const systemTheme = useColorScheme()
  const [date, setDate] = useState(new Date())
  const [isOpenDatePicker, setOpenDatePicker] = useState(false)
  const [selectedAssetstype, setSelectedAssetsType] = useState('')

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddNewPhysicalAssetSchema>({
    resolver: zodResolver(addNewPhysicalAssetSchema),
    defaultValues: {
      name: asset?.name ? String(asset.name) : '',
      purchase_value: asset?.purchase_value ? Number(asset.purchase_value) : undefined,
      type: asset?.type ? String(asset.type) : '',
      purchase_date: asset?.purchase_date ? String(asset.purchase_date) : '',
      rate: asset?.rate ? String(asset.rate) : '',
    },
  })

  const handleAddAssets = () => {
    setAddAssetsDialogVisibility(false)
    toast.show({
      title: 'Assets added successfully !!',
    })
  }
  const handleCancelAssets = () => {
    setAddAssetsDialogVisibility(false)
  }

  return (
    <>
      <Dialog modal open={showAssetsDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            // animation="slow"
            // opacity={0.5}
            // enterStyle={{ opacity: 0 }}
            // exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            // animateOnly={['transform', 'opacity']}
            // animation={[
            //   'quick',
            //   {
            //     opacity: {
            //       overshootClamping: true,
            //     },
            //   },
            // ]}
            // enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            // exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$3"
          >
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 50} alignItems="center">
                <Text fontSize={FontSizes.size30}>Physical Assets</Text>
                  <Button size="$1" circular icon={X} onPress={() => setAddAssetsDialogVisibility(false)} />
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                  Name
                </FormControl.Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      placeholder="Enter name"
                      onChangeText={field.onChange}
                      {...field}
                    />
                  )}
                />
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                  Purchase Value
                </FormControl.Label>
                <Controller
                  name="purchase_value"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Enter invested amount"
                      onChangeText={field.onChange}
                    />
                  )}
                />
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                  Purchase Date
                </FormControl.Label>
                <Controller
                  name="purchase_date"
                  control={control}
                  render={({ field }) => (
                    <View flexDirection="row" alignItems="center">
                      <Input
                        fontSize={FontSizes.size15}
                        h={hp(6)}
                        br={wp(1.8)}
                        keyboardType="numeric"
                        placeholder="Enter purchase date"
                        value={date.toLocaleDateString()}
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
              </FormControl>
            </View>

            <SelectAssetsItem
              id="select-physical-assets-list"
              setSelectedAssetsType={setSelectedAssetsType}
              selectedAssetstype={selectedAssetstype}
              items={PHYSICAL_ASSET_TYPE}
            />

            {selectedAssetstype != '' && (
              <View>
                <FormControl>
                  <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                    {selectedAssetstype === 'depreciation' ? 'Depreciation Rate' : 'Appreciation Rate'}
                  </FormControl.Label>
                  <Controller
                    name="rate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        fontSize={FontSizes.size15}
                        h={hp(6)}
                        br={wp(1.8)}
                        keyboardType="numeric"
                        placeholder={
                          selectedAssetstype === 'depreciation'
                            ? 'Enter your depreciation rate'
                            : 'Enter your appreciation rate'
                        }
                        onChangeText={field.onChange}
                      />
                    )}
                  />
                </FormControl>
              </View>
            )}

            <XStack alignSelf="flex-end" marginTop={'$2'} gap={10}>
              <Button
                variant="outlined"
                size="$3"
                paddingHorizontal={'$4'}
                borderWidth={1}
                borderColor={THEME_COLORS.primary[700]}
                onPress={() => handleCancelAssets()}
              >
                Cancel
              </Button>

              <Button
                themeInverse
                size="$3"
                paddingHorizontal={'$5'}
                backgroundColor={THEME_COLORS.primary[700]}
                onPress={() => handleAddAssets()}
              >
                Save
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
        {isOpenDatePicker && (
          <RNDateTimePicker
            maximumDate={new Date()}
            value={date}
            display="calendar"
            onChange={(event, selectedDate) => {
              if (selectedDate !== undefined) {
                setOpenDatePicker(false)
                setDate(selectedDate)
              }
            }}
          />
        )}
      </Dialog>
    </>
  )
}
