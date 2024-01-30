import React, { FC } from 'react'
import { Separator, Text, View, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

import { useAuthContext } from '@/hooks/use-auth'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import DeleteAccountModal from '@/components/delete-account-modal'
import { useGetUserDetails } from '@/queries/auth'
import { useRefetchOnFocus } from '@/hooks/use-refetch-on-focus'

type TileItemProps = { title: string; onPress?: () => void; dangerous?: boolean }

const TileItem: FC<TileItemProps> = ({ title, onPress, dangerous }) => {
  const theme = useTheme()
  const color = dangerous ? '#ff3333' : theme.foreground.get()

  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text fontFamily={'$body'} fontSize={FontSizes.size16} f={1} color={color}>
        {title}
      </Text>
      <Feather name="chevron-right" size={wp(6)} color={color} />
    </TouchableOpacity>
  )
}

export default function Settings() {
  const { logout } = useAuthContext()
  const { top } = useSafeAreaInsets()
  const { data: userData, refetch } = useGetUserDetails()
  useRefetchOnFocus(refetch)

  const onPressEditProfile = () => {
    router.push('/edit-profile')
  }

  const onPressVerifyEmail = () => {
    router.push('/email-verify')
  }

  const onPressForgotPassword = () => {
    router.push('/reset-password')
  }

  const onPressSubmitFeedback = () => {
    router.push('/submit-feedback')
  }

  return (
    <View bg={'$backgroundHover'} f={1}>
      <View pt={top} h={hp(26)} bg={THEME_COLORS.primary[400]} bbrr={wp(8)} bblr={wp(8)}>
        <View fd="row" bottom={hp(13)} pos="absolute" r={0} l={0} zIndex={1} ai="center" columnGap={wp(4)} px={wp(4)}>
          <AntDesign color={'white'} name="setting" size={wp(8)} />
          <Text fontFamily={'$heading'} fontSize={FontSizes.size28} color="white">
            Settings
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scroll}>
        <View bg={'$background'} py={hp(2)} br={wp(4)}>
          <View fd="row" ai="flex-start" jc="space-between" columnGap={wp(3)} px={wp(4)}>
            <View f={1} rowGap={hp(0.2)}>
              <Text
                textTransform="capitalize"
                f={1}
                numberOfLines={1}
                fontSize={FontSizes.size18}
                fontFamily={'$heading'}
              >
                {userData?.first_name} {userData?.last_name}
              </Text>
              <Text
                f={1}
                numberOfLines={1}
                fontSize={FontSizes.size14}
                fontFamily={'$heading'}
                color={'$mutedForeground'}
              >
                @{userData?.username}
              </Text>
            </View>
            <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center', columnGap: wp(2) }}>
              <Text color={THEME_COLORS.primary[400]} fontSize={FontSizes.size18} fontFamily={'$heading'}>
                Logout
              </Text>
              <MaterialIcons color={THEME_COLORS.primary[400]} name="logout" size={wp(5)} />
            </TouchableOpacity>
          </View>
          <Separator my={hp(2)} />
          <Text color="$mutedForeground" px={wp(4)} fontSize={FontSizes.size18} fontFamily={'$heading'}>
            Account Settings
          </Text>
          <View px={wp(4)} rowGap={hp(2.5)} mt={hp(3)}>
            <TileItem title="Edit Profile" onPress={onPressEditProfile} />
            <TileItem title="Verify Email" onPress={onPressVerifyEmail} />
            <TileItem title="Reset Password" onPress={onPressForgotPassword} />
          </View>
          <Separator my={hp(2)} />
          <Text color="$mutedForeground" px={wp(4)} fontSize={FontSizes.size18} fontFamily={'$heading'}>
            More Settings
          </Text>
          <View px={wp(4)} rowGap={hp(2.5)} mt={hp(3)}>
            <TileItem title="Submit Feedback" onPress={onPressSubmitFeedback} />
            <DeleteAccountModal trigger={<TileItem title="Delete Account" dangerous />} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  scroll: {
    top: -hp(10),
    marginHorizontal: wp(4),
  },
})
