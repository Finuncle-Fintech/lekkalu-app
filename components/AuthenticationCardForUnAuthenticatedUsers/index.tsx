import { router } from 'expo-router'
import React from 'react'
import { Button, View } from 'tamagui'

const AuthenticationCardForUnAuthenticatedUsers = () => {
  return (
    <View pt={'$6'} pb={20} bg="$background">
      <View fd="row" gap={20} px={10}>
        <Button f={1} bg={'$primary'} onPress={() => router.push('/signup')}>
          Sign Up
        </Button>
        <Button f={1} bg={'$primary'} onPress={() => router.push('/login')}>
          Login
        </Button>
      </View>
    </View>
  )
}

export default AuthenticationCardForUnAuthenticatedUsers

// eslint-disable-next-line no-lone-blocks
{
  /* <Actionsheet isOpen={true} disableOverlay>
        <Actionsheet.Content bg={inputColor}>
          <View fd="row" gap={20} px={10}>
            <Button f={1} bg={'$primary'} onPress={() => router.push('/signup')}>
              Sign Up
            </Button>
            <Button f={1} bg={'$primary'} onPress={() => router.push('/login')}>
              Login
            </Button>
          </View>
        </Actionsheet.Content>
      </Actionsheet> */
}
