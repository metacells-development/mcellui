import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function SectionHeaderDemo() {
  const { colors, spacing, radius } = useTheme();

  const handleSeeAll = (section: string) => {
    Alert.alert('See All', `Navigate to ${section} section`);
  };

  const containerStyle = {
    gap: spacing[6], // 24px
  };

  const sizesContainerStyle = {
    gap: spacing[4], // 16px
  };

  const contextContainerStyle = {
    gap: spacing[3], // 12px
  };

  const cardsRowStyle = {
    flexDirection: 'row' as const,
    gap: spacing[3], // 12px
  };

  const cardPlaceholderStyle = {
    height: 80, // Semantic dimension
    backgroundColor: colors.backgroundMuted,
    borderRadius: radius.md, // 8px
  };

  return (
    <View style={containerStyle}>
      <Section title="Basic">
        <SectionHeader title="Popular Items" />
      </Section>

      <Section title="With Action">
        <SectionHeader
          title="Recent Orders"
          onAction={() => handleSeeAll('Orders')}
        />
      </Section>

      <Section title="Custom Action Text">
        <SectionHeader
          title="Products"
          actionText="View All"
          onAction={() => handleSeeAll('Products')}
        />
      </Section>

      <Section title="With Subtitle">
        <SectionHeader
          title="Recommendations"
          subtitle="Based on your preferences"
          onAction={() => handleSeeAll('Recommendations')}
        />
      </Section>

      <Section title="Sizes">
        <View style={sizesContainerStyle}>
          <SectionHeader
            title="Small Header"
            size="sm"
            onAction={() => handleSeeAll('Small')}
          />
          <SectionHeader
            title="Medium Header"
            size="md"
            onAction={() => handleSeeAll('Medium')}
          />
          <SectionHeader
            title="Large Header"
            size="lg"
            onAction={() => handleSeeAll('Large')}
          />
        </View>
      </Section>

      <Section title="Without Arrow">
        <SectionHeader
          title="Settings"
          actionText="Edit"
          showActionArrow={false}
          onAction={() => handleSeeAll('Settings')}
        />
      </Section>

      <Section title="In Context">
        <View style={contextContainerStyle}>
          <SectionHeader
            title="Featured"
            onAction={() => handleSeeAll('Featured')}
          />
          <View style={cardsRowStyle}>
            {[1, 2, 3].map((item) => (
              <Card key={item} style={styles.contextCard}>
                <CardContent style={styles.cardContent}>
                  <View style={cardPlaceholderStyle} />
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </Section>

      <Section title="No Action (Title Only)">
        <SectionHeader
          title="Information"
          subtitle="Read-only section header"
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  contextCard: {
    flex: 1,
  },
  cardContent: {
    padding: 0,
  },
});
