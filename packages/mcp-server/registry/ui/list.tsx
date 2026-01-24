/**
 * List & ListItem
 *
 * A flexible list component with slots for left/right content,
 * chevron indicators, dividers, and pressable support.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <List>
 *   <ListItem title="Settings" />
 *   <ListItem title="Profile" subtitle="John Doe" />
 * </List>
 *
 * // With icons and chevron
 * <List>
 *   <ListItem
 *     title="Notifications"
 *     left={<BellIcon />}
 *     showChevron
 *     onPress={handlePress}
 *   />
 * </List>
 *
 * // With right content
 * <List>
 *   <ListItem
 *     title="Dark Mode"
 *     right={<Switch value={isDark} onValueChange={setIsDark} />}
 *   />
 * </List>
 * ```
 */

import React, { createContext, useContext } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ListProps {
  /** List items */
  children: React.ReactNode;
  /** Show dividers between items */
  showDividers?: boolean;
  /** Inset dividers from left edge */
  insetDividers?: boolean;
  /** Container style */
  style?: ViewStyle;
}

/** Metadata item for thumbnail variant */
export interface ListItemMetadata {
  /** Icon to display */
  icon: React.ReactNode;
  /** Label text */
  label: string;
}

export interface ListItemProps {
  /** Visual variant */
  variant?: 'default' | 'thumbnail';
  /** Primary text */
  title: string;
  /** Secondary text below title (used as subtitle in default, description in thumbnail) */
  subtitle?: string;
  /** Longer description text (thumbnail variant only) */
  description?: string;
  /** Thumbnail image source (thumbnail variant only) */
  thumbnail?: ImageSourcePropType;
  /** Thumbnail size (thumbnail variant only, default: 100) */
  thumbnailSize?: number;
  /** Metadata items with icon and label (thumbnail variant only) */
  metadata?: ListItemMetadata[];
  /** Content to render on the left (icon, avatar, etc.) - default variant only */
  left?: React.ReactNode;
  /** Content to render on the right (switch, badge, etc.) */
  right?: React.ReactNode;
  /** Show chevron indicator on the right */
  showChevron?: boolean;
  /** Press handler - makes item pressable */
  onPress?: () => void;
  /** Long press handler */
  onLongPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Container style */
  style?: ViewStyle;
  /** Title text style */
  titleStyle?: TextStyle;
  /** Subtitle text style */
  subtitleStyle?: TextStyle;
  /** Description text style (thumbnail variant only) */
  descriptionStyle?: TextStyle;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface ListContextValue {
  showDividers: boolean;
  insetDividers: boolean;
}

const ListContext = createContext<ListContextValue>({
  showDividers: true,
  insetDividers: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function ChevronRightIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// List Component
// ─────────────────────────────────────────────────────────────────────────────

export function List({
  children,
  showDividers = true,
  insetDividers = false,
  style,
}: ListProps) {
  const { colors, radius } = useTheme();

  const childArray = React.Children.toArray(children);

  return (
    <ListContext.Provider value={{ showDividers, insetDividers }}>
      <View
        style={[
          styles.list,
          {
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {childArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {showDividers && index < childArray.length - 1 && (
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: colors.border,
                    marginLeft: insetDividers ? 56 : 0,
                  },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </ListContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ListItem Component
// ─────────────────────────────────────────────────────────────────────────────

export function ListItem({
  variant = 'default',
  title,
  subtitle,
  description,
  thumbnail,
  thumbnailSize = 100,
  metadata,
  left,
  right,
  showChevron = false,
  onPress,
  onLongPress,
  disabled = false,
  style,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
}: ListItemProps) {
  const { colors, spacing, fontSize, fontWeight, radius, springs } = useTheme();
  const scale = useSharedValue(1);

  const isPressable = !!onPress || !!onLongPress;

  const handlePressIn = () => {
    if (isPressable && !disabled) {
      scale.value = withSpring(0.98, springs.snappy);
    }
  };

  const handlePressOut = () => {
    if (isPressable && !disabled) {
      scale.value = withSpring(1, springs.snappy);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      haptic('light');
      onPress?.();
    }
  };

  const handleLongPress = () => {
    if (!disabled) {
      haptic('medium');
      onLongPress?.();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Thumbnail variant content
  const thumbnailContent = (
    <>
      {/* Thumbnail Image */}
      {thumbnail && (
        <Image
          source={thumbnail}
          style={[
            styles.thumbnail,
            {
              width: thumbnailSize,
              height: thumbnailSize,
              borderRadius: radius.md,
              marginRight: spacing[3],
            },
          ]}
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View style={styles.thumbnailContent}>
        <Text
          style={[
            styles.title,
            {
              color: disabled ? colors.foregroundMuted : colors.foreground,
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
            },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {(description || subtitle) && (
          <Text
            style={[
              styles.description,
              {
                color: colors.foregroundMuted,
                fontSize: fontSize.sm,
                marginTop: spacing[1],
                lineHeight: fontSize.sm * 1.4,
              },
              descriptionStyle,
            ]}
            numberOfLines={2}
          >
            {description || subtitle}
          </Text>
        )}
        {metadata && metadata.length > 0 && (
          <View style={[styles.metadataRow, { marginTop: spacing[2], gap: spacing[3] }]}>
            {metadata.map((item, index) => (
              <View key={index} style={[styles.metadataItem, { gap: spacing[1] }]}>
                {React.isValidElement(item.icon)
                  ? React.cloneElement(item.icon as React.ReactElement<{ color?: string; width?: number; height?: number }>, {
                      color: colors.foregroundMuted,
                      width: 14,
                      height: 14,
                    })
                  : item.icon}
                <Text
                  style={{
                    color: colors.foregroundMuted,
                    fontSize: fontSize.xs,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Right Slot */}
      {right && (
        <View style={[styles.rightSlot, { marginLeft: spacing[2] }]}>
          {right}
        </View>
      )}

      {/* Chevron */}
      {showChevron && (
        <View style={[styles.chevron, { marginLeft: spacing[2] }]}>
          <ChevronRightIcon color={colors.foregroundMuted} />
        </View>
      )}
    </>
  );

  // Default variant content
  const defaultContent = (
    <>
      {/* Left Slot */}
      {left && (
        <View style={[styles.leftSlot, { marginRight: spacing[3] }]}>
          {React.isValidElement(left)
            ? React.cloneElement(left as React.ReactElement<{ color?: string; width?: number; height?: number }>, {
                color: colors.foreground,
                width: 24,
                height: 24,
              })
            : left}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: disabled ? colors.foregroundMuted : colors.foreground,
              fontSize: fontSize.base,
              fontWeight: fontWeight.medium,
            },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.foregroundMuted,
                fontSize: fontSize.sm,
                marginTop: spacing[0.5],
              },
              subtitleStyle,
            ]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Slot */}
      {right && (
        <View style={[styles.rightSlot, { marginLeft: spacing[3] }]}>
          {right}
        </View>
      )}

      {/* Chevron */}
      {showChevron && (
        <View style={[styles.chevron, { marginLeft: spacing[2] }]}>
          <ChevronRightIcon color={colors.foregroundMuted} />
        </View>
      )}
    </>
  );

  const content = variant === 'thumbnail' ? thumbnailContent : defaultContent;

  const containerStyle = [
    styles.item,
    {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      minHeight: variant === 'thumbnail' ? thumbnailSize + spacing[3] * 2 : 56,
    },
    variant === 'thumbnail' && styles.thumbnailItem,
    disabled && styles.disabled,
    style,
  ];

  if (isPressable) {
    return (
      <AnimatedPressable
        style={[containerStyle, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={onLongPress ? handleLongPress : undefined}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={description || subtitle}
        accessibilityState={{ disabled }}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <View style={containerStyle} accessibilityRole="text" accessibilityLabel={title}>
      {content}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  list: {
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailItem: {
    alignItems: 'flex-start',
  },
  leftSlot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  thumbnailContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  thumbnail: {
    flexShrink: 0,
  },
  title: {
    // Dynamic styles applied inline
  },
  subtitle: {
    // Dynamic styles applied inline
  },
  description: {
    // Dynamic styles applied inline
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSlot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    flexShrink: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  disabled: {
    opacity: 0.5,
  },
});
