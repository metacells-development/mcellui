/**
 * Alert Dialog
 *
 * A confirmation dialog that requires explicit user action.
 * Cannot be dismissed by clicking backdrop (use for destructive actions).
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <AlertDialog open={open} onOpenChange={setOpen}>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Delete Account</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This will permanently delete your account. This action cannot be undone.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction onPress={handleDelete}>Delete</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */

import React, { useEffect, useCallback, createContext, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  Pressable,
  PressableProps,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { useTheme, DIALOG_CONSTANTS, overlayTypography } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Context for alert dialog state
const AlertDialogContext = createContext<{
  onClose: () => void;
} | null>(null);

const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within an AlertDialog');
  }
  return context;
};

export interface AlertDialogProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Children (should be AlertDialogContent) */
  children: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <AlertDialogContext.Provider value={{ onClose: handleClose }}>
        {children}
      </AlertDialogContext.Provider>
    </Modal>
  );
}

export interface AlertDialogContentProps {
  /** Content children */
  children: React.ReactNode;
  /** Max width of dialog */
  maxWidth?: number;
  /** Additional styles */
  style?: ViewStyle;
}

export function AlertDialogContent({
  children,
  maxWidth = SCREEN_WIDTH - 48,
  style,
}: AlertDialogContentProps) {
  const { colors, radius, platformShadow, springs } = useTheme();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1, springs.snappy);
  }, []);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
  }));

  const animatedDialogStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.95, 1]) },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: colors.foreground },
          animatedBackdropStyle,
        ]}
      />

      <Animated.View
        style={[
          styles.dialog,
          {
            maxWidth,
            backgroundColor: colors.card,
            borderRadius: radius.xl,
          },
          platformShadow('lg'),
          animatedDialogStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export interface AlertDialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.header, { marginBottom: spacing[4] }, style]}>
      {children}
    </View>
  );
}

export interface AlertDialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AlertDialogTitle({ children, style }: AlertDialogTitleProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
}

export interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AlertDialogDescription({ children, style }: AlertDialogDescriptionProps) {
  const { colors, spacing } = useTheme();
  return (
    <Text
      style={[
        styles.description,
        { color: colors.foregroundMuted, marginTop: spacing[2] },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export interface AlertDialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AlertDialogFooter({ children, style }: AlertDialogFooterProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.footer, { marginTop: spacing[6], gap: spacing[3] }, style]}>
      {children}
    </View>
  );
}

export interface AlertDialogCancelProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AlertDialogCancel({
  children,
  style,
  textStyle,
  onPress,
  ...props
}: AlertDialogCancelProps) {
  const { colors, radius, spacing } = useTheme();
  const { onClose } = useAlertDialog();

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      haptic('light');
      onPress?.(e);
      onClose();
    },
    [onPress, onClose]
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.secondary,
          borderRadius: radius.md,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2.5],
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      {...props}
    >
      <Text style={[styles.buttonText, { color: colors.secondaryForeground }, textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
}

export interface AlertDialogActionProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  /** Use destructive styling */
  destructive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AlertDialogAction({
  children,
  destructive = false,
  style,
  textStyle,
  onPress,
  ...props
}: AlertDialogActionProps) {
  const { colors, radius, spacing } = useTheme();
  const { onClose } = useAlertDialog();

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      haptic(destructive ? 'warning' : 'light');
      onPress?.(e);
      onClose();
    },
    [onPress, onClose, destructive]
  );

  const backgroundColor = destructive ? colors.destructive : colors.primary;
  const textColor = destructive ? colors.destructiveForeground : colors.primaryForeground;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderRadius: radius.md,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2.5],
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      {...props}
    >
      <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    width: '100%',
    padding: DIALOG_CONSTANTS.contentPadding,
  },
  header: {},
  title: {
    fontSize: overlayTypography.title.fontSize,
    fontWeight: overlayTypography.title.fontWeight,
    lineHeight: overlayTypography.title.lineHeight,
  },
  description: {
    fontSize: overlayTypography.description.fontSize,
    fontWeight: overlayTypography.description.fontWeight,
    lineHeight: overlayTypography.description.lineHeight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
