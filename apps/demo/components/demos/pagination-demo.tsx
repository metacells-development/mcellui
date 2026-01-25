import React, { useState } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

export function PaginationDemo() {
  const { colors, spacing, fontSize } = useTheme();
  const [dotsPage, setDotsPage] = useState(1);
  const [numbersPage, setNumbersPage] = useState(1);
  const [simplePage, setSimplePage] = useState(1);
  const [compactPage, setCompactPage] = useState(3);
  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(10);

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const pageInfoStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
  };

  const hintStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    color: colors.foregroundMuted,
    textAlign: 'center',
  };

  const sizeLabelStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    fontWeight: '500',
    color: colors.foregroundMuted,
    marginBottom: spacing[2], // 8px
  };

  return (
    <View style={containerStyle}>
      <Section title="Sizes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={sizeLabelStyle}>Small</Text>
              <Pagination total={5} page={2} onPageChange={() => {}} size="sm" />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={sizeLabelStyle}>Medium (default)</Text>
              <Pagination total={5} page={2} onPageChange={() => {}} size="md" />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={sizeLabelStyle}>Large</Text>
              <Pagination total={5} page={2} onPageChange={() => {}} size="lg" />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Variants">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Dots</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={5}
                  page={dotsPage}
                  onPageChange={setDotsPage}
                  variant="dots"
                />
                <Text style={[pageInfoStyle, { marginTop: spacing[3], textAlign: 'center' }]}>
                  Page {dotsPage} of 5
                </Text>
              </View>
            </View>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Numbers</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={10}
                  page={numbersPage}
                  onPageChange={setNumbersPage}
                  variant="numbers"
                />
                <Text style={[pageInfoStyle, { marginTop: spacing[3], textAlign: 'center' }]}>
                  Page {numbersPage} of 10
                </Text>
              </View>
            </View>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Simple</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={20}
                  page={simplePage}
                  onPageChange={setSimplePage}
                  variant="simple"
                />
                <Text style={[pageInfoStyle, { marginTop: spacing[3], textAlign: 'center' }]}>
                  Page {simplePage} of 20
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Features">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Max Visible Pages</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={100}
                  page={compactPage}
                  onPageChange={setCompactPage}
                  variant="numbers"
                  maxVisible={5}
                />
                <Text style={[hintStyle, { marginTop: spacing[3] }]}>
                  Large page count with ellipsis
                </Text>
              </View>
            </View>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Show/Hide Buttons</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={5}
                  page={dotsPage}
                  onPageChange={setDotsPage}
                  variant="dots"
                  showButtons={true}
                />
                <Text style={[hintStyle, { marginTop: spacing[3] }]}>
                  Dots variant with prev/next buttons
                </Text>
              </View>
            </View>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Loop Mode</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={5}
                  page={dotsPage}
                  onPageChange={setDotsPage}
                  variant="dots"
                  loop={true}
                />
                <Text style={[hintStyle, { marginTop: spacing[3] }]}>
                  Navigation wraps around from last to first
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="States">
        <Card>
          <CardContent style={{ paddingTop: spacing[4], gap: spacing[4] }}>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>First Page (Prev Disabled)</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={10}
                  page={firstPage}
                  onPageChange={setFirstPage}
                  variant="numbers"
                />
                <Text style={[hintStyle, { marginTop: spacing[3] }]}>
                  Previous button is disabled
                </Text>
              </View>
            </View>
            <View>
              <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Last Page (Next Disabled)</Text>
              <View style={{ alignItems: 'center' }}>
                <Pagination
                  total={10}
                  page={lastPage}
                  onPageChange={setLastPage}
                  variant="numbers"
                />
                <Text style={[hintStyle, { marginTop: spacing[3] }]}>
                  Next button is disabled
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Use Cases">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Onboarding Slides</Text>
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
          </View>
          <View>
            <Text style={[sizeLabelStyle, { textAlign: 'center' }]}>Image Gallery</Text>
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
          </View>
        </View>
      </Section>
    </View>
  );
}
