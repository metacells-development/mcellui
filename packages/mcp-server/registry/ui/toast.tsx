/**
 * Toast
 *
 * A notification system for displaying brief messages.
 * Auto-dismisses after duration. Supports variants and actions.
 *
 * @example
 * ```tsx
 * // Using ToastProvider at app root
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // Using toast anywhere in your app
 * import { useToast } from '@/components/ui/toast';
 *
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   return (
 *     <Button onPress={() => toast({ title: 'Saved!', variant: 'success' })}>
 *       Save
 *     </Button>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  SlideInUp,
  SlideOutUp,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, TOAST_CONSTANTS, areAnimationsDisabled } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts visible at once */
  maxToasts?: number;
  /** Default duration in ms */
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  maxToasts = TOAST_CONSTANTS.maxToasts,
  defaultDuration = TOAST_CONSTANTS.defaultDuration,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);
  const insets = useSafeAreaInsets();

  const toast = useCallback(
    (options: ToastOptions): string => {
      const id = Math.random().toString(36).slice(2, 9);
      const newToast: ToastData = {
        id,
        ...options,
        duration: options.duration ?? defaultDuration,
      };

      // Haptic feedback based on variant
      if (options.variant === 'success') {
        haptic('success');
      } else if (options.variant === 'error') {
        haptic('error');
      } else if (options.variant === 'warning') {
        haptic('warning');
      } else {
        haptic('light');
      }

      setToasts((prev) => {
        const next = [newToast, ...prev];
        return next.slice(0, maxToasts);
      });

      return id;
    },
    [defaultDuration, maxToasts]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      <View
        style={[
          styles.container,
          { top: insets.top + TOAST_CONSTANTS.containerTopOffset },
        ]}
        pointerEvents="box-none"
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            data={t}
            onDismiss={() => dismiss(t.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  data: ToastData;
  onDismiss: () => void;
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  const { colors, radius, platformShadow, spacing } = useTheme();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const animationsEnabled = useMemo(() => !areAnimationsDisabled(), []);

  useEffect(() => {
    if (data.duration && data.duration > 0) {
      timerRef.current = setTimeout(onDismiss, data.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data.duration, onDismiss]);

  const getVariantStyles = () => {
    switch (data.variant) {
      case 'success':
        return {
          backgroundColor: colors.success ?? TOAST_CONSTANTS.fallbackColors.success,
          textColor: TOAST_CONSTANTS.fallbackColors.successForeground,
        };
      case 'error':
        return {
          backgroundColor: colors.destructive,
          textColor: colors.destructiveForeground,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning ?? TOAST_CONSTANTS.fallbackColors.warning,
          textColor: TOAST_CONSTANTS.fallbackColors.warningForeground,
        };
      default:
        return {
          backgroundColor: colors.card,
          textColor: colors.foreground,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      entering={animationsEnabled ? SlideInUp.springify().damping(20).stiffness(200) : undefined}
      exiting={animationsEnabled ? FadeOut.duration(TOAST_CONSTANTS.fadeOutDuration) : undefined}
      layout={animationsEnabled ? Layout.springify().damping(20) : undefined}
      style={[
        styles.toast,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderRadius: radius.lg,
          padding: spacing[4],
          marginHorizontal: spacing[4],
          marginBottom: spacing[2],
        },
        platformShadow('lg'),
      ]}
    >
      <Pressable
        style={styles.toastContent}
        onPress={onDismiss}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: variantStyles.textColor }]}>
            {data.title}
          </Text>
          {data.description && (
            <Text
              style={[
                styles.description,
                {
                  color: variantStyles.textColor,
                  opacity: 0.9,
                  marginTop: spacing[1],
                },
              ]}
            >
              {data.description}
            </Text>
          )}
        </View>
        {data.action && (
          <Pressable
            onPress={() => {
              data.action?.onPress();
              onDismiss();
            }}
            style={[
              styles.actionButton,
              {
                marginLeft: spacing[3],
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1.5],
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: radius.md,
              },
            ]}
          >
            <Text style={[styles.actionText, { color: variantStyles.textColor }]}>
              {data.action.label}
            </Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toast: {
    width: SCREEN_WIDTH - TOAST_CONSTANTS.widthMargin,
    alignSelf: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
  },
  actionButton: {},
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
