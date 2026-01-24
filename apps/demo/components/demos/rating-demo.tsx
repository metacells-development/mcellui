import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rating } from '@/components/ui/rating';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function RatingDemo() {
  const { colors, spacing, radius } = useTheme();
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(3);

  return (
    <View style={styles.container}>
      <Section title="Interactive Rating">
        <View style={styles.ratingRow}>
          <Rating value={rating1} onChange={setRating1} />
          <Text style={[styles.ratingValue, { color: colors.foreground }]}>
            {rating1} / 5
          </Text>
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Tap stars to rate
        </Text>
      </Section>

      <Section title="Readonly Display">
        <View style={styles.column}>
          <View style={styles.ratingRow}>
            <Rating value={5} readonly />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>Excellent</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={4} readonly />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>Very Good</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={3} readonly />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>Good</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={2} readonly />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>Fair</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={1} readonly />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>Poor</Text>
          </View>
        </View>
      </Section>

      <Section title="Sizes">
        <View style={styles.column}>
          <View style={styles.ratingRow}>
            <Rating value={4} readonly size="sm" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>Small</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={4} readonly size="md" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>Medium</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={4} readonly size="lg" />
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>Large</Text>
          </View>
        </View>
      </Section>

      <Section title="Half-Star Precision">
        <View style={styles.column}>
          <View style={styles.ratingRow}>
            <Rating value={4.5} readonly precision="half" />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>4.5</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={3.5} readonly precision="half" />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>3.5</Text>
          </View>
          <View style={styles.ratingRow}>
            <Rating value={2.5} readonly precision="half" />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>2.5</Text>
          </View>
        </View>
      </Section>

      <Section title="Custom Colors">
        <View style={styles.column}>
          <Rating value={4} readonly activeColor="#EF4444" />
          <Rating value={4} readonly activeColor="#10B981" />
          <Rating value={4} readonly activeColor="#6366F1" />
        </View>
      </Section>

      <Section title="Product Review Card">
        <View
          style={[
            styles.reviewCard,
            { backgroundColor: colors.card, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.reviewHeader}>
            <View>
              <Text style={[styles.reviewTitle, { color: colors.foreground }]}>
                Wireless Headphones
              </Text>
              <View style={styles.reviewRating}>
                <Rating value={4.5} readonly size="sm" precision="half" />
                <Text style={[styles.reviewScore, { color: colors.foregroundMuted }]}>
                  4.5 (128 reviews)
                </Text>
              </View>
            </View>
          </View>
          <Text style={[styles.reviewText, { color: colors.foregroundMuted }]}>
            Great sound quality and comfortable fit. Battery life could be better.
          </Text>
        </View>
      </Section>

      <Section title="Your Rating">
        <View
          style={[
            styles.rateCard,
            { backgroundColor: colors.card, borderRadius: radius.lg },
          ]}
        >
          <Text style={[styles.rateTitle, { color: colors.foreground }]}>
            Rate this product
          </Text>
          <Rating value={rating2} onChange={setRating2} size="lg" />
          <Text style={[styles.rateHint, { color: colors.foregroundMuted }]}>
            {rating2 === 0
              ? 'Tap to rate'
              : rating2 <= 2
                ? 'We appreciate your feedback!'
                : rating2 <= 4
                  ? 'Thanks for your rating!'
                  : 'Awesome! Thank you!'}
          </Text>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  column: { gap: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingValue: { fontSize: 16, fontWeight: '600' },
  ratingText: { fontSize: 14 },
  label: { fontSize: 12 },
  hint: { fontSize: 12, marginTop: 4 },
  reviewCard: { padding: 16 },
  reviewHeader: { marginBottom: 12 },
  reviewTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewScore: { fontSize: 13 },
  reviewText: { fontSize: 14, lineHeight: 20 },
  rateCard: { padding: 20, alignItems: 'center', gap: 12 },
  rateTitle: { fontSize: 16, fontWeight: '600' },
  rateHint: { fontSize: 14 },
});
