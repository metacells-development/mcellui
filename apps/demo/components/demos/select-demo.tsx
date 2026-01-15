import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@nativeui/core';
import { Select } from '../ui/select';

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'France', value: 'fr' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
];

const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical', disabled: true },
];

const categories = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' },
  { label: 'Home & Garden', value: 'home' },
  { label: 'Sports', value: 'sports' },
];

export function SelectDemo() {
  const { spacing, colors } = useTheme();
  const [country, setCountry] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>Basic</Text>
      <Select
        label="Country"
        placeholder="Select a country"
        value={country}
        onValueChange={setCountry}
        options={countries}
        helperText="Choose your country of residence"
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>With Preselection</Text>
      <Select
        label="Priority"
        value={priority}
        onValueChange={setPriority}
        options={priorities}
        sheetTitle="Select Priority Level"
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Error State</Text>
      <Select
        label="Category"
        placeholder="Select category"
        value={category}
        onValueChange={setCategory}
        options={categories}
        error="Please select a category"
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Disabled</Text>
      <Select
        label="Region"
        placeholder="Not available"
        value=""
        options={[]}
        disabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
