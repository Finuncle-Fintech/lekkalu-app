import Slider from '@react-native-community/slider'
import { Box, VStack, View } from 'native-base'
// import { Slider } from 'tamagui'

type SliderProps = {
  defaultValue?: number,
  maxValue?: number,
  minValue?: number,
  onChange?: void,
}

export default function CommoneSlider({ defaultValue, maxValue, minValue, onChange }: SliderProps) {
  return (
    <View alignItems="center" justifyContent="center">
      <Box alignItems="center" w="100%">
        <VStack space={4} w="100%" maxW="300">

        <Slider
            value={defaultValue}
            step={1}
            style={{ width: "100%", height: 34 }}
            minimumValue={minValue}
            maximumValue={maxValue}
            minimumTrackTintColor="#003562"
            maximumTrackTintColor="#e1e1e1"
            thumbTintColor='#003562'
            onValueChange={(val)=>onChange(parseInt(val))}
          />
        </VStack>
      </Box>
    </View>
  )
}
