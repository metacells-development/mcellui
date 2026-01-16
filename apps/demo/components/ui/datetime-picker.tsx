/**
 * DateTimePicker
 *
 * Date and time selection via bottom sheet with native pickers.
 * Supports date, time, and datetime modes.
 *
 * @example
 * ```tsx
 * // Date picker
 * const [date, setDate] = useState(new Date());
 * <DateTimePicker
 *   mode="date"
 *   value={date}
 *   onChange={setDate}
 *   label="Birth Date"
 * />
 *
 * // Time picker
 * <DateTimePicker
 *   mode="time"
 *   value={time}
 *   onChange={setTime}
 *   label="Reminder Time"
 * />
 *
 * // DateTime picker
 * <DateTimePicker
 *   mode="datetime"
 *   value={datetime}
 *   onChange={setDatetime}
 *   label="Event Date & Time"
 * />
 *
 * // With min/max dates
 * <DateTimePicker
 *   mode="date"
 *   value={date}
 *   onChange={setDate}
 *   minimumDate={new Date()}
 *   maximumDate={new Date(2030, 11, 31)}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme, haptic } from '@nativeui/core';

// Try to import native picker - may fail in Expo Go
let DateTimePickerNative: typeof import('@react-native-community/datetimepicker').default | null = null;
let isNativePickerAvailable = false;

try {
  const picker = require('@react-native-community/datetimepicker');
  DateTimePickerNative = picker.default;
  isNativePickerAvailable = true;
} catch {
  // Native picker not available (Expo Go)
  isNativePickerAvailable = false;
}

type DateTimePickerEvent = {
  type: string;
  nativeEvent: { timestamp: number };
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type DateTimePickerMode = 'date' | 'time' | 'datetime';

export interface DateTimePickerProps {
  /** Current value */
  value: Date;
  /** Change handler */
  onChange: (date: Date) => void;
  /** Picker mode */
  mode?: DateTimePickerMode;
  /** Label shown above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum selectable date */
  minimumDate?: Date;
  /** Maximum selectable date */
  maximumDate?: Date;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** 24-hour time format (for time mode) */
  is24Hour?: boolean;
  /** Custom format function */
  formatValue?: (date: Date, mode: DateTimePickerMode) => string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default formatters
// ─────────────────────────────────────────────────────────────────────────────

function defaultFormatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function defaultFormatTime(date: Date, is24Hour: boolean): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour,
  });
}

function defaultFormatDateTime(date: Date, is24Hour: boolean): string {
  return `${defaultFormatDate(date)}, ${defaultFormatTime(date, is24Hour)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// DateTimePicker Component
// ─────────────────────────────────────────────────────────────────────────────

export function DateTimePicker({
  value,
  onChange,
  mode = 'date',
  label,
  placeholder,
  minimumDate,
  maximumDate,
  disabled = false,
  error,
  is24Hour = false,
  formatValue,
}: DateTimePickerProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [currentPickerMode, setCurrentPickerMode] = useState<'date' | 'time'>(
    mode === 'time' ? 'time' : 'date'
  );

  const translateY = useSharedValue(300);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    setTempValue(value);
    setCurrentPickerMode(mode === 'time' ? 'time' : 'date');
    setIsOpen(true);
    haptic('light');
    backdropOpacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
  }, [value, mode, backdropOpacity, translateY]);

  const close = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 150 });
    translateY.value = withTiming(300, {
      duration: 200,
      easing: Easing.in(Easing.ease),
    });
    setTimeout(() => setIsOpen(false), 200);
  }, [backdropOpacity, translateY]);

  const handleConfirm = useCallback(() => {
    if (mode === 'datetime' && currentPickerMode === 'date') {
      // Move to time picker
      setCurrentPickerMode('time');
      haptic('light');
      return;
    }
    onChange(tempValue);
    haptic('success');
    close();
  }, [mode, currentPickerMode, tempValue, onChange, close]);

  const handleCancel = useCallback(() => {
    haptic('light');
    close();
  }, [close]);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      if (selectedDate) {
        setTempValue(selectedDate);
      }
    },
    []
  );

  // Swipe to dismiss gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 80 || event.velocityY > 500) {
        translateY.value = withTiming(300, { duration: 200 });
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

  // Format displayed value
  const displayValue = formatValue
    ? formatValue(value, mode)
    : mode === 'date'
    ? defaultFormatDate(value)
    : mode === 'time'
    ? defaultFormatTime(value, is24Hour)
    : defaultFormatDateTime(value, is24Hour);

  const defaultPlaceholder =
    mode === 'date'
      ? 'Select date'
      : mode === 'time'
      ? 'Select time'
      : 'Select date & time';

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.foreground,
              fontSize: fontSize.sm,
              fontWeight: fontWeight.medium,
              marginBottom: spacing[2],
            },
          ]}
        >
          {label}
        </Text>
      )}

      <Pressable
        onPress={disabled ? undefined : open}
        style={({ pressed }) => [
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: error ? colors.destructive : colors.border,
            borderRadius: radius.lg,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label || defaultPlaceholder}
        accessibilityState={{ disabled }}
      >
        <Text
          style={[
            styles.inputText,
            {
              color: value ? colors.foreground : colors.foregroundMuted,
              fontSize: fontSize.base,
            },
          ]}
        >
          {displayValue || placeholder || defaultPlaceholder}
        </Text>
        <View style={styles.iconContainer}>
          <CalendarIcon color={colors.foregroundMuted} />
        </View>
      </Pressable>

      {error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.destructive,
              fontSize: fontSize.sm,
              marginTop: spacing[1],
            },
          ]}
        >
          {error}
        </Text>
      )}

      {/* Bottom Sheet Modal */}
      <Modal visible={isOpen} transparent animationType="none" statusBarTranslucent>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
          </Animated.View>

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
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>

              {/* Header */}
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
                <Pressable onPress={handleCancel}>
                  <Text
                    style={[
                      styles.headerButton,
                      { color: colors.foregroundMuted, fontSize: fontSize.base },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      color: colors.foreground,
                      fontSize: fontSize.base,
                      fontWeight: fontWeight.semibold,
                    },
                  ]}
                >
                  {mode === 'datetime'
                    ? currentPickerMode === 'date'
                      ? 'Select Date'
                      : 'Select Time'
                    : mode === 'date'
                    ? 'Select Date'
                    : 'Select Time'}
                </Text>
                <Pressable onPress={handleConfirm}>
                  <Text
                    style={[
                      styles.headerButton,
                      {
                        color: colors.primary,
                        fontSize: fontSize.base,
                        fontWeight: fontWeight.semibold,
                      },
                    ]}
                  >
                    {mode === 'datetime' && currentPickerMode === 'date' ? 'Next' : 'Done'}
                  </Text>
                </Pressable>
              </View>

              {/* Picker */}
              <View style={styles.pickerContainer}>
                {isNativePickerAvailable && DateTimePickerNative ? (
                  <DateTimePickerNative
                    value={tempValue}
                    mode={currentPickerMode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    is24Hour={is24Hour}
                    style={styles.picker}
                    textColor={colors.foreground}
                  />
                ) : (
                  <View style={styles.expoGoFallback}>
                    <Text
                      style={[
                        styles.expoGoTitle,
                        {
                          color: colors.foreground,
                          fontSize: fontSize.lg,
                          fontWeight: fontWeight.semibold,
                        },
                      ]}
                    >
                      Development Build Required
                    </Text>
                    <Text
                      style={[
                        styles.expoGoText,
                        {
                          color: colors.foregroundMuted,
                          fontSize: fontSize.sm,
                        },
                      ]}
                    >
                      The native date picker is not available in Expo Go.{'\n'}
                      Create a development build to use this component.
                    </Text>
                    <Text
                      style={[
                        styles.expoGoCode,
                        {
                          color: colors.primary,
                          fontSize: fontSize.xs,
                          backgroundColor: colors.backgroundSubtle,
                          padding: spacing[2],
                          borderRadius: radius.sm,
                        },
                      ]}
                    >
                      npx expo run:ios{'\n'}npx expo run:android
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Icon
// ─────────────────────────────────────────────────────────────────────────────

function CalendarIcon({ color }: { color: string }) {
  return (
    <View style={styles.calendarIcon}>
      <View style={[styles.calendarTop, { backgroundColor: color }]} />
      <View style={[styles.calendarBody, { borderColor: color }]}>
        <View style={styles.calendarDots}>
          <View style={[styles.calendarDot, { backgroundColor: color }]} />
          <View style={[styles.calendarDot, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {},
  label: {},
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  inputText: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 8,
  },
  error: {},
  modalContainer: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {},
  headerTitle: {},
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  expoGoFallback: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  expoGoTitle: {
    textAlign: 'center',
  },
  expoGoText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  expoGoCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
    overflow: 'hidden',
  },
  calendarIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  calendarTop: {
    width: 14,
    height: 3,
    borderRadius: 1,
    marginBottom: 1,
  },
  calendarBody: {
    width: 16,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDots: {
    flexDirection: 'row',
    gap: 3,
  },
  calendarDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});
