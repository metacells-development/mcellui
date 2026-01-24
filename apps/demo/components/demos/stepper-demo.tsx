import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stepper } from '@/components/ui/stepper';
import { Section } from './section';

export function StepperDemo() {
  const [quantity, setQuantity] = useState(1);
  const [guests, setGuests] = useState(2);
  const [items, setItems] = useState(5);
  const [atMin, setAtMin] = useState(1);
  const [atMax, setAtMax] = useState(10);

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <Stepper
          size="sm"
          value={quantity}
          onValueChange={setQuantity}
          label="Small"
        />
        <Stepper
          size="md"
          value={quantity}
          onValueChange={setQuantity}
          label="Medium"
        />
        <Stepper
          size="lg"
          value={quantity}
          onValueChange={setQuantity}
          label="Large"
        />
      </Section>

      <Section title="Variants">
        <Stepper
          variant="default"
          value={guests}
          onValueChange={setGuests}
          label="Default"
        />
        <Stepper
          variant="outline"
          value={guests}
          onValueChange={setGuests}
          label="Outline"
        />
        <Stepper
          variant="ghost"
          value={guests}
          onValueChange={setGuests}
          label="Ghost"
        />
      </Section>

      <Section title="Features">
        <Stepper
          value={quantity}
          onValueChange={setQuantity}
          min={1}
          max={10}
          label="Quantity (1-10)"
        />
        <Stepper
          value={items}
          onValueChange={setItems}
          min={0}
          max={99}
          label="Items in Cart"
          formatValue={(v) => v.toString().padStart(2, '0')}
        />
      </Section>

      <Section title="States">
        <Stepper
          value={quantity}
          onValueChange={setQuantity}
          label="Default"
        />
        <Stepper
          value={atMin}
          onValueChange={setAtMin}
          min={1}
          max={10}
          label="At Minimum (- button disabled)"
        />
        <Stepper
          value={atMax}
          onValueChange={setAtMax}
          min={1}
          max={10}
          label="At Maximum (+ button disabled)"
        />
        <Stepper
          value={5}
          label="Disabled"
          disabled
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
