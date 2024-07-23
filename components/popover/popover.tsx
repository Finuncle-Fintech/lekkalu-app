import { AntDesign } from '@expo/vector-icons';
import { Box, Button, Heading, Icon, Popover, Slider, VStack, View } from 'native-base'
import { TouchableOpacity } from 'react-native';

type PopOverProps = {
  children?: string
}

export default function CommonPopover({children}: PopOverProps) {
  return (
    <View alignItems="center" justifyContent="center">
     <Box w="100%" alignItems="center">
      <Popover trigger={triggerProps => {
      return  <TouchableOpacity hitSlop={15} {...triggerProps}><Icon as={AntDesign} name="infocirlceo" /></TouchableOpacity>;
    }}>
        <Popover.Content w="56">
          <Popover.Arrow />
          <Popover.Body>
            {children}
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </Box>
    </View>
  )
}