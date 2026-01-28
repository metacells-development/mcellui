import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Card } from '@/components/ui/card';

export function SegmentedControlDemo() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const [period, setPeriod] = useState('daily');
  const [view, setView] = useState('list');
  const [size, setSize] = useState('md');

  return (
    <View style={styles.container}>
      {/* Basic */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={{ color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
          Basic
        </Text>
        <SegmentedControl
          value={period}
          onValueChange={setPeriod}
          segments={[
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ]}
        />
        <Text style={{ color: colors.foregroundMuted, marginTop: spacing[2], fontSize: fontSize.sm }}>
          Selected: {period}
        </Text>
      </View>

      {/* Two Segments */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={{ color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
          Two Segments
        </Text>
        <SegmentedControl
          value={view}
          onValueChange={setView}
          segments={[
            { label: 'List', value: 'list' },
            { label: 'Grid', value: 'grid' },
          ]}
        />
        <Card style={{ marginTop: spacing[4] }}>
          <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
            Showing content as: {view}
          </Text>
        </Card>
      </View>

      {/* Sizes */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={{ color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
          Sizes
        </Text>

        <Text style={{ color: colors.foregroundMuted, marginBottom: spacing[2], fontSize: fontSize.sm }}>
          Small
        </Text>
        <SegmentedControl
          value={size}
          onValueChange={setSize}
          size="sm"
          segments={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]}
        />

        <Text style={{ color: colors.foregroundMuted, marginTop: spacing[4], marginBottom: spacing[2], fontSize: fontSize.sm }}>
          Medium (Default)
        </Text>
        <SegmentedControl
          value={size}
          onValueChange={setSize}
          size="md"
          segments={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]}
        />

        <Text style={{ color: colors.foregroundMuted, marginTop: spacing[4], marginBottom: spacing[2], fontSize: fontSize.sm }}>
          Large
        </Text>
        <SegmentedControl
          value={size}
          onValueChange={setSize}
          size="lg"
          segments={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ]}
        />
      </View>

      {/* With Disabled Segment */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={{ color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
          With Disabled Segment
        </Text>
        <SegmentedControl
          value="free"
          onValueChange={() => {}}
          segments={[
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro', disabled: true },
            { label: 'Enterprise', value: 'enterprise', disabled: true },
          ]}
        />
        <Text style={{ color: colors.foregroundMuted, marginTop: spacing[2], fontSize: fontSize.xs }}>
          Pro and Enterprise require a subscription
        </Text>
      </View>

      {/* Disabled Control */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={{ color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
          Disabled Control
        </Text>
        <SegmentedControl
          value="option1"
          onValueChange={() => {}}
          disabled
          segments={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
        />
      </View>

      {/* Filter Example */}
      <View style={styles.section}>
        <Text style={{ color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
          Filter Example
        </Text>
        <FilterExample />
      </View>
    </View>
  );
}

function FilterExample() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const [status, setStatus] = useState('all');

  const items = [
    { id: 1, name: 'Task 1', status: 'active' },
    { id: 2, name: 'Task 2', status: 'completed' },
    { id: 3, name: 'Task 3', status: 'active' },
    { id: 4, name: 'Task 4', status: 'completed' },
    { id: 5, name: 'Task 5', status: 'active' },
  ];

  const filteredItems = status === 'all'
    ? items
    : items.filter(item => item.status === status);

  return (
    <View>
      <SegmentedControl
        value={status}
        onValueChange={setStatus}
        segments={[
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Completed', value: 'completed' },
        ]}
      />
      <View style={{ marginTop: spacing[4] }}>
        {filteredItems.map(item => (
          <View
            key={item.id}
            style={[
              styles.listItem,
              {
                backgroundColor: colors.backgroundMuted,
                borderRadius: 8,
                marginBottom: spacing[2],
                padding: spacing[3],
              },
            ]}
          >
            <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: item.status === 'completed' ? colors.primary : colors.foregroundMuted,
                fontSize: fontSize.xs,
                textTransform: 'capitalize',
              }}
            >
              {item.status}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {},
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
