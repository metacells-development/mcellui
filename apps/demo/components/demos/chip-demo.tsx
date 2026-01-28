import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Chip, ChipGroup } from '@/components/ui/chip';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

// Simple tag icon
function TagIcon({ color, width = 16, height = 16 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l-1 1H3a1 1 0 0 0-1 1v8l1 1 9 9a1 1 0 0 0 1.4 0l8-8a1 1 0 0 0 0-1.4L12 2zM7.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Simple star icon
function StarIcon({ color, width = 16, height = 16 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChipDemo() {
  const { colors, spacing, fontSize } = useTheme();
  const [selected1, setSelected1] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['electronics']);
  const [tags, setTags] = useState(['React Native', 'TypeScript', 'Expo']);

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

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <View style={{ gap: spacing[8] }}>
      {/* Sizes Section */}
      <Section title="Sizes">
        <ChipGroup>
          <Chip size="sm" selected>Small</Chip>
          <Chip size="md" selected>Medium</Chip>
          <Chip size="lg" selected>Large</Chip>
        </ChipGroup>
      </Section>

      {/* Variants Section */}
      <Section title="Variants">
        <View style={{ gap: spacing[3] }}>
          <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>Outline</Text>
          <ChipGroup>
            <Chip variant="outline" selected>Selected</Chip>
            <Chip variant="outline">Unselected</Chip>
          </ChipGroup>
          <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: spacing[2] }}>Filled</Text>
          <ChipGroup>
            <Chip variant="filled" selected>Selected</Chip>
            <Chip variant="filled">Unselected</Chip>
          </ChipGroup>
        </View>
      </Section>

      {/* States Section */}
      <Section title="States">
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
          <Chip selected disabled>Selected Disabled</Chip>
        </ChipGroup>
      </Section>

      {/* With Icons Section */}
      <Section title="With Icons">
        <ChipGroup>
          <Chip icon={<TagIcon />} selected>Sale</Chip>
          <Chip icon={<StarIcon />} selected>Featured</Chip>
          <Chip icon={<TagIcon />}>New</Chip>
        </ChipGroup>
      </Section>

      {/* Dismissible Chips Section */}
      <Section title="Dismissible Chips">
        <View style={{ gap: spacing[2] }}>
          <ChipGroup>
            {tags.map((tag) => (
              <Chip key={tag} onRemove={() => removeTag(tag)}>
                {tag}
              </Chip>
            ))}
          </ChipGroup>
          {tags.length === 0 && (
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
              All tags removed. Refresh to reset.
            </Text>
          )}
        </View>
      </Section>

      {/* ChipGroup Multi-select */}
      <Section title="Multi-select Filter">
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
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: spacing[2] }}>
          Selected: {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'None'}
        </Text>
      </Section>

      {/* Size x Variant Matrix */}
      <Section title="Size x Variant Matrix">
        <View style={{ gap: spacing[4] }}>
          <View style={{ gap: spacing[1] }}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>Small</Text>
            <ChipGroup>
              <Chip size="sm" variant="outline" selected>Outline</Chip>
              <Chip size="sm" variant="filled" selected>Filled</Chip>
            </ChipGroup>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>Medium</Text>
            <ChipGroup>
              <Chip size="md" variant="outline" selected>Outline</Chip>
              <Chip size="md" variant="filled" selected>Filled</Chip>
            </ChipGroup>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>Large</Text>
            <ChipGroup>
              <Chip size="lg" variant="outline" selected>Outline</Chip>
              <Chip size="lg" variant="filled" selected>Filled</Chip>
            </ChipGroup>
          </View>
        </View>
      </Section>
    </View>
  );
}
