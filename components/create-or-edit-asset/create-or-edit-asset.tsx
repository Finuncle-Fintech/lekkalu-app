import { cloneElement, useState } from 'react'
import { Button, CheckIcon, FormControl, Input, Modal, Select, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { useAuthContext } from '@/hooks/use-auth'
import { PhysicalAsset } from '@/types/balance-sheet'
import { AddPhysicalAssetSchema, addPhysicalAssetSchema } from '@/schema/balance-sheet'
import { AssetCreateOrEditDto, addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import DatePicker from '../date-picker'
import { ASSET_MONTHS, ASSET_YEARS } from '@/utils/balance-sheet'

type CreateOrEditAssetProps = {
  trigger: React.ReactElement<{ onPress: () => void }>
  asset?: PhysicalAsset
}

export default function CreateOrEditAsset({ trigger, asset }: CreateOrEditAssetProps) {
  const { userData } = useAuthContext()
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const title = isEdit ? 'Edit Asset' : 'Create Asset'

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
      user: userData?.id ?? 1,
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
    onError: (error) => {
      console.log(error)
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
        <Modal.Content maxW="sm" w="full">
          <Modal.CloseButton />
          <Modal.Header>{title}</Modal.Header>

          <Modal.Body>
            <FormControl isRequired isInvalid={'name' in errors}>
              <FormControl.Label>Asset Name</FormControl.Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter asset name" onChangeText={field.onChange} {...field} />
                )}
              />

              <FormControl.ErrorMessage>{errors.name?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={'purchase_value' in errors}>
              <FormControl.Label>Purchase Value</FormControl.Label>
              <Controller
                name="purchase_value"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString()}
                    keyboardType="numeric"
                    placeholder="Enter purchase value"
                    onChangeText={field.onChange}
                  />
                )}
              />

              <FormControl.ErrorMessage>{errors.purchase_value?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={'purchase_date' in errors}>
              <FormControl.Label>Purchase Date</FormControl.Label>
              <Controller name="purchase_date" control={control} render={({ field }) => <DatePicker {...field} />} />

              <FormControl.ErrorMessage>{errors.purchase_date?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={'sell_value' in errors}>
              <FormControl.Label>Sell Value</FormControl.Label>
              <Controller
                name="sell_value"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString()}
                    keyboardType="numeric"
                    placeholder="Enter sell value"
                    onChangeText={field.onChange}
                  />
                )}
              />

              <FormControl.ErrorMessage>{errors.sell_value?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={'sell_date' in errors}>
              <FormControl.Label>Choose the sell date</FormControl.Label>
              <Controller name="sell_date" control={control} render={({ field }) => <DatePicker {...field} />} />

              <FormControl.ErrorMessage>{errors.sell_date?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={'depreciation_percent' in errors}>
              <FormControl.Label>Choose depreciation %</FormControl.Label>
              <Controller
                name="depreciation_percent"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString()}
                    keyboardType="numeric"
                    placeholder="Enter depreciation %"
                    onChangeText={field.onChange}
                  />
                )}
              />

              <FormControl.ErrorMessage>{errors.depreciation_percent?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={'init_dep' in errors}>
              <FormControl.Label>Choose depreciation %</FormControl.Label>
              <Controller
                name="init_dep"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString()}
                    keyboardType="numeric"
                    placeholder="Initial depreciation"
                    onChangeText={field.onChange}
                  />
                )}
              />

              <FormControl.ErrorMessage>{errors.init_dep?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={'market_value' in errors}>
              <FormControl.Label>Market Value</FormControl.Label>
              <Controller
                name="market_value"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString()}
                    keyboardType="numeric"
                    placeholder="Market Value"
                    onChangeText={field.onChange}
                  />
                )}
              />

              <FormControl.ErrorMessage>{errors.market_value?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={'months' in errors}>
              <FormControl.Label>Months</FormControl.Label>

              <Controller
                name="months"
                control={control}
                render={({ field }) => (
                  <Select
                    {...omit(field, 'ref')}
                    placeholder="Months"
                    _selectedItem={{
                      bg: 'brand.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1"
                    defaultValue={field.value?.toString()}
                    onValueChange={field.onChange}
                  >
                    {ASSET_MONTHS.map((month) => (
                      <Select.Item key={month.id} label={month.label.toString()} value={month.id} />
                    ))}
                  </Select>
                )}
              />

              <FormControl.ErrorMessage>{errors.months?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={'years' in errors}>
              <FormControl.Label>Years</FormControl.Label>

              <Controller
                name="years"
                control={control}
                render={({ field }) => (
                  <Select
                    {...omit(field, 'ref')}
                    placeholder="Years"
                    _selectedItem={{
                      bg: 'brand.600',
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1"
                    selectedValue={typeof field.value === 'string' ? field.value : undefined}
                    onValueChange={field.onChange}
                  >
                    {ASSET_YEARS.map((year) => (
                      <Select.Item key={year.id} label={year.label} value={year.id} />
                    ))}
                  </Select>
                )}
              />

              <FormControl.ErrorMessage>{errors.years?.message}</FormControl.ErrorMessage>
            </FormControl>
          </Modal.Body>

          <Modal.Footer>
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
