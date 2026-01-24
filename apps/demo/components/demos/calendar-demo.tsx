import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

export function CalendarDemo() {
  const { colors, spacing } = useTheme();
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

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'None';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatRange = (range: { start: Date; end: Date } | undefined) => {
    if (!range) return 'None';
    return `${formatDate(range.start)} - ${formatDate(range.end)}`;
  };

  // Example marked dates (holidays, events, etc.)
  const markedDates: Record<string, { dot?: boolean; dotColor?: string; selected?: boolean }> = {
    [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.success,
    },
    [new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.warning,
    },
    [new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: {
      dot: true,
      dotColor: colors.destructive,
    },
  };

  return (
    <View style={styles.container}>
      <Section title="Single Date Selection">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Calendar
              mode="single"
              value={singleDate}
              onValueChange={setSingleDate}
            />
            <Text style={[styles.selectedText, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Selected: {formatDate(singleDate)}
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Date Range Selection">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Calendar
              mode="range"
              value={rangeValue}
              onValueChange={setRangeValue}
            />
            <Text style={[styles.selectedText, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Range: {formatRange(rangeValue)}
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Multiple Date Selection">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Calendar
              mode="multiple"
              value={multipleDates}
              onValueChange={setMultipleDates}
            />
            <Text style={[styles.selectedText, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Selected: {multipleDates.length} dates
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Marked Dates">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Calendar
              mode="single"
              markedDates={markedDates}
            />
            <View style={{ marginTop: spacing[3], gap: spacing[1] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <View style={[styles.dot, { backgroundColor: colors.success }]} />
                <Text style={{ color: colors.foregroundMuted, fontSize: 12 }}>Available</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                <Text style={{ color: colors.foregroundMuted, fontSize: 12 }}>Limited</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <View style={[styles.dot, { backgroundColor: colors.destructive }]} />
                <Text style={{ color: colors.foregroundMuted, fontSize: 12 }}>Booked</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Min/Max Dates">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Calendar
              mode="single"
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            />
            <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Only next 30 days are selectable
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Compact Size">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Calendar
              mode="single"
              size="sm"
            />
          </CardContent>
        </Card>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  selectedText: {
    fontSize: 13,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
