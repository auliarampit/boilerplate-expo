/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/shared/constants/Colors'
import { useTheme } from '@/shared/components/ThemeProvider'

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { colorScheme, colors } = useTheme()
  const colorFromProps = props[colorScheme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    return colors[colorName]
  }
}
