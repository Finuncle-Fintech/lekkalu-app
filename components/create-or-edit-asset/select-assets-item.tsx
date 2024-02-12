import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useMemo, useState } from 'react'
import type { FontSizeTokens, SelectProps } from 'tamagui'
import { Adapt, Label, Select, Sheet, XStack, YStack, getFontSize, useTheme } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
// import { ASSET_TYPE as items } from './config'
import { Dimensions } from 'react-native'
import { FontSizes } from '@/utils/fonts'
const { width, height } = Dimensions.get('window')

// Interface for props specific to SelectAssetsItem
interface SelectAssetsItemProps {
  selectedAssetstype: string;
  setSelectedAssetsType: (type: string) => void;
  items: Array<{name: string}>
}

// Merging SelectProps with SelectAssetsItemProps
interface FullSelectAssetsItemProps extends SelectProps, SelectAssetsItemProps {}


export function SelectAssetsItem(props: FullSelectAssetsItemProps) {
  const theme = useTheme();
    return (
      <Select value={props.selectedAssetstype} onValueChange={props.setSelectedAssetsType} disablePreventBodyScroll {...props}>
        <Select.Trigger width={width - 1000} minHeight={36} iconAfter={ChevronDown} height={'$1'} paddingVertical={5} paddingHorizontal={10}>
          <Select.Value placeholder="Select Assets Category" fontSize={FontSizes.size18}/>
        </Select.Trigger>
  
        <Adapt platform="touch">
          <Sheet
            native={!!props.native}
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: 'spring',
              damping: 50,
              mass: 1.2,
              stiffness: 250,
            }}           
            snapPointsMode='fit'                        
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
  
        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>
  
          <Select.Viewport
            // to do animations:
            animation="quick"
            animateOnly={['transform', 'opacity']}
            enterStyle={{ o: 0, y: -10 }}
            exitStyle={{ o: 0, y: 10 }}
            minWidth={10}
          >
            <Select.Group>
              {useMemo(
                () =>
                  props.items.map((item, i) => {
                    return (
                      <Select.Item
                        index={i}
                        key={item.name}
                        value={item.name.toLowerCase()}
                      >
                        <Select.ItemText>{item.name}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    )
                  }),
                [props.items]
              )}
            </Select.Group>
            {props.native && (
              <YStack
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                width={'$4'}
                pointerEvents="none"
              >
                <ChevronDown
                  size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
                />
              </YStack>
            )}
          </Select.Viewport>
  
          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$1"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    )
  }
