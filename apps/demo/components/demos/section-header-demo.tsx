import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

export function SectionHeaderDemo() {
  const { colors } = useTheme();

  const handleSeeAll = (section: string) => {
    Alert.alert('See All', `Navigate to ${section} section`);
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.sizesContainer}>
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
        <View style={styles.contextContainer}>
          <SectionHeader
            title="Featured"
            onAction={() => handleSeeAll('Featured')}
          />
          <View style={styles.cardsRow}>
            {[1, 2, 3].map((item) => (
              <Card key={item} style={styles.contextCard}>
                <CardContent style={styles.cardContent}>
                  <View
                    style={[
                      styles.cardPlaceholder,
                      { backgroundColor: colors.backgroundMuted },
                    ]}
                  />
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
  container: { gap: 24 },
  sizesContainer: {
    gap: 16,
  },
  contextContainer: {
    gap: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contextCard: {
    flex: 1,
  },
  cardContent: {
    padding: 0,
  },
  cardPlaceholder: {
    height: 80,
    borderRadius: 8,
  },
});
