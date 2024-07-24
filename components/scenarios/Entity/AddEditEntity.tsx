import React, { useEffect } from 'react'
import { Button, Spinner, Text, View } from 'tamagui'
import { Modal } from 'native-base'
import { useNavigation } from 'expo-router'
import { UseFormReturn } from 'react-hook-form'
import { useColorScheme } from 'react-native'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import KeyboardScrollView from '../../keyboard-scroll-view'
import InputFields from '../../input-fields'
import { InputField } from '@/types/input-fields'
import { ScenarioEntities } from '@/app/(authenticated)/scenarios/[id]'
import { THEME_COLORS } from '@/utils/theme'

type EntityForScenarioType = {
  isEdit?: boolean
  isFetchingEntity?: boolean
  inputs: InputField[]
  entityName: ScenarioEntities
  form: UseFormReturn<any>
  mutation: any
  isLoading: boolean
  handleComplete: () => void
}

const AddEditEntityForScenario = ({
  form,
  isEdit = false,
  inputs,
  entityName,
  mutation,
  isLoading,
  handleComplete,
  isFetchingEntity = false,
}: EntityForScenarioType) => {
  const navigation = useNavigation()

  const systemTheme = useColorScheme()
  const background = systemTheme === 'dark' ? 'black' : 'white'
  const textColor = systemTheme === 'dark' ? 'white' : 'black'

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      form.reset()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, form.reset])

  return (
    <Modal avoidKeyboard isOpen={true} onClose={handleComplete} size={'full'}>
      <Modal.Content style={{ backgroundColor: background }}>
        <Modal.Body>
          <View f={1} style={{ paddingHorizontal: wp(10), marginTop: hp(3) }}>
            <View fd="row" ai="center" columnGap={wp(4)} mb={wp(5)} position="fixed">
              <Text fontSize={FontSizes.size20} fontFamily={'$heading'} color={textColor} alignSelf="center" pt={15}>
                {entityName}
              </Text>
              <Modal.CloseButton />
            </View>
            {isFetchingEntity ? (
              <View h={hp(80)}>
                <Text fontSize={FontSizes.size15} fontFamily={'$heading'} color={textColor}>
                  Please wait...
                </Text>
              </View>
            ) : (
              <KeyboardScrollView>
                <View rowGap={hp(1)}>
                  <InputFields control={form.control} errors={form.formState.errors} inputs={inputs} />
                </View>
                <Button
                  fontSize={FontSizes.size18}
                  h={hp(5.5)}
                  onPress={mutation}
                  bg={THEME_COLORS.brand[900]}
                  color="white"
                  mt={hp(4)}
                  disabled={isLoading || !form.formState.isDirty}
                >
                  {isLoading ? <Spinner /> : <></>}
                  {isEdit ? `Edit ${entityName}` : `Add ${entityName}`}
                </Button>
              </KeyboardScrollView>
            )}
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default AddEditEntityForScenario
