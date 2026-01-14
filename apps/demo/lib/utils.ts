import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;
type StyleInput = Style | Style[] | null | undefined | false;

/**
 * Merge styles utility
 */
export function cn(...inputs: StyleInput[]): Style {
  const styles: Style[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (Array.isArray(input)) {
      const flattened = StyleSheet.flatten(input);
      if (flattened) styles.push(flattened);
    } else {
      styles.push(input);
    }
  }

  return StyleSheet.flatten(styles);
}
