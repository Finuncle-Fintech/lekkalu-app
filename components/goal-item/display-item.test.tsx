import React from 'react'
import { render } from '@testing-library/react-native'
import dayjs from 'dayjs'
import { TamaguiProvider } from 'tamagui'
import DisplayItem from '@/components/goal-item/display-item'
import config from '@/tamagui.config'

describe('Goal', () => {
  it('Each Goal Information is displayed', () => {
    const dummyData = {
      created_at: dayjs().toString(),
      name: 'Test',
      track_kpi: '150',
    }
    const GoalItem = render(
      <TamaguiProvider config={config}>
        <DisplayItem name={dummyData.name} track_kpi={dummyData.track_kpi} created_at={'12 days ago'} />,
      </TamaguiProvider>,
    )
    expect(GoalItem).toBeDefined()
  })
})
