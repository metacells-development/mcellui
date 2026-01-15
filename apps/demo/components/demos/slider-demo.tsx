import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@nativeui/core';
import { Slider } from '../ui/slider';

export function SliderDemo() {
  const { spacing, colors } = useTheme();
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);
  const [price, setPrice] = useState(250);
  const [rating, setRating] = useState(3);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>Basic</Text>
      <Slider
        value={volume}
        onValueChange={setVolume}
        label="Volume"
        showValue
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Size Variants</Text>
      <Slider
        value={brightness}
        onValueChange={setBrightness}
        size="sm"
        label="Small"
        showValue
      />
      <View style={{ height: spacing[4] }} />
      <Slider
        value={brightness}
        onValueChange={setBrightness}
        size="md"
        label="Medium"
        showValue
      />
      <View style={{ height: spacing[4] }} />
      <Slider
        value={brightness}
        onValueChange={setBrightness}
        size="lg"
        label="Large"
        showValue
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Custom Range & Format</Text>
      <Slider
        value={price}
        onValueChange={setPrice}
        min={0}
        max={1000}
        step={50}
        label="Price Range"
        showValue
        formatValue={(v) => `$${v}`}
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>With Steps</Text>
      <Slider
        value={rating}
        onValueChange={setRating}
        min={1}
        max={5}
        step={1}
        label="Rating"
        showValue
        formatValue={(v) => `${v} ⭐`}
      />

      <View style={{ height: spacing[6] }} />

      <Text style={[styles.title, { color: colors.foreground }]}>Disabled</Text>
      <Slider
        value={50}
        label="Locked"
        showValue
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
