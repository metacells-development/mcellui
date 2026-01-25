/**
 * Dialog
 *
 * A modal dialog component with backdrop and animations.
 * Centers content on screen with fade/scale animation.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Are you sure?</DialogTitle>
 *       <DialogDescription>This action cannot be undone.</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DialogClose>
 *       <Button>Continue</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
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
} from 'react-native-reanimated';
import { useTheme, DIALOG_CONSTANTS, areAnimationsDisabled, overlayTypography } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Context for dialog state
const DialogContext = createContext<{
  onClose: () => void;
} | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
};

export interface DialogProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Children (should be DialogContent) */
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
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
      <DialogContext.Provider value={{ onClose: handleClose }}>
        {children}
      </DialogContext.Provider>
    </Modal>
  );
}

export interface DialogContentProps {
  /** Content children */
  children: React.ReactNode;
  /** Max width of dialog */
  maxWidth?: number;
  /** Additional styles */
  style?: ViewStyle;
}

export function DialogContent({
  children,
  maxWidth = SCREEN_WIDTH - DIALOG_CONSTANTS.screenMargin,
  style,
}: DialogContentProps) {
  const { colors, radius, platformShadow, springs } = useTheme();
  const { onClose } = useDialog();
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  const progress = useSharedValue(animationsEnabled ? 0 : 1);
  const isClosing = useSharedValue(false);

  useEffect(() => {
    if (animationsEnabled) {
      progress.value = withSpring(1, springs.snappy);
    }
  }, [animationsEnabled]);

  const closeDialog = useCallback(() => {
    if (isClosing.value) return;
    isClosing.value = true;
    if (animationsEnabled) {
      progress.value = withTiming(0, { duration: DIALOG_CONSTANTS.closeAnimationDuration }, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
    } else {
      onClose();
    }
  }, [onClose, animationsEnabled]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, DIALOG_CONSTANTS.backdropMaxOpacity]),
  }));

  const animatedDialogStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: interpolate(progress.value, [0, 1], [DIALOG_CONSTANTS.enterStartScale, 1]) },
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
      >
        <Pressable style={styles.backdropPressable} onPress={closeDialog} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
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
      </KeyboardAvoidingView>
    </View>
  );
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DialogHeader({ children, style }: DialogHeaderProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.header, { marginBottom: spacing[4] }, style]}>
      {children}
    </View>
  );
}

export interface DialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DialogTitle({ children, style }: DialogTitleProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function DialogDescription({ children, style }: DialogDescriptionProps) {
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

export interface DialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function DialogFooter({ children, style }: DialogFooterProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.footer, { marginTop: spacing[6], gap: spacing[3] }, style]}>
      {children}
    </View>
  );
}

export interface DialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DialogClose({ children, asChild }: DialogCloseProps) {
  const { onClose } = useDialog();

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropPressable: {
    flex: 1,
  },
  keyboardView: {
    justifyContent: 'center',
    alignItems: 'center',
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
});
