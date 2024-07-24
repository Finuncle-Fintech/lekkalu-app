import React, { useEffect } from 'react'
import { View, Text } from 'tamagui'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import ListEntity from '@/components/scenarios/Entity/ListEntity'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'
import useScenario from '@/hooks/use-scenario'
import { fetchScenarioById } from '@/queries/scenario'
import { FontSizes } from '@/utils/fonts'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { hp, wp } from '@/utils/responsive'
import AuthenticationCardForUnAuthenticatedUsers from '@/components/AuthenticationCardForUnAuthenticatedUsers'

const ScenarioForUnAuthenticatedUser = () => {
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const scenarioId = +params.id

  const { data: scenario, isSuccess } = useQuery({
    queryKey: [`${SCENARIO.SCENARIO}-${scenarioId}`],
    queryFn: () => fetchScenarioById(scenarioId),
  })

  const { loginImaginaryUser } = useImaginaryAuth()
  const { getAllScenarioEntitiesQuery } = useScenario(scenarioId)

  useEffect(() => {
    if (isSuccess) {
      loginImaginaryUser.mutate({
        username: scenario?.imag_username,
        password: scenario?.imag_password,
        id: scenario?.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <>
      <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
        <View fd="row" ml={wp(5)} mr={wp(4)}>
          <Text fontSize={FontSizes.size20} fontFamily={'$heading'} w={'83%'} alignSelf="center">
            {scenario?.name}
          </Text>
        </View>
        <ListEntity
          data={getAllScenarioEntitiesQuery?.data}
          isLoading={getAllScenarioEntitiesQuery?.isLoading}
          refetch={getAllScenarioEntitiesQuery?.refetch}
          isForUnAuthenticatedUser
        />
      </View>
      <AuthenticationCardForUnAuthenticatedUsers />
    </>
  )
}

export default ScenarioForUnAuthenticatedUser
