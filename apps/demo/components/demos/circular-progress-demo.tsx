import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';

import { CircularProgress } from '@/components/ui/circular-progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

export function CircularProgressDemo() {
  const { colors, spacing } = useTheme();
  const [progress, setProgress] = useState(65);
  const [animated, setAnimated] = useState(0);

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(75);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Section title="Basic">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <CircularProgress value={25} />
              <CircularProgress value={50} />
              <CircularProgress value={75} />
              <CircularProgress value={100} />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Label">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <CircularProgress value={progress} showLabel />
              <CircularProgress value={60} showLabel label={
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '600' }}>
                  60/100
                </Text>
              } />
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={60} label={
                  <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '600' }}>
                    3/5
                  </Text>
                } />
                <Text style={[styles.caption, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Custom
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Sizes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={60} size="sm" showLabel />
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Small
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={60} size="md" showLabel />
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Medium
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={60} size="lg" showLabel />
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Large
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Colors">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <CircularProgress value={70} color={colors.primary} showLabel />
              <CircularProgress value={70} color={colors.success} showLabel />
              <CircularProgress value={70} color={colors.warning} showLabel />
              <CircularProgress value={70} color={colors.destructive} showLabel />
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Stroke Width">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={65} strokeWidth={4} />
                <Text style={[styles.caption, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Thin
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={65} strokeWidth={8} />
                <Text style={[styles.caption, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Default
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress value={65} strokeWidth={12} />
                <Text style={[styles.caption, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Thick
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Animated">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <CircularProgress value={animated} size="lg" showLabel />
              <Text style={[styles.hint, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
                Animates on value change
              </Text>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Indeterminate">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress indeterminate size="sm" />
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Small
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress indeterminate size="md" />
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Medium
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress indeterminate size="lg" />
                <Text style={[styles.sizeLabel, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                  Large
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Interactive">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center', gap: spacing[4] }}>
              <CircularProgress value={progress} size="lg" showLabel />
              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Use Cases">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ gap: spacing[4] }}>
              {/* Download Progress */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                <CircularProgress value={78} size="sm" showLabel color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '500' }}>Downloading...</Text>
                  <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>78 MB of 100 MB</Text>
                </View>
              </View>

              {/* Storage Usage */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                <CircularProgress value={85} size="sm" showLabel color={colors.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '500' }}>Storage</Text>
                  <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>85 GB used of 100 GB</Text>
                </View>
              </View>

              {/* Goal Progress */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                <CircularProgress value={45} size="sm" showLabel color={colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '500' }}>Daily Goal</Text>
                  <Text style={{ color: colors.foregroundMuted, fontSize: 13 }}>4,500 of 10,000 steps</Text>
                </View>
              </View>
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
  caption: {
    fontSize: 12,
  },
  sizeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    fontSize: 13,
  },
});
