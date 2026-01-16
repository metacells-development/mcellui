/**
 * ActionSheet
 *
 * iOS-style bottom action menu for presenting a set of choices.
 * Includes support for destructive actions and cancel button.
 *
 * @example
 * ```tsx
 * <ActionSheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Photo Options"
 *   message="Choose an action for this photo"
 * >
 *   <ActionSheetItem
 *     icon={<CameraIcon />}
 *     onPress={() => handleCamera()}
 *   >
 *     Take Photo
 *   </ActionSheetItem>
 *   <ActionSheetItem
 *     icon={<GalleryIcon />}
 *     onPress={() => handleGallery()}
 *   >
 *     Choose from Library
 *   </ActionSheetItem>
 *   <ActionSheetItem
 *     icon={<TrashIcon />}
 *     destructive
 *     onPress={() => handleDelete()}
 *   >
 *     Delete Photo
 *   </ActionSheetItem>
 * </ActionSheet>
 * ```
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme, haptic } from '@nativeui/core';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionSheetProps {
  /** Whether sheet is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Optional title */
  title?: string;
  /** Optional message/description */
  message?: string;
  /** Action items */
  children: React.ReactNode;
  /** Cancel button label */
  cancelLabel?: string;
}

export interface ActionSheetItemProps {
  /** Item label */
  children: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Whether action is destructive */
  destructive?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// ActionSheet Component
// ─────────────────────────────────────────────────────────────────────────────

export function ActionSheet({
  open,
  onOpenChange,
  title,
  message,
  children,
  cancelLabel = 'Cancel',
}: ActionSheetProps) {
  const { colors, spacing, radius, fontWeight, fontSize } = useTheme();

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (open) {
      backdropOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(SCREEN_HEIGHT, {
        duration: 200,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [open, translateY, backdropOpacity]);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleCancel = () => {
    haptic('light');
    close();
  };

  // Gesture for swipe to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 150 });
        runOnJS(close)();
      } else {
        translateY.value = withTiming(0, { duration: 150 });
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Clone children to inject close function
  const items = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<ActionSheetItemProps & { _onClose?: () => void }>, {
        _onClose: close,
      });
    }
    return child;
  });

  if (!open) return null;

  return (
    <Modal transparent visible={open} animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                paddingBottom: spacing[8],
              },
              sheetStyle,
            ]}
          >
            {/* Handle */}
            <View style={styles.handleContainer}>
              <View
                style={[
                  styles.handle,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>

            {/* Header */}
            {(title || message) && (
              <View
                style={[
                  styles.header,
                  {
                    paddingHorizontal: spacing[4],
                    paddingBottom: spacing[3],
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                {title && (
                  <Text
                    style={[
                      styles.title,
                      {
                        color: colors.foreground,
                        fontSize: fontSize.lg,
                        fontWeight: fontWeight.semibold,
                      },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                {message && (
                  <Text
                    style={[
                      styles.message,
                      {
                        color: colors.foregroundMuted,
                        fontSize: fontSize.sm,
                        marginTop: title ? spacing[1] : 0,
                      },
                    ]}
                  >
                    {message}
                  </Text>
                )}
              </View>
            )}

            {/* Items */}
            <View style={{ paddingHorizontal: spacing[2] }}>
              {items}
            </View>

            {/* Cancel button */}
            <View style={{ paddingHorizontal: spacing[2], marginTop: spacing[2] }}>
              <Pressable
                onPress={handleCancel}
                style={({ pressed }) => [
                  styles.cancelButton,
                  {
                    backgroundColor: colors.secondary,
                    borderRadius: radius.lg,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cancelText,
                    {
                      color: colors.primary,
                      fontSize: fontSize.base,
                      fontWeight: fontWeight.semibold,
                    },
                  ]}
                >
                  {cancelLabel}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActionSheetItem Component
// ─────────────────────────────────────────────────────────────────────────────

export function ActionSheetItem({
  children,
  icon,
  destructive = false,
  disabled = false,
  onPress,
  _onClose,
}: ActionSheetItemProps & { _onClose?: () => void }) {
  const { colors, spacing, radius, fontWeight, fontSize } = useTheme();

  const handlePress = () => {
    haptic('light');
    onPress?.();
    _onClose?.();
  };

  const textColor = destructive
    ? colors.destructive
    : colors.foreground;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: pressed ? colors.backgroundMuted : 'transparent',
          borderRadius: radius.lg,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[4],
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {icon && (
        <View style={{ marginRight: spacing[3] }}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ width?: number; height?: number; color?: string }>, {
                width: 22,
                height: 22,
                color: textColor,
              })
            : icon}
        </View>
      )}
      <Text
        style={[
          styles.itemText,
          {
            color: textColor,
            fontSize: fontSize.base,
            fontWeight: fontWeight.medium,
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 100,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {},
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {},
});
