import { X } from '@tamagui/lucide-icons'

import { Button, Dialog, Text, View } from 'tamagui'
import { Dimensions, FlatList, TouchableOpacity, useColorScheme } from 'react-native'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
const { width, height } = Dimensions.get('window')

// Interface for props specific to SelectAssetsItem
interface SelectMonthYearProps {
  selectedItem: string
  setSelectedItem: (type: string) => void
  items: string[]
  placeHolder: string
  showPicker: boolean
  setShowPicker: (type: boolean) => void
}

export function SelectMonthYearItem({
  items,
  placeHolder,
  selectedItem,
  setSelectedItem,
  showPicker,
  setShowPicker,
}: SelectMonthYearProps) {
  const colorScheme = useColorScheme()

  return (
    <Dialog modal open={showPicker}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          onPress={() => {
            setShowPicker(false)
          }}
        />

        <Dialog.Content bordered elevate key="content" gap={wp(2)}>
          <Dialog.Title>
            <View flexDirection="row" justifyContent="space-between" width={width - 60} alignItems="center">
              <Text fontSize={FontSizes.size24}>{placeHolder}</Text>
              <Dialog.Close asChild>
                <Button
                  size="$2"
                  circular
                  icon={X}
                  onPress={() => {
                    setShowPicker(false)
                  }}
                />
              </Dialog.Close>
            </View>
          </Dialog.Title>
          <View maxHeight={hp(height / 25)} minHeight={hp(height / 30)}>
            <FlatList
              data={items}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexBasis: `${95 / 3}%`,
                  }}
                  onPress={() => {
                    setSelectedItem(item)
                    setShowPicker(false)
                  }}
                >
                  <View
                    margin={5}
                    borderColor={'silver'}
                    borderWidth={1}
                    borderRadius={15}
                    paddingHorizontal={wp(3)}
                    paddingVertical={wp(1.5)}
                    alignItems="center"
                    backgroundColor={item === selectedItem ? THEME_COLORS.brand[900] : ''}
                  >
                    <Text
                      fontSize={FontSizes.size16}
                      color={item === selectedItem ? 'white' : colorScheme === 'dark' ? 'white' : 'black'}
                    >
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
