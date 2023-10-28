import { Box, NativeBaseProvider, extendTheme } from "native-base";
import { Text } from "react-native";
import { THEME_COLORS } from "../utils/theme";

const theme = extendTheme({ colors: THEME_COLORS });

export default function App() {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Open up App.js to start working on your app!</Text>
      </Box>
    </NativeBaseProvider>
  );
}
