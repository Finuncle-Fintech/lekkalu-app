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

import { AccountAssets, CashAssets, PhysicalAsset, PropertyAssets } from '@/types/balance-sheet'
import {
  AddAccountFundAssetSchema,
  AddPropertyAssetSchema,
  addAccountFundAssetSchema,
  addPropertyAssetSchema,
} from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import InputFields from '../input-fields'
import { ASSET_INPUTS, UNIT_OF_AREA } from './config'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { SelectAssetsItem } from './select-assets-item'
import FormControl from '@/components/form-control'
import { Controller } from 'react-hook-form'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { SelectAreaUnit } from './select-area-item'
const { width, height } = Dimensions.get('window')

type AddRealEstatePropertyDialogProps = {
  showAssetsDialog: any
  setAddAssetsDialogVisibility: (type: any) => void
  asset?: PropertyAssets
}

export default function AddRealEstatePropertyAssetsDialog({
  showAssetsDialog,
  setAddAssetsDialogVisibility,
  asset,
}: AddRealEstatePropertyDialogProps) {
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const title = isEdit ? 'Edit Asset' : 'Add Asset'
  const theme = useTheme()
  const systemTheme = useColorScheme()
  const [date, setDate] = useState(new Date())
  const [isOpenDatePicker, setOpenDatePicker] = useState(false)
  const [selectedAssetstype, setSelectedAssetsType] = useState(UNIT_OF_AREA?.[0]?.name || '')

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddPropertyAssetSchema>({
    resolver: zodResolver(addPropertyAssetSchema),
    defaultValues: {
      area: asset?.area ? Number(asset.area) : 0,
      land: asset?.land ? String(asset.land) : '',
      pincode: asset?.pincode ? Number(asset.pincode) : 0,
      purchase_value: asset?.purchase_value ? Number(asset.purchase_value) : undefined,
      purchase_date: asset?.purchase_date ? String(asset.purchase_date) : '',
    },
  })

  const handleAddAssets = (values: AddPropertyAssetSchema) => {
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
            // animation="quick"
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
                <Text fontSize={FontSizes.size30}>Real Estate Property</Text>
                  <Button size="$1" circular icon={X} onPress={() => setAddAssetsDialogVisibility(false)} />
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                  Pincode
                </FormControl.Label>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Enter your pincode"
                      onChangeText={field.onChange}
                    />
                  )}
                />
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                  Area
                </FormControl.Label>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <View flexDirection="row" alignItems="center" gap={12}>
                      <Input
                        fontSize={FontSizes.size15}
                        h={hp(6)}
                        br={wp(1.8)}
                        placeholder="Enter area"
                        onChangeText={field.onChange}
                        flex={1}
                      />
                      <SelectAreaUnit
                        id="select-unit-of-area-list"
                        setSelectedAssetsType={setSelectedAssetsType}
                        selectedAssetstype={selectedAssetstype}
                        items={UNIT_OF_AREA}
                      />
                    </View>
                  )}
                />
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                  Land/Building
                </FormControl.Label>
                <Controller
                  name="land"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      placeholder="Enter your land/building name"
                      onChangeText={field.onChange}
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
                onPress={handleSubmit(handleAddAssets)}
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
