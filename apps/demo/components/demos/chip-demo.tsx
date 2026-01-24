import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, ChipGroup } from '@/components/ui/chip';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function ChipDemo() {
  const { colors } = useTheme();
  const [selected1, setSelected1] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['electronics']);

  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports' },
    { id: 'books', name: 'Books' },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Section title="Basic Chips">
        <ChipGroup>
          <Chip
            selected={selected1}
            onPress={() => setSelected1(!selected1)}
          >
            Toggle Me
          </Chip>
          <Chip selected>Selected</Chip>
          <Chip>Unselected</Chip>
          <Chip disabled>Disabled</Chip>
        </ChipGroup>
      </Section>

      <Section title="Sizes">
        <ChipGroup>
          <Chip size="sm" selected>Small</Chip>
          <Chip size="md" selected>Medium</Chip>
          <Chip size="lg" selected>Large</Chip>
        </ChipGroup>
      </Section>

      <Section title="Variants">
        <ChipGroup>
          <Chip variant="outline" selected>Outline</Chip>
          <Chip variant="outline">Outline</Chip>
          <Chip variant="filled" selected>Filled</Chip>
          <Chip variant="filled">Filled</Chip>
        </ChipGroup>
      </Section>

      <Section title="Category Filter (Multi-select)">
        <ChipGroup>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              selected={selectedCategories.includes(cat.id)}
              onPress={() => toggleCategory(cat.id)}
            >
              {cat.name}
            </Chip>
          ))}
        </ChipGroup>
      </Section>

      <Section title="Filter Pills">
        <ChipGroup>
          <Chip variant="filled" selected>All</Chip>
          <Chip variant="filled">New Arrivals</Chip>
          <Chip variant="filled">On Sale</Chip>
          <Chip variant="filled">Popular</Chip>
        </ChipGroup>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
});
