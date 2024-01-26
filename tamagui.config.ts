import { createAnimations } from '@tamagui/animations-react-native'
import { createInterFont } from '@tamagui/font-inter'
import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
})

const headingFont = createInterFont()
const bodyFont = createInterFont()

const PRIMARY = '#582FFF'

const config = createTamagui({
  animations,
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    light: {
      ...themes.light,
      background: '#F5F6F7',
      dark: '#FFFFFF',
      mutedForeground: '#484C52',
      primary: PRIMARY,
      highlight: PRIMARY,
      foreground: '#09090b',
    },
    dark: {
      ...themes.dark,
      background: '#131417',
      dark: '#1D1F24',
      mutedForeground: '#676D75',
      primary: PRIMARY,
      highlight: '#FFFFFF',
      foreground: '#f2f2f2',
    },
  },
  tokens,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
