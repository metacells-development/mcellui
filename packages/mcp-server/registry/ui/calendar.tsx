/**
 * Calendar
 *
 * Date grid for visual date selection with single, range, and multiple modes.
 * Perfect for booking apps, event calendars, and date range selection.
 *
 * @example
 * ```tsx
 * // Single date
 * <Calendar
 *   mode="single"
 *   value={selectedDate}
 *   onValueChange={setSelectedDate}
 * />
 *
 * // Date range
 * <Calendar
 *   mode="range"
 *   value={{ start: startDate, end: endDate }}
 *   onValueChange={setDateRange}
 * />
 *
 * // Multiple dates
 * <Calendar
 *   mode="multiple"
 *   value={selectedDates}
 *   onValueChange={setSelectedDates}
 * />
 * ```
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type CalendarMode = 'single' | 'range' | 'multiple';
export type CalendarSize = 'sm' | 'md';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface MarkedDate {
  /** Dot color */
  dotColor?: string;
  /** Whether date is disabled */
  disabled?: boolean;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
}

export interface CalendarProps {
  /** Selection mode */
  mode?: CalendarMode;
  /** Selected value (Date for single, DateRange for range, Date[] for multiple) */
  value?: Date | DateRange | Date[];
  /** Called when value changes */
  onValueChange?: (value: Date | DateRange | Date[]) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Marked dates with custom styling */
  markedDates?: Record<string, MarkedDate>;
  /** Size variant */
  size?: CalendarSize;
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1;
  /** Whether to show week numbers */
  showWeekNumbers?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Constants
// ============================================================================

const WEEKDAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ============================================================================
// Helpers
// ============================================================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// ============================================================================
// Day Cell Component
// ============================================================================

function DayCell({
  date,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isInSelectedRange,
  isToday,
  isDisabled,
  isOutsideMonth,
  marked,
  size,
  onPress,
}: {
  date: Date;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInSelectedRange: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isOutsideMonth: boolean;
  marked?: MarkedDate;
  size: CalendarSize;
  onPress: (date: Date) => void;
}) {
  const { colors, radius, components } = useTheme();
  const config = components.calendar[size];

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!isDisabled) {
      haptic('light');
      onPress(date);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBackgroundColor = () => {
    if (marked?.backgroundColor) return marked.backgroundColor;
    if (isSelected || isRangeStart || isRangeEnd) return colors.primary;
    if (isInSelectedRange) return colors.primary + '30';
    return 'transparent';
  };

  const getTextColor = () => {
    if (marked?.textColor) return marked.textColor;
    if (isDisabled) return colors.foregroundMuted;
    if (isOutsideMonth) return colors.foregroundMuted + '60';
    if (isSelected || isRangeStart || isRangeEnd) return colors.primaryForeground;
    if (isToday) return colors.primary;
    return colors.foreground;
  };

  const getBorderRadius = () => {
    if (isRangeStart && !isRangeEnd) return { borderTopLeftRadius: radius.full, borderBottomLeftRadius: radius.full };
    if (isRangeEnd && !isRangeStart) return { borderTopRightRadius: radius.full, borderBottomRightRadius: radius.full };
    if (isSelected || (isRangeStart && isRangeEnd)) return { borderRadius: radius.full };
    if (isInSelectedRange) return {};
    return { borderRadius: radius.full };
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          styles.dayCell,
          {
            width: config.daySize,
            height: config.daySize,
            backgroundColor: getBackgroundColor(),
            opacity: isDisabled ? 0.4 : 1,
          },
          getBorderRadius(),
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              fontSize: config.fontSize,
              color: getTextColor(),
              fontWeight: isToday || isSelected ? '600' : '400',
            },
          ]}
        >
          {date.getDate()}
        </Text>

        {/* Marked dot */}
        {marked?.dotColor && (
          <View
            style={[
              styles.dot,
              {
                backgroundColor: marked.dotColor,
                borderRadius: radius.xs,
              },
            ]}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function Calendar({
  mode = 'single',
  value,
  onValueChange,
  minDate,
  maxDate,
  markedDates,
  size = 'md',
  firstDayOfWeek = 0,
  showWeekNumbers = false,
  style,
}: CalendarProps) {
  const { colors, spacing, radius, components } = useTheme();
  const config = components.calendar[size];

  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    if (mode === 'single' && value instanceof Date) {
      return new Date(value.getFullYear(), value.getMonth(), 1);
    }
    if (mode === 'range' && value && 'start' in value) {
      return new Date(value.start.getFullYear(), value.start.getMonth(), 1);
    }
    if (mode === 'multiple' && Array.isArray(value) && value.length > 0) {
      return new Date(value[0].getFullYear(), value[0].getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // For range selection, track the first selected date
  const [rangeStart, setRangeStart] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Get weekday headers (adjusted for firstDayOfWeek)
  const weekdays = useMemo(() => {
    const days = [...WEEKDAYS_SHORT];
    if (firstDayOfWeek === 1) {
      days.push(days.shift()!);
    }
    return days;
  }, [firstDayOfWeek]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const adjustedFirstDay = firstDayOfWeek === 1 ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;

    const days: Date[] = [];

    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 weeks

    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(nextYear, nextMonth, i));
    }

    return days;
  }, [year, month, firstDayOfWeek]);

  const handlePrevMonth = () => {
    haptic('light');
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    haptic('light');
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (date: Date) => {
    if (mode === 'single') {
      onValueChange?.(date);
    } else if (mode === 'range') {
      if (!rangeStart) {
        setRangeStart(date);
        onValueChange?.({ start: date, end: date });
      } else {
        const start = date < rangeStart ? date : rangeStart;
        const end = date < rangeStart ? rangeStart : date;
        setRangeStart(null);
        onValueChange?.({ start, end });
      }
    } else if (mode === 'multiple') {
      const current = (value as Date[]) || [];
      const exists = current.findIndex((d) => isSameDay(d, date));

      if (exists >= 0) {
        onValueChange?.(current.filter((_, i) => i !== exists));
      } else {
        onValueChange?.([...current, date]);
      }
    }
  };

  const isDateSelected = (date: Date): boolean => {
    if (mode === 'single') {
      return value instanceof Date && isSameDay(value, date);
    }
    if (mode === 'multiple') {
      return Array.isArray(value) && value.some((d) => isSameDay(d, date));
    }
    return false;
  };

  const isDateDisabled = (date: Date): boolean => {
    const marked = markedDates?.[formatDateKey(date)];
    if (marked?.disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getRangeInfo = (date: Date) => {
    if (mode !== 'range' || !value || !('start' in value)) {
      return { isRangeStart: false, isRangeEnd: false, isInRange: false };
    }

    const { start, end } = value as DateRange;

    return {
      isRangeStart: isSameDay(date, start),
      isRangeEnd: isSameDay(date, end),
      isInRange: isInRange(date, start, end) && !isSameDay(date, start) && !isSameDay(date, end),
    };
  };

  // Split days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: config.containerPadding }, style]}>
      {/* Header */}
      <View style={[styles.header, { marginBottom: spacing[3] }]}>
        <Pressable onPress={handlePrevMonth} style={{ padding: config.navButtonPadding }}>
          <ChevronLeftIcon size={20} color={colors.foreground} />
        </Pressable>

        <Text style={[styles.headerTitle, { fontSize: config.headerFontSize, color: colors.foreground }]}>
          {MONTHS[month]} {year}
        </Text>

        <Pressable onPress={handleNextMonth} style={{ padding: config.navButtonPadding }}>
          <ChevronRightIcon size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={[styles.weekRow, { gap: config.gap }]}>
        {showWeekNumbers && <View style={{ width: config.weekNumberWidth }} />}
        {weekdays.map((day) => (
          <View key={day} style={[styles.dayCell, { width: config.daySize, height: 24 }]}>
            <Text style={[styles.weekdayText, { fontSize: config.fontSize - 2, color: colors.foregroundMuted }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={[styles.grid, { gap: config.gap }]}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={[styles.weekRow, { gap: config.gap }]}>
            {showWeekNumbers && (
              <View style={[styles.weekNumber, { width: config.weekNumberWidth }]}>
                <Text style={[styles.weekNumberText, { color: colors.foregroundMuted }]}>
                  {getWeekNumber(week[0])}
                </Text>
              </View>
            )}
            {week.map((date) => {
              const { isRangeStart, isRangeEnd, isInRange } = getRangeInfo(date);
              const marked = markedDates?.[formatDateKey(date)];

              return (
                <DayCell
                  key={date.toISOString()}
                  date={date}
                  isSelected={isDateSelected(date)}
                  isRangeStart={isRangeStart}
                  isRangeEnd={isRangeEnd}
                  isInSelectedRange={isInRange}
                  isToday={isSameDay(date, today)}
                  isDisabled={isDateDisabled(date)}
                  isOutsideMonth={date.getMonth() !== month}
                  marked={marked}
                  size={size}
                  onPress={handleDayPress}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontWeight: '600',
  },
  grid: {},
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {},
  weekdayText: {
    fontWeight: '500',
  },
  weekNumber: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNumberText: {
    fontSize: 10,
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    // Dynamic borderRadius applied inline via radius tokens
  },
});
