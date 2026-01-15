import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@nativeui/core';
import { Stepper } from '../ui/stepper';

export function StepperDemo() {
  const { spacing, colors } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [guests, setGuests] = useState(2);
  const [items, setItems] = useState(5);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>Basic</Text>
      <Stepper
        value={quantity}
        onValueChange={setQuantity}
        min={1}
        max={10}
        label="Quantity"
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Size Variants</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>Small</Text>
          <Stepper value={quantity} onValueChange={setQuantity} size="sm" />
        </View>
        <View style={styles.column}>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>Medium</Text>
          <Stepper value={quantity} onValueChange={setQuantity} size="md" />
        </View>
        <View style={styles.column}>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>Large</Text>
          <Stepper value={quantity} onValueChange={setQuantity} size="lg" />
        </View>
      </View>

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Variants</Text>
      <View style={{ gap: spacing[4] }}>
        <View>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>Default</Text>
          <Stepper value={guests} onValueChange={setGuests} variant="default" />
        </View>
        <View>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>Outline</Text>
          <Stepper value={guests} onValueChange={setGuests} variant="outline" />
        </View>
        <View>
          <Text style={[styles.subtitle, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>Ghost</Text>
          <Stepper value={guests} onValueChange={setGuests} variant="ghost" />
        </View>
      </View>

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Custom Format</Text>
      <Stepper
        value={items}
        onValueChange={setItems}
        min={0}
        max={99}
        label="Items in Cart"
        formatValue={(v) => v.toString().padStart(2, '0')}
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Disabled</Text>
      <Stepper
        value={3}
        label="Locked"
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
  subtitle: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
});
