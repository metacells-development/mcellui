import React, { useState } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

export function CalendarDemo() {
  const { colors, spacing, fontSize } = useTheme();
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [rangeValue, setRangeValue] = useState<{ start: Date; end: Date } | undefined>({
    start: new Date(),
    end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });
  const [multipleDates, setMultipleDates] = useState<Date[]>([
    new Date(),
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  ]);
  const [constrainedDate, setConstrainedDate] = useState<Date | undefined>();
  const [bookingDate, setBookingDate] = useState<Date | undefined>();

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'None';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatRange = (range: { start: Date; end: Date } | undefined) => {
    if (!range) return 'None';
    return `${formatDate(range.start)} - ${formatDate(range.end)}`;
  };

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const selectedTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    textAlign: 'center',
  };

  const hintStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    color: colors.foregroundMuted,
    textAlign: 'center',
  };

  const dotStyle: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
  };

  const legendRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2], // 8px
  };

  const legendTextStyle: TextStyle = {
    color: colors.foregroundMuted,
    fontSize: fontSize.xs, // 12px
  };

  // Example marked dates for booking scenario
  const bookedDates: Record<string, { dot?: boolean; dotColor?: string }> = {
    // Past dates - unavailable (red)
    [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.destructive,
    },
    [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.destructive,
    },
    // Future dates - limited availability (orange)
    [new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.warning,
    },
    [new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.warning,
    },
    // Available dates (green)
    [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.success,
    },
    [new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.success,
    },
  };

  return (
    <View style={containerStyle}>
      <Section title="Sizes">
        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
          <View style={{ flex: 1 }}>
            <Text style={[hintStyle, { marginBottom: spacing[2] }]}>Small</Text>
            <Card>
              <CardContent style={{ paddingTop: spacing[4] }}>
                <Calendar
                  mode="single"
                  size="sm"
                  value={singleDate}
                  onValueChange={(value) => {
                    if (value instanceof Date) setSingleDate(value);
                  }}
                />
              </CardContent>
            </Card>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[hintStyle, { marginBottom: spacing[2] }]}>Medium (default)</Text>
            <Card>
              <CardContent style={{ paddingTop: spacing[4] }}>
                <Calendar
                  mode="single"
                  size="md"
                  value={singleDate}
                  onValueChange={(value) => {
                    if (value instanceof Date) setSingleDate(value);
                  }}
                />
              </CardContent>
            </Card>
          </View>
        </View>
      </Section>

      <Section title="Selection Modes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Single Date</Text>
              <Calendar
                mode="single"
                value={singleDate}
                onValueChange={(value) => {
                  if (value instanceof Date) setSingleDate(value);
                }}
              />
              <Text style={[selectedTextStyle, { marginTop: spacing[2] }]}>
                Selected: {formatDate(singleDate)}
              </Text>
            </View>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Date Range</Text>
              <Calendar
                mode="range"
                value={rangeValue}
                onValueChange={(value) => {
                  if (value && typeof value === 'object' && 'start' in value) {
                    setRangeValue(value as { start: Date; end: Date });
                  }
                }}
              />
              <Text style={[selectedTextStyle, { marginTop: spacing[2] }]}>
                Range: {formatRange(rangeValue)}
              </Text>
            </View>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Multiple Dates</Text>
              <Calendar
                mode="multiple"
                value={multipleDates}
                onValueChange={(value) => {
                  if (Array.isArray(value)) setMultipleDates(value);
                }}
              />
              <Text style={[selectedTextStyle, { marginTop: spacing[2] }]}>
                Selected: {multipleDates.length} dates
              </Text>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Features">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Week Numbers</Text>
              <Calendar
                mode="single"
                showWeekNumbers
              />
            </View>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>First Day: Sunday</Text>
              <Calendar
                mode="single"
                firstDayOfWeek={0}
              />
            </View>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>First Day: Monday</Text>
              <Calendar
                mode="single"
                firstDayOfWeek={1}
              />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="States">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Min/Max Date Constraints</Text>
              <Calendar
                mode="single"
                value={constrainedDate}
                onValueChange={(value) => {
                  if (value instanceof Date) setConstrainedDate(value);
                }}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
              <Text style={[hintStyle, { marginTop: spacing[2] }]}>
                Only next 30 days are selectable
              </Text>
            </View>
            <View>
              <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Marked Dates</Text>
              <Calendar
                mode="single"
                markedDates={bookedDates}
              />
              <View style={{ marginTop: spacing[3], gap: spacing[1] }}>
                <View style={legendRowStyle}>
                  <View style={[dotStyle, { backgroundColor: colors.success }]} />
                  <Text style={legendTextStyle}>Available</Text>
                </View>
                <View style={legendRowStyle}>
                  <View style={[dotStyle, { backgroundColor: colors.warning }]} />
                  <Text style={legendTextStyle}>Limited</Text>
                </View>
                <View style={legendRowStyle}>
                  <View style={[dotStyle, { backgroundColor: colors.destructive }]} />
                  <Text style={legendTextStyle}>Booked</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Use Cases">
        <View>
          <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>Hotel Booking Calendar</Text>
          <Card>
            <CardContent style={{ paddingTop: spacing[4] }}>
              <Calendar
                mode="range"
                value={rangeValue}
                onValueChange={(value) => {
                  if (value && typeof value === 'object' && 'start' in value) {
                    setRangeValue(value as { start: Date; end: Date });
                  }
                }}
                minDate={new Date()}
                markedDates={bookedDates}
              />
              <View style={{ marginTop: spacing[3] }}>
                <Text style={[selectedTextStyle, { marginBottom: spacing[2] }]}>
                  {rangeValue ? formatRange(rangeValue) : 'Select check-in and check-out dates'}
                </Text>
                <View style={{ gap: spacing[1] }}>
                  <View style={legendRowStyle}>
                    <View style={[dotStyle, { backgroundColor: colors.success }]} />
                    <Text style={legendTextStyle}>Available</Text>
                  </View>
                  <View style={legendRowStyle}>
                    <View style={[dotStyle, { backgroundColor: colors.warning }]} />
                    <Text style={legendTextStyle}>Few rooms left</Text>
                  </View>
                  <View style={legendRowStyle}>
                    <View style={[dotStyle, { backgroundColor: colors.destructive }]} />
                    <Text style={legendTextStyle}>Fully booked</Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </Section>
    </View>
  );
}
