import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import Svg, { Path, Rect } from 'react-native-svg';

import { Toggle, ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/demos/section';

// Icons
function BoldIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
      <Path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
    </Svg>
  );
}

function ItalicIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 4h-9M14 20H5M15 4L9 20" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UnderlineIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function AlignLeftIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M17 10H3M21 6H3M21 14H3M17 18H3" strokeLinecap="round" />
    </Svg>
  );
}

function AlignCenterIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 10H6M21 6H3M21 14H3M18 18H6" strokeLinecap="round" />
    </Svg>
  );
}

function AlignRightIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 10H7M21 6H3M21 14H3M21 18H7" strokeLinecap="round" />
    </Svg>
  );
}

function GridIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="3" y="3" width="7" height="7" />
      <Rect x="14" y="3" width="7" height="7" />
      <Rect x="14" y="14" width="7" height="7" />
      <Rect x="3" y="14" width="7" height="7" />
    </Svg>
  );
}

function ListIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </Svg>
  );
}

export function ToggleDemo() {
  const { colors, spacing } = useTheme();
  const [boldPressed, setBoldPressed] = useState(false);
  const [italicPressed, setItalicPressed] = useState(false);
  const [underlinePressed, setUnderlinePressed] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [viewMode, setViewMode] = useState('grid');
  const [formats, setFormats] = useState<string[]>(['bold']);

  return (
    <View style={styles.container}>
      <Section title="Single Toggle">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              <Toggle
                pressed={boldPressed}
                onPressedChange={setBoldPressed}
              >
                <BoldIcon color={colors.foreground} />
              </Toggle>
              <Toggle
                pressed={italicPressed}
                onPressedChange={setItalicPressed}
                variant="outline"
              >
                <ItalicIcon color={colors.foreground} />
              </Toggle>
              <Toggle
                pressed={underlinePressed}
                onPressedChange={setUnderlinePressed}
                disabled
              >
                <UnderlineIcon color={colors.foreground} />
              </Toggle>
            </View>
            <Text style={[styles.stateText, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Bold: {boldPressed ? 'On' : 'Off'} • Italic: {italicPressed ? 'On' : 'Off'}
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Toggle Group (Single)">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Text style={[styles.label, { color: colors.foreground, marginBottom: spacing[3] }]}>
              Text Alignment
            </Text>
            <ToggleGroup
              type="single"
              value={alignment}
              onValueChange={(val) => val && setAlignment(val)}
            >
              <ToggleGroupItem value="left">
                <AlignLeftIcon color={colors.foreground} />
              </ToggleGroupItem>
              <ToggleGroupItem value="center">
                <AlignCenterIcon color={colors.foreground} />
              </ToggleGroupItem>
              <ToggleGroupItem value="right">
                <AlignRightIcon color={colors.foreground} />
              </ToggleGroupItem>
            </ToggleGroup>
            <Text style={[styles.stateText, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Selected: {alignment}
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Toggle Group (Multiple)">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <Text style={[styles.label, { color: colors.foreground, marginBottom: spacing[3] }]}>
              Text Formatting
            </Text>
            <ToggleGroup
              type="multiple"
              value={formats}
              onValueChange={setFormats}
            >
              <ToggleGroupItem value="bold">
                <BoldIcon color={colors.foreground} />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic">
                <ItalicIcon color={colors.foreground} />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline">
                <UnderlineIcon color={colors.foreground} />
              </ToggleGroupItem>
            </ToggleGroup>
            <Text style={[styles.stateText, { color: colors.foregroundMuted, marginTop: spacing[3] }]}>
              Active: {formats.length > 0 ? formats.join(', ') : 'none'}
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="View Mode Toggle">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(val) => val && setViewMode(val)}
              variant="outline"
            >
              <ToggleGroupItem value="grid">
                <GridIcon color={colors.foreground} />
                <Text style={{ color: colors.foreground, marginLeft: spacing[2], fontSize: 14 }}>Grid</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="list">
                <ListIcon color={colors.foreground} />
                <Text style={{ color: colors.foreground, marginLeft: spacing[2], fontSize: 14 }}>List</Text>
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>
      </Section>

      <Section title="Sizes">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <Toggle size="sm" pressed={false}>
                <BoldIcon size={14} color={colors.foreground} />
              </Toggle>
              <Toggle size="md" pressed={false}>
                <BoldIcon size={16} color={colors.foreground} />
              </Toggle>
              <Toggle size="lg" pressed={false}>
                <BoldIcon size={20} color={colors.foreground} />
              </Toggle>
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
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  stateText: {
    fontSize: 13,
  },
});
