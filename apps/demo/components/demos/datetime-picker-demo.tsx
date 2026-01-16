import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

export function DateTimePickerDemo() {
  const { colors } = useTheme();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [datetime, setDatetime] = useState(new Date());
  const [birthday, setBirthday] = useState(new Date(1990, 0, 1));
  const [appointment, setAppointment] = useState(new Date());

  // Min date: today, Max date: 1 year from now
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <View style={styles.container}>
      <Section title="Date Picker">
        <DateTimePicker
          mode="date"
          value={date}
          onChange={setDate}
          label="Select Date"
        />
      </Section>

      <Section title="Time Picker">
        <DateTimePicker
          mode="time"
          value={time}
          onChange={setTime}
          label="Select Time"
        />
      </Section>

      <Section title="24-Hour Format">
        <DateTimePicker
          mode="time"
          value={time}
          onChange={setTime}
          label="Time (24h)"
          is24Hour
        />
      </Section>

      <Section title="Date & Time">
        <DateTimePicker
          mode="datetime"
          value={datetime}
          onChange={setDatetime}
          label="Event Date & Time"
        />
      </Section>

      <Section title="With Constraints">
        <DateTimePicker
          mode="date"
          value={appointment}
          onChange={setAppointment}
          label="Appointment (next year only)"
          minimumDate={minDate}
          maximumDate={maxDate}
        />
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Only dates within the next year can be selected
        </Text>
      </Section>

      <Section title="Birthday (Past dates)">
        <DateTimePicker
          mode="date"
          value={birthday}
          onChange={setBirthday}
          label="Date of Birth"
          maximumDate={new Date()}
        />
      </Section>

      <Section title="With Error">
        <DateTimePicker
          mode="date"
          value={date}
          onChange={setDate}
          label="Required Field"
          error="Please select a valid date"
        />
      </Section>

      <Section title="Disabled">
        <DateTimePicker
          mode="date"
          value={date}
          onChange={setDate}
          label="Locked Date"
          disabled
        />
      </Section>

      <Section title="Custom Placeholder">
        <DateTimePicker
          mode="date"
          value={date}
          onChange={setDate}
          label="Delivery Date"
          placeholder="Choose when to receive your order"
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
});
