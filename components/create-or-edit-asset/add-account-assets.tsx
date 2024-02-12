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

import { AccountAssets, CashAssets, PhysicalAsset } from '@/types/balance-sheet'
import {
    AddAccountFundAssetSchema,  
  addAccountFundAssetSchema,  
} from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import InputFields from '../input-fields'
import { ASSET_INPUTS } from './config'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { SelectAssetsItem } from './select-assets-item'
import FormControl from '@/components/form-control'
import { Controller } from 'react-hook-form'
const { width, height } = Dimensions.get('window')

type AddAccountAssetsDialogProps = {
  showAssetsDialog: any
  setAddAssetsDialogVisibility: (type: any) => void
  asset?: AccountAssets
}

export default function AddAccountAssetsDialog({
  showAssetsDialog,
  setAddAssetsDialogVisibility,
  asset,
}: AddAccountAssetsDialogProps) {
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
  } = useForm<AddAccountFundAssetSchema>({
    resolver: zodResolver(addAccountFundAssetSchema),
    defaultValues: {      
      account_name: asset?.account_name ? String(asset.account_name) : '',
      balance: asset?.balance ? Number(asset.balance) : 0,
      interrest_rate: asset?.interrest_rate ? Number(asset.interrest_rate) : 0,
    },
  })

  const handleAddAssets = (values: AddAccountFundAssetSchema) => {
    setAddAssetsDialogVisibility(false);
    toast.show({
      title:'Assets added successfully !!'
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
            // animation="bouncy"
            // opacity={0.5}
            // enterStyle={{ opacity: 0 }}
            // exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={['transform', 'opacity']}
            // animation={[
            //   'bouncy',
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
                <Text fontSize={FontSizes.size30}>Account</Text>
                  <Button size="$1" circular icon={X} onPress={() => setAddAssetsDialogVisibility(false)} />
              </View>
            </Dialog.Title>
            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20} >Account name</FormControl.Label>
                <Controller
                  name="account_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      placeholder="Enter your account name"
                      onChangeText={field.onChange}
                    />
                  )}
                />
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}  isRequired>
                Balance
                </FormControl.Label>
                <Controller
                  name="balance"
                  control={control}                  
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Enter your balance"
                      onChangeText={field.onChange}

                      // {...field}
                    />
                  )}
                />

                <FormControl.ErrorMessage fontSize={FontSizes.size15}>
                  {errors.balance?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            </View>

            <View>
              <FormControl>
                <FormControl.Label fontSize={FontSizes.size16} lineHeight={FontSizes.size20}>
                Interrest Rate
                </FormControl.Label>
                <Controller
                  name="interrest_rate"
                  control={control}                  
                  render={({ field }) => (
                    <Input
                      fontSize={FontSizes.size15}
                      h={hp(6)}
                      br={wp(1.8)}
                      keyboardType="numeric"
                      placeholder="Enter your interrest rate"
                      onChangeText={field.onChange}
                    />
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
                onPress={()=>handleCancelAssets()}
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
      </Dialog>
    </>
  )
}
