import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Unlock, Lock } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { View, Text, useTheme } from 'tamagui'
import EditDeleteMenu from '@/components/edit-delete-menu'
import { hp, wp } from '@/utils/responsive'
import { deleteComparison, updateComparison } from '@/queries/scenario'
import { COMPARISON } from '@/utils/query-keys/scenarios'
import { AddComparisonSchema } from '@/schema/comparisons'
import PrivacyButton from '@/components/scenarios/PrivacyButton'

type EachComparisonType = {
  access: 'Private' | 'Public'
  id: number
  name: string
}

const EachComparison = ({ access, name, id }: EachComparisonType) => {
  const theme = useTheme()
  const qc = useQueryClient()

  const [showPrivacyDialog, setPrivacyDialog] = useState(false)

  const handleNavigationToComparison = () => {
    router.push({
      pathname: `/(authenticated)/comparisons/${id})`,
      params: { id },
    })
  }

  const { mutate: remove, isPending: isDeletingComparison } = useMutation({
    mutationFn: () => deleteComparison(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
    },
  })

  const {
    mutate: updatePrivacy,
    isSuccess: isPrivacyChangedSuccess,
    isPending: isPrivacyChangeLoading,
  } = useMutation({
    mutationFn: (values: Partial<AddComparisonSchema>) => updateComparison(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPARISON.COMPARISON] })
    },
  })

  const handlePrivacyChange = (value: 'Private' | 'Public') => {
    updatePrivacy({ access: value })
  }

  return (
    <TouchableOpacity
      key={id}
      onPress={handleNavigationToComparison}
      style={[styles.container, { backgroundColor: theme.background.get() }]}
    >
      <View display={'flex'} fd="row" gap={20}>
        <View jc={'center'}>{access === 'Private' ? <Lock /> : <Unlock />}</View>
        <View width={'$15'}>
          <Text>{name}</Text>
        </View>
      </View>
      <View als={'flex-start'}>
        <PrivacyButton
          handleMutation={() => handlePrivacyChange(access === 'Private' ? 'Public' : 'Private')}
          showDialog={showPrivacyDialog}
          setShowDialog={setPrivacyDialog}
          isPublic={access === 'Public'}
          isSuccess={isPrivacyChangedSuccess}
          isLoading={isPrivacyChangeLoading}
          name="comparison"
        />
        <EditDeleteMenu
          onEdit={() =>
            router.push({
              pathname: '/(authenticated)/comparisons/add',
              params: { isEdit: 'true', id },
            })
          }
          onDelete={remove}
          isDeleting={isDeletingComparison}
          extraMenus={[
            {
              name: `Set to ${access === 'Private' ? 'Public' : 'Private'}`,
              onPress: () => setPrivacyDialog(true),
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  )
}

export default EachComparison

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: wp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    textAlign: 'center',
  },
})
