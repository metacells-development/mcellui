import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Rating } from '@/components/ui/rating';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function RatingDemo() {
  const { colors, spacing, radius, typography } = useTheme();
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(3);

  return (
    <View style={{ gap: spacing[8] }}>
      {/* Sizes Section */}
      <Section title="Sizes">
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Rating value={4} readonly size="sm" />
            <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>Small</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Rating value={4} readonly size="md" />
            <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>Medium</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Rating value={4} readonly size="lg" />
            <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>Large</Text>
          </View>
        </View>
      </Section>

      {/* Modes Section */}
      <Section title="Modes">
        <View style={{ gap: spacing[4] }}>
          <View style={{ gap: spacing[2] }}>
            <Text style={[typography.label, { color: colors.foreground }]}>Interactive</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <Rating value={rating1} onChange={setRating1} />
              <Text style={[typography.body, { color: colors.foreground, fontWeight: '600' }]}>
                {rating1} / 5
              </Text>
            </View>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
              Tap stars to rate
            </Text>
          </View>
          <View style={{ gap: spacing[2] }}>
            <Text style={[typography.label, { color: colors.foreground }]}>Readonly</Text>
            <View style={{ gap: spacing[2] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Rating value={5} readonly />
                <Text style={[typography.bodySm, { color: colors.foreground }]}>Excellent</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Rating value={3} readonly />
                <Text style={[typography.bodySm, { color: colors.foreground }]}>Good</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Rating value={1} readonly />
                <Text style={[typography.bodySm, { color: colors.foreground }]}>Poor</Text>
              </View>
            </View>
          </View>
        </View>
      </Section>

      {/* Precision Section */}
      <Section title="Precision">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Full Star</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <Rating value={4} readonly precision="full" />
              <Text style={[typography.bodySm, { color: colors.foreground }]}>4.0</Text>
            </View>
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text style={[typography.caption, { color: colors.foregroundMuted }]}>Half Star</Text>
            <View style={{ gap: spacing[2] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Rating value={4.5} readonly precision="half" />
                <Text style={[typography.bodySm, { color: colors.foreground }]}>4.5</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Rating value={3.5} readonly precision="half" />
                <Text style={[typography.bodySm, { color: colors.foreground }]}>3.5</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <Rating value={2.5} readonly precision="half" />
                <Text style={[typography.bodySm, { color: colors.foreground }]}>2.5</Text>
              </View>
            </View>
          </View>
        </View>
      </Section>

      {/* Custom Colors Section */}
      <Section title="Custom Colors">
        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Rating value={4} readonly activeColor={colors.destructive} />
            <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>Destructive</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Rating value={4} readonly activeColor="#10B981" />
            <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>Green</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <Rating value={4} readonly activeColor={colors.primary} />
            <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>Primary</Text>
          </View>
        </View>
      </Section>

      {/* Interactive State Section */}
      <Section title="Interactive State">
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing[5],
            alignItems: 'center',
            gap: spacing[3],
          }}
        >
          <Text style={[typography.label, { color: colors.foreground }]}>
            Rate this product
          </Text>
          <Rating value={rating2} onChange={setRating2} size="lg" />
          <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>
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

      {/* In Context Section */}
      <Section title="Product Review Card">
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing[4],
          }}
        >
          <View style={{ marginBottom: spacing[3] }}>
            <Text style={[typography.label, { color: colors.foreground, marginBottom: spacing[1] }]}>
              Wireless Headphones
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <Rating value={4.5} readonly size="sm" precision="half" />
              <Text style={[typography.caption, { color: colors.foregroundMuted }]}>
                4.5 (128 reviews)
              </Text>
            </View>
          </View>
          <Text style={[typography.bodySm, { color: colors.foregroundMuted }]}>
            Great sound quality and comfortable fit. Battery life could be better.
          </Text>
        </View>
      </Section>
    </View>
  );
}
