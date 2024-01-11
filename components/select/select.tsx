import { Check, ChevronDown } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import { Sheet, Adapt, Select as TamaSelect, YStack } from 'tamagui'

type SelectProps = Omit<React.ComponentProps<typeof TamaSelect>, 'onValueChange'> & {
  items: { label: string; value: string }[]
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
}

export default function Select({ items, onChange, label, placeholder, ...props }: SelectProps) {
  return (
    <TamaSelect onValueChange={onChange} disablePreventBodyScroll {...props}>
      <TamaSelect.Trigger iconAfter={ChevronDown}>
        <TamaSelect.Value placeholder={placeholder ?? 'Select'} />
      </TamaSelect.Trigger>

      <Adapt platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <TamaSelect.Content zIndex={200000}>
        <TamaSelect.Viewport minWidth={200}>
          <TamaSelect.Group>
            {!!label && <TamaSelect.Label>{label}</TamaSelect.Label>}
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <TamaSelect.Item index={i} key={item.value} value={item.value}>
                      <TamaSelect.ItemText>{item.label}</TamaSelect.ItemText>
                      <TamaSelect.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </TamaSelect.ItemIndicator>
                    </TamaSelect.Item>
                  )
                }),
              [items],
            )}
          </TamaSelect.Group>
        </TamaSelect.Viewport>

        <TamaSelect.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
        </TamaSelect.ScrollDownButton>
      </TamaSelect.Content>
    </TamaSelect>
  )
}
