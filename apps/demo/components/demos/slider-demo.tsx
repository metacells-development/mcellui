import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slider } from '@/components/ui/slider';
import { Section } from './section';

export function SliderDemo() {
  const [volume, setVolume] = useState(50);
  const [price, setPrice] = useState(250);
  const [rating, setRating] = useState(3);

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Slider
          size="sm"
          value={volume}
          onValueChange={setVolume}
          label="Small"
          showValue
        />
        <Slider
          size="md"
          value={volume}
          onValueChange={setVolume}
          label="Medium"
          showValue
        />
        <Slider
          size="lg"
          value={volume}
          onValueChange={setVolume}
          label="Large"
          showValue
        />
      </Section>

      <Section title="Features">
        <Slider
          value={volume}
          onValueChange={setVolume}
          label="Volume"
          showValue
        />
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
      </Section>

      <Section title="States">
        <Slider
          value={volume}
          onValueChange={setVolume}
          label="Default"
          showValue
        />
        <Slider
          value={50}
          label="Disabled"
          showValue
          disabled
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
