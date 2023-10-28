import { NativeBaseProvider, extendTheme } from "native-base";
import { THEME_COLORS } from "../utils/theme";
import { Slot } from "expo-router";

const theme = extendTheme({ colors: THEME_COLORS });
export default function AppLayout() {
  return (
    <NativeBaseProvider theme={theme}>
      <Slot />
    </NativeBaseProvider>
  );
}
