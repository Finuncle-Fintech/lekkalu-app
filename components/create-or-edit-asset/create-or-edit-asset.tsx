import { cloneElement, useState } from 'react'
import { Modal, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { Text, View, useTheme } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
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

import { PhysicalAsset } from '@/types/balance-sheet'
import { AddPhysicalAssetSchema, addPhysicalAssetSchema } from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import InputFields from '../input-fields'
import { ASSET_INPUTS, ASSET_TYPE } from './config'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { SelectAssetsItem } from './select-assets-item'
import AddCashAssetsDialog from './add-cash-assets'
import AddMutualFundAssetsDialog from './add-mutual-fund-assets'
import AddGoldAssetsDialog from './add-gold-assets'
import AddAccountAssetsDialog from './add-account-assets'
import AddRealEstatePropertyAssetsDialog from './add-real-estate-property'
import AddPhysicalAssetsDialog from './add-physical-assets'
const { width, height } = Dimensions.get('window')

type CreateOrEditAssetProps = {
  asset?: PhysicalAsset
  showModal: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateOrEditAsset({ asset, showModal, setShowModal }: CreateOrEditAssetProps) {
  const [showAssetsDialog, setAddAssetsDialogVisibility] = useState('')
  const [selectedAssetstype, setSelectedAssetsType] = useState('')
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const title = isEdit ? 'Edit Asset' : 'Add Asset'
  const theme = useTheme()
  const systemTheme = useColorScheme()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddPhysicalAssetSchema>({
    resolver: zodResolver(addPhysicalAssetSchema),
    defaultValues: {
      ...omit(asset, 'id'),
      purchase_value: asset?.purchase_value ? Number(asset.purchase_value) : undefined,
      depreciation_percent: asset?.depreciation_percent ? Number(asset.depreciation_percent) : undefined,
      sell_value: asset?.sell_value ? Number(asset.sell_value) : undefined,
      market_value: asset?.sell_value ? Number(asset.market_value) : undefined,
      purchase_date: asset?.purchase_date ? dayjs(asset.purchase_date).toDate() : undefined,
      sell_date: asset?.sell_date ? dayjs(asset.sell_date).toDate() : undefined,
      tags: [],
      type: 1,
      user: 2,
      init_dep: asset?.depreciation_percent ? Number(asset.depreciation_frequency) : 1,
    },
  })

  const addPhysicalAssetMutation = useMutation({
    mutationFn: addPhysicalAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast.show({ title: 'Asset created successfully!' })
      setShowModal(false)
    },
  })

  const editPhysicalAssetMutation = useMutation({
    mutationFn: (dto: AssetCreateOrEditDto) => editPhysicalAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast.show({ title: 'Asset updated successfully!' })
      setShowModal(false)
    },
  })

  const handleAddOrEditPhysicalAsset = (values: AddPhysicalAssetSchema) => {
    const valuesToSubmit = {
      ...values,
      purchase_date: dayjs(values.purchase_date).format(SERVER_DATE_FORMAT),
      sell_date: dayjs(values.sell_date).format(SERVER_DATE_FORMAT),
      depreciation_frequency: monthsToSeconds(values.months) + yearsToSeconds(values.years),
    }

    if (isEdit) {
      editPhysicalAssetMutation.mutate(valuesToSubmit)
      return
    }

    addPhysicalAssetMutation.mutate(valuesToSubmit)
  }

  const renderSelectedDialog = () => {
    console.log('showAssetsDialog--', showAssetsDialog)

    switch (showAssetsDialog) {
      case 'cash':
        return (
          <AddCashAssetsDialog showAssetsDialog={true} setAddAssetsDialogVisibility={setAddAssetsDialogVisibility} />
        )

      case 'mutual fund/equity':
        return (
          <AddMutualFundAssetsDialog
            showAssetsDialog={true}
            setAddAssetsDialogVisibility={setAddAssetsDialogVisibility}
          />
        )

      case 'gold':
        return (
          <AddGoldAssetsDialog showAssetsDialog={true} setAddAssetsDialogVisibility={setAddAssetsDialogVisibility} />
        )

      case 'account':
        return (
          <AddAccountAssetsDialog showAssetsDialog={true} setAddAssetsDialogVisibility={setAddAssetsDialogVisibility} />
        )

      case 'real estate property':
        return (
          <AddRealEstatePropertyAssetsDialog
            showAssetsDialog={true}
            setAddAssetsDialogVisibility={setAddAssetsDialogVisibility}
          />
        )

      case 'physical assets':
        return (
          <AddPhysicalAssetsDialog
            showAssetsDialog={true}
            setAddAssetsDialogVisibility={setAddAssetsDialogVisibility}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* {cloneElement(trigger, {
        onPress: () => {
          setShowModal(true)
        },
      })} */}
      <Dialog modal open={showModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="bouncy"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={['transform', 'opacity']}
            animation={[
              'bouncy',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$2"
          >
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 50} alignItems="center">
                <Text fontSize={FontSizes.size30}>Add assets</Text>
                <Dialog.Close asChild>
                  <Button size="$1" circular icon={X} onPress={() => setShowModal(false)} />
                </Dialog.Close>
              </View>
            </Dialog.Title>
            <Dialog.Description fontSize={FontSizes.size20}>Please select assets category :</Dialog.Description>
            <SelectAssetsItem
              id="select-balance-assets-list"
              setSelectedAssetsType={setSelectedAssetsType}
              selectedAssetstype={selectedAssetstype}
              items={ASSET_TYPE}
            />

            <XStack alignSelf="flex-end" marginTop={'$2'} gap={10}>
              <Button
                variant="outlined"
                size="$3"
                paddingHorizontal={'$4'}
                borderWidth={1}
                borderColor={THEME_COLORS.primary[700]}
                onPress={() => setShowModal(false)}
              >
                Cancel
              </Button>

              <Button
                themeInverse
                size="$3"
                paddingHorizontal={'$5'}
                backgroundColor={THEME_COLORS.primary[700]}
                onPress={() => {
                  if (selectedAssetstype != '') {
                    setShowModal(false)
                    setAddAssetsDialogVisibility(selectedAssetstype)
                  } else {
                    toast.show({
                      title: 'Please select any assets category !!',
                    })
                  }
                }}
              >
                Next
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      {renderSelectedDialog()}
    </>
  )
}
