/**
 * Sheet
 *
 * A bottom sheet component with snap points and gesture support.
 * Slides up from the bottom with backdrop.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Sheet open={open} onOpenChange={setOpen}>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Edit Profile</SheetTitle>
 *       <SheetDescription>Make changes to your profile</SheetDescription>
 *     </SheetHeader>
 *     <View>{content}</View>
 *   </SheetContent>
 * </Sheet>
 * ```
 */

import React, { useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useTheme, SHEET_CONSTANTS, areAnimationsDisabled } from '@metacells/mcellui-core';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Context for sheet state
const SheetContext = createContext<{
  onClose: () => void;
} | null>(null);

const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
};

export interface SheetProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Children (should be SheetContent) */
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
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
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SheetContext.Provider value={{ onClose: handleClose }}>
          {children}
        </SheetContext.Provider>
      </GestureHandlerRootView>
    </Modal>
  );
}

export interface SheetContentProps {
  /** Content children */
  children: React.ReactNode;
  /** Height of sheet (default: 50% of screen) */
  height?: number | string;
  /** Show drag handle */
  showHandle?: boolean;
  /** Threshold (0-1) für automatisches Schließen beim Ziehen */
  closeThreshold?: number;
  /** Geschwindigkeit (px/s) für Swipe-to-Close */
  velocityThreshold?: number;
  /** Additional styles */
  style?: ViewStyle;
}

export function SheetContent({
  children,
  height = '50%',
  showHandle = true,
  closeThreshold = SHEET_CONSTANTS.closeThreshold,
  velocityThreshold = SHEET_CONSTANTS.velocityThreshold,
  style,
}: SheetContentProps) {
  const { colors, radius, springs } = useTheme();
  const { onClose } = useSheet();
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const translateY = useSharedValue(animationsEnabled ? SCREEN_HEIGHT : 0);
  const backdropOpacity = useSharedValue(animationsEnabled ? 0 : 1);
  const isClosing = useSharedValue(false);

  // Calculate actual height
  const sheetHeight = typeof height === 'string'
    ? (parseFloat(height) / 100) * SCREEN_HEIGHT
    : height;

  useEffect(() => {
    if (animationsEnabled) {
      translateY.value = withSpring(0, springs.snappy);
      backdropOpacity.value = withTiming(1, { duration: SHEET_CONSTANTS.backdropFadeInDuration });
    }
  }, [animationsEnabled]);

  const closeSheet = useCallback(() => {
    if (isClosing.value) return;
    isClosing.value = true;
    if (animationsEnabled) {
      backdropOpacity.value = withTiming(0, { duration: SHEET_CONSTANTS.backdropFadeOutDuration });
      translateY.value = withSpring(
        SCREEN_HEIGHT,
        springs.snappy,
        (finished) => {
          if (finished) {
            runOnJS(onClose)();
          }
        }
      );
    } else {
      onClose();
    }
  }, [onClose, springs.snappy, animationsEnabled]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > sheetHeight * closeThreshold || event.velocityY > velocityThreshold) {
        runOnJS(closeSheet)();
      } else if (animationsEnabled) {
        translateY.value = withSpring(0, springs.snappy);
      } else {
        translateY.value = 0;
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backdropOpacity.value,
      [0, 1],
      [0, SHEET_CONSTANTS.backdropMaxOpacity],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: colors.foreground },
          animatedBackdropStyle,
        ]}
      >
        <Pressable style={styles.backdropPressable} onPress={closeSheet} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              {
                height: sheetHeight,
                backgroundColor: colors.card,
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
              },
              animatedSheetStyle,
              style,
            ]}
          >
            {showHandle && (
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>
            )}
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </View>
  );
}

export interface SheetHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SheetHeader({ children, style }: SheetHeaderProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.header, { paddingBottom: spacing[4] }, style]}>
      {children}
    </View>
  );
}

export interface SheetTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function SheetTitle({ children, style }: SheetTitleProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
}

export interface SheetDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function SheetDescription({ children, style }: SheetDescriptionProps) {
  const { colors, spacing } = useTheme();
  return (
    <Text
      style={[
        styles.description,
        { color: colors.foregroundMuted, marginTop: spacing[1] },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export interface SheetFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SheetFooter({ children, style }: SheetFooterProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.footer, { paddingTop: spacing[4] }, style]}>
      {children}
    </View>
  );
}

export interface SheetCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function SheetClose({ children, asChild }: SheetCloseProps) {
  const { onClose } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: onClose,
    });
  }

  return (
    <Pressable onPress={onClose}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropPressable: {
    flex: 1,
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: SHEET_CONSTANTS.handlePaddingTop,
    paddingBottom: SHEET_CONSTANTS.handlePaddingBottom,
  },
  handle: {
    width: SHEET_CONSTANTS.handleWidth,
    height: SHEET_CONSTANTS.handleHeight,
    borderRadius: SHEET_CONSTANTS.handleHeight / 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SHEET_CONSTANTS.contentPaddingHorizontal,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
