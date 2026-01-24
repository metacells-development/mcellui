import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

export function PaginationDemo() {
  const { colors, spacing } = useTheme();
  const [dotsPage, setDotsPage] = useState(1);
  const [numbersPage, setNumbersPage] = useState(1);
  const [simplePage, setSimplePage] = useState(1);
  const [compactPage, setCompactPage] = useState(3);

  return (
    <View style={styles.container}>
      <Section title="Dots Variant">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Pagination
                total={5}
                page={dotsPage}
                onPageChange={setDotsPage}
                variant="dots"
              />
              <Text style={[styles.pageInfo, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
                Page {dotsPage} of 5
              </Text>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Numbers Variant">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Pagination
                total={10}
                page={numbersPage}
                onPageChange={setNumbersPage}
                variant="numbers"
              />
              <Text style={[styles.pageInfo, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
                Showing page {numbersPage}
              </Text>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Simple Variant">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Pagination
                total={20}
                page={simplePage}
                onPageChange={setSimplePage}
                variant="simple"
              />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Compact Numbers">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Pagination
                total={100}
                page={compactPage}
                onPageChange={setCompactPage}
                variant="numbers"
                siblingCount={1}
              />
            </View>
            <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[3], textAlign: 'center' }]}>
              Large page count with ellipsis
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Sizes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ gap: spacing[4] }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
                  Small
                </Text>
                <Pagination total={5} page={2} onPageChange={() => {}} size="sm" />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
                  Medium (default)
                </Text>
                <Pagination total={5} page={2} onPageChange={() => {}} size="md" />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginBottom: spacing[2] }]}>
                  Large
                </Text>
                <Pagination total={5} page={2} onPageChange={() => {}} size="lg" />
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Onboarding Style">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center', gap: spacing[4] }}>
              <View
                style={{
                  width: '100%',
                  height: 120,
                  backgroundColor: colors.secondary,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.foregroundMuted }}>Slide Content</Text>
              </View>
              <Pagination
                total={4}
                page={dotsPage <= 4 ? dotsPage : 1}
                onPageChange={setDotsPage}
                variant="dots"
                size="sm"
              />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Image Gallery Style">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center', gap: spacing[3] }}>
              <View
                style={{
                  width: '100%',
                  height: 180,
                  backgroundColor: colors.secondary,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.foreground, fontSize: 48 }}>📷</Text>
                <Text style={{ color: colors.foregroundMuted, marginTop: spacing[2] }}>
                  Photo {simplePage} of 20
                </Text>
              </View>
              <Pagination
                total={20}
                page={simplePage}
                onPageChange={setSimplePage}
                variant="simple"
              />
            </View>
          </CardContent>
        </Card>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  pageInfo: {
    fontSize: 13,
  },
  hint: {
    fontSize: 12,
  },
  sizeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
