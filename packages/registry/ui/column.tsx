/**
 * Column
 *
 * Vertical flex container with gap, alignment, and padding props.
 * Uses design tokens for consistent spacing.
 *
 * @example
 * ```tsx
 * <Column gap="md" align="center">
 *   <Text>Top</Text>
 *   <Text>Bottom</Text>
 * </Column>
 *
 * <Column gap={4} flex={1} justify="between">
 *   <Header />
 *   <Content />
 *   <Footer />
 * </Column>
 * ```
 */

import React, { forwardRef } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

// Semantic gap values
type GapSemantic = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Gap can be either semantic string or numeric spacing key
export type GapValue = GapSemantic | number;

// Semantic → Spacing Key Mapping
const semanticGapMap: Record<GapSemantic, number> = {
  'none': 0,
  'xs': 2,
  'sm': 3,
  'md': 4,
  'lg': 6,
  'xl': 8,
  '2xl': 12,
};

// Alignment value mappings
const alignMap = {
  'start': 'flex-start',
  'center': 'center',
  'end': 'flex-end',
  'stretch': 'stretch',
} as const;

const justifyMap = {
  'start': 'flex-start',
  'center': 'center',
  'end': 'flex-end',
  'between': 'space-between',
  'around': 'space-around',
  'evenly': 'space-evenly',
} as const;

export interface ColumnProps extends ViewProps {
  /** Gap between children (semantic or spacing key) */
  gap?: GapValue;
  /** Horizontal alignment of children */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Vertical distribution of children */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Flex value for the container */
  flex?: number;
  /** Padding (all sides) */
  p?: GapValue;
  /** Horizontal padding */
  px?: GapValue;
  /** Vertical padding */
  py?: GapValue;
  /** Additional styles */
  style?: ViewStyle;
  /** Children */
  children?: React.ReactNode;
}

function resolveGap(
  value: GapValue | undefined,
  spacing: ReturnType<typeof useTheme>['spacing']
): number | undefined {
  if (value === undefined) return undefined;

  if (typeof value === 'string') {
    const key = semanticGapMap[value as GapSemantic];
    return (spacing as Record<number, number>)[key];
  }

  return (spacing as Record<number, number>)[value];
}

export const Column = forwardRef<View, ColumnProps>(function Column(
  {
    gap,
    align,
    justify,
    flex,
    p,
    px,
    py,
    style,
    children,
    ...props
  },
  ref
) {
  const { spacing } = useTheme();

  const resolvedGap = resolveGap(gap, spacing);
  const resolvedP = resolveGap(p, spacing);
  const resolvedPx = resolveGap(px, spacing);
  const resolvedPy = resolveGap(py, spacing);

  const containerStyle: ViewStyle = {
    flexDirection: 'column',
    ...(resolvedGap !== undefined && { gap: resolvedGap }),
    ...(align && { alignItems: alignMap[align] }),
    ...(justify && { justifyContent: justifyMap[justify] }),
    ...(flex !== undefined && { flex }),
    ...(resolvedP !== undefined && { padding: resolvedP }),
    ...(resolvedPx !== undefined && { paddingHorizontal: resolvedPx }),
    ...(resolvedPy !== undefined && { paddingVertical: resolvedPy }),
  };

  return (
    <View ref={ref} style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
});
