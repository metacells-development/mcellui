import React, { useState } from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';
import { Card, CardContent } from '@/components/ui/card';

export function DateTimePickerDemo() {
  const { colors, spacing, fontSize } = useTheme();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [datetime, setDatetime] = useState(new Date());
  const [birthday, setBirthday] = useState(new Date(1990, 0, 1));
  const [appointment, setAppointment] = useState(new Date());

  // Min date: today, Max date: 1 year from now
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const hintStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    color: colors.foregroundMuted,
    marginTop: spacing[1], // 4px
  };

  return (
    <View style={containerStyle}>
      <Section title="Modes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <DateTimePicker
              mode="date"
              value={date}
              onChange={setDate}
              label="Date Only"
            />
            <DateTimePicker
              mode="time"
              value={time}
              onChange={setTime}
              label="Time Only"
            />
            <DateTimePicker
              mode="datetime"
              value={datetime}
              onChange={setDatetime}
              label="Date & Time"
            />
          </CardContent>
        </Card>
      </Section>

      <Section title="States">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <DateTimePicker
              mode="date"
              value={date}
              onChange={setDate}
              label="Default"
            />
            <DateTimePicker
              mode="date"
              value={date}
              onChange={setDate}
              label="Disabled"
              disabled
            />
            <DateTimePicker
              mode="date"
              value={date}
              onChange={setDate}
              label="Error State"
              error="Date is required"
            />
          </CardContent>
        </Card>
      </Section>

      <Section title="Features">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <DateTimePicker
                mode="time"
                value={time}
                onChange={setTime}
                label="24-Hour Format"
                is24Hour
              />
              <Text style={hintStyle}>Military time format</Text>
            </View>
            <View>
              <DateTimePicker
                mode="date"
                value={appointment}
                onChange={setAppointment}
                label="Date with Constraints"
                minimumDate={minDate}
                maximumDate={maxDate}
              />
              <Text style={hintStyle}>Only next year selectable</Text>
            </View>
            <View>
              <DateTimePicker
                mode="date"
                value={birthday}
                onChange={setBirthday}
                label="Past Dates Only"
                maximumDate={new Date()}
              />
              <Text style={hintStyle}>Birth date cannot be in future</Text>
            </View>
            <View>
              <DateTimePicker
                mode="date"
                value={date}
                onChange={setDate}
                label="Custom Placeholder"
                placeholder="Choose delivery date"
              />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Use Cases">
        <View>
          <Text style={[hintStyle, { marginBottom: spacing[2], textAlign: 'center' }]}>
            Appointment Booking
          </Text>
          <Card>
            <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
              <DateTimePicker
                mode="date"
                value={appointment}
                onChange={setAppointment}
                label="Appointment Date"
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                placeholder="Select a date"
              />
              <DateTimePicker
                mode="time"
                value={appointment}
                onChange={setAppointment}
                label="Appointment Time"
                is24Hour={false}
                placeholder="Select a time"
              />
              <Text style={hintStyle}>
                Available slots: 9:00 AM - 5:00 PM, Monday - Friday
              </Text>
            </CardContent>
          </Card>
        </View>
      </Section>
    </View>
  );
}
