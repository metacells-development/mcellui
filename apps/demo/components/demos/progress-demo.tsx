import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useTheme } from '@metacells/mcellui-core';
import { Section } from './section';

export function ProgressDemo() {
  const { colors } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((p) => Math.min(p + 10, 100));
      }, 500);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setIsAnimating(false);
    }
  }, [isAnimating, progress]);

  const handleStart = () => {
    setProgress(0);
    setIsAnimating(true);
  };

  return (
    <View style={styles.container}>
      <Section title="Sizes">
        <View style={styles.sizes}>
          <View style={styles.sizeRow}>
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>sm</Text>
            <Progress value={60} size="sm" />
          </View>
          <View style={styles.sizeRow}>
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>md</Text>
            <Progress value={60} size="md" />
          </View>
          <View style={styles.sizeRow}>
            <Text style={[styles.label, { color: colors.foregroundMuted }]}>lg</Text>
            <Progress value={60} size="lg" />
          </View>
        </View>
      </Section>

      <Section title="Colors">
        <View style={styles.colors}>
          <Progress value={80} color="default" />
          <Progress value={80} color="primary" />
          <Progress value={80} color="success" />
          <Progress value={80} color="warning" />
          <Progress value={80} color="destructive" />
        </View>
      </Section>

      <Section title="Values">
        <View style={styles.values}>
          <View style={styles.valueRow}>
            <Progress value={0} />
            <Text style={[styles.valueLabel, { color: colors.foregroundMuted }]}>0%</Text>
          </View>
          <View style={styles.valueRow}>
            <Progress value={25} />
            <Text style={[styles.valueLabel, { color: colors.foregroundMuted }]}>25%</Text>
          </View>
          <View style={styles.valueRow}>
            <Progress value={50} />
            <Text style={[styles.valueLabel, { color: colors.foregroundMuted }]}>50%</Text>
          </View>
          <View style={styles.valueRow}>
            <Progress value={75} />
            <Text style={[styles.valueLabel, { color: colors.foregroundMuted }]}>75%</Text>
          </View>
          <View style={styles.valueRow}>
            <Progress value={100} color="success" />
            <Text style={[styles.valueLabel, { color: colors.foregroundMuted }]}>100%</Text>
          </View>
        </View>
      </Section>

      <Section title="Indeterminate">
        <Progress indeterminate />
      </Section>

      <Section title="Interactive">
        <View style={styles.interactive}>
          <View style={styles.valueRow}>
            <Progress value={progress} color={progress === 100 ? 'success' : 'primary'} />
            <Text style={[styles.valueLabel, { color: colors.foregroundMuted }]}>{progress}%</Text>
          </View>
          <Button
            onPress={handleStart}
            disabled={isAnimating}
            size="sm"
          >
            {isAnimating ? 'Loading...' : progress === 100 ? 'Restart' : 'Start'}
          </Button>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  sizes: { gap: 16 },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    width: 24,
    fontSize: 12,
  },
  colors: { gap: 12 },
  values: { gap: 12 },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueLabel: {
    width: 40,
    fontSize: 12,
    textAlign: 'right',
  },
  interactive: { gap: 16 },
});
