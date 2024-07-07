import React, { useEffect } from 'react'
import { Dialog, View, Text, Button, Spinner } from 'tamagui'
import { FontSizes } from '@/utils/fonts'

type PrivacyButtonForScenarioType = {
  isPublic: boolean
  handleMutation: () => void
  isSuccess: boolean
  isLoading: boolean
  name: string
  showDialog: boolean
  setShowDialog: (value: boolean) => void
}

const PrivacyButtonForScenario = ({
  isPublic,
  handleMutation,
  showDialog,
  isSuccess,
  isLoading,
  name = 'scenario',
  setShowDialog,
}: PrivacyButtonForScenarioType) => {
  const onPressYes = () => {
    handleMutation()
  }

  useEffect(() => {
    if (isSuccess) {
      setShowDialog(false)
    }
  }, [isSuccess])

  return (
    <View>
      {/* <TouchableOpacity onPress={() => setIsDialogOpen(true)}>{isPublic ? <Unlock /> : <Lock />}</TouchableOpacity> */}
      <Dialog open={showDialog} onOpenChange={(value) => setShowDialog(value)}>
        <Dialog.Portal key={'Privacy-dialog-portal'}>
          <Dialog.Overlay key={'overlay'} onPress={() => setShowDialog(false)} />
          <Dialog.Content style={{ width: '90%' }} key={'Privacy-dialog-content'}>
            <Dialog.Title>
              <Text fontSize={FontSizes.size18} lineHeight={30}>
                {`Are you sure you want to make this ${name} ${isPublic ? 'private' : 'public'}`}?
              </Text>
            </Dialog.Title>
            <View mt={5}>
              <View fd="row" gap={20}>
                <Button flex={1} onPress={() => setShowDialog(false)}>
                  No
                </Button>
                <Button onPress={onPressYes} flex={1} backgroundColor={'$primary'} color="white">
                  {isLoading ? <Spinner /> : 'Yes'}
                </Button>
              </View>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
}

export default PrivacyButtonForScenario
