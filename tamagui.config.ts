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
      color: '#09090b',
      dark: '#f4f4f5',
      background: '#FFFFFF',
      foreground: '#09090b',
      primary: '#e11d48',
      secondary: '#f4f4f5',
      muted: '#f4f4f5',
      mutedForeground: '#71717a',
      ring: '#e11d48',
    },
    dark: {
      ...themes.dark,
      color: '#f2f2f2',
      dark: 'black',
      background: '#0c0a09',
      foreground: '#f2f2f2',
      primary: '#e11d48',
      secondary: '#27272a',
      muted: '#262626',
      mutedForeground: '#a1a1aa',
      ring: '#e11d48',
    },
  },
  tokens,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
