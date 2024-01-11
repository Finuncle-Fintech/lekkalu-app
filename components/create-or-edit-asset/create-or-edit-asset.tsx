import { cloneElement, useState } from 'react'
import { Button, Modal, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { Text, useTheme } from 'tamagui'
import { PhysicalAsset } from '@/types/balance-sheet'
import { AddPhysicalAssetSchema, addPhysicalAssetSchema } from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import InputFields from '../input-fields'
import { ASSET_INPUTS } from './config'
import { hp } from '@/utils/responsive'

type CreateOrEditAssetProps = {
  trigger: React.ReactElement<{ onPress: () => void }>
  asset?: PhysicalAsset
}

export default function CreateOrEditAsset({ trigger, asset }: CreateOrEditAssetProps) {
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const title = isEdit ? 'Edit Asset' : 'Create Asset'
  const theme = useTheme()

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

  return (
    <>
      {cloneElement(trigger, {
        onPress: () => {
          setShowModal(true)
        },
      })}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <Modal.Content maxW="sm" w="full" bg={theme.background.get()}>
          <Modal.CloseButton />
          <Modal.Header bg={theme.background.get()}>
            <Text fontFamily={'$heading'} fontSize={'$6'} color={theme.foreground.get()}>
              {title}
            </Text>
          </Modal.Header>

          <Modal.Body style={{ rowGap: hp(1) }}>
            <InputFields control={control} errors={errors} inputs={ASSET_INPUTS} />
          </Modal.Body>

          <Modal.Footer bg={theme.background.get()}>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit(handleAddOrEditPhysicalAsset)}
                isDisabled={addPhysicalAssetMutation.isPending || editPhysicalAssetMutation.isPending}
                isLoading={addPhysicalAssetMutation.isPending || editPhysicalAssetMutation.isPending}
              >
                {title}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
