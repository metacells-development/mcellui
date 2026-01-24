import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import Svg, { Path, Circle } from 'react-native-svg';

import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Section } from '@/components/demos/section';

// Icons
function SettingsIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </Svg>
  );
}

function InfoIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </Svg>
  );
}

export function PopoverDemo() {
  const { colors, spacing } = useTheme();
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [width, setWidth] = useState('100');
  const [height, setHeight] = useState('50');

  return (
    <View style={styles.container}>
      <Section title="Basic Popover">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Popover open={basicOpen} onOpenChange={setBasicOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Text style={[styles.popoverTitle, { color: colors.foreground }]}>
                    Popover Content
                  </Text>
                  <Text style={[styles.popoverText, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                    This is a simple popover with some content. It can contain any React Native components.
                  </Text>
                </PopoverContent>
              </Popover>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="With Form Content">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Popover open={formOpen} onOpenChange={setFormOpen}>
                <PopoverTrigger asChild>
                  <Button>
                    <SettingsIcon size={16} color={colors.primaryForeground} />
                    <Text style={{ color: colors.primaryForeground, marginLeft: spacing[2] }}>
                      Dimensions
                    </Text>
                  </Button>
                </PopoverTrigger>
                <PopoverContent style={{ width: 280 }}>
                  <View style={{ gap: spacing[4] }}>
                    <View>
                      <Text style={[styles.popoverTitle, { color: colors.foreground }]}>
                        Set Dimensions
                      </Text>
                      <Text style={[styles.popoverText, { color: colors.foregroundMuted, marginTop: spacing[1] }]}>
                        Configure the width and height.
                      </Text>
                    </View>
                    <View style={{ gap: spacing[3] }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                        <Text style={{ color: colors.foreground, width: 60 }}>Width</Text>
                        <Input
                          value={width}
                          onChangeText={setWidth}
                          keyboardType="numeric"
                          style={{ flex: 1 }}
                        />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                        <Text style={{ color: colors.foreground, width: 60 }}>Height</Text>
                        <Input
                          value={height}
                          onChangeText={setHeight}
                          keyboardType="numeric"
                          style={{ flex: 1 }}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[2] }}>
                      <PopoverClose asChild>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </PopoverClose>
                      <PopoverClose asChild>
                        <Button size="sm" onPress={() => Alert.alert('Saved', `${width}x${height}`)}>
                          Save
                        </Button>
                      </PopoverClose>
                    </View>
                  </View>
                </PopoverContent>
              </Popover>
            </View>
            <Text style={[styles.stateText, { color: colors.foregroundMuted, marginTop: spacing[3], textAlign: 'center' }]}>
              Current: {width}x{height}
            </Text>
          </CardContent>
        </Card>
      </Section>

      <Section title="Positions">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], justifyContent: 'center' }}>
              {(['top', 'bottom', 'left', 'right'] as const).map((position) => (
                <Popover key={position}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">{position}</Button>
                  </PopoverTrigger>
                  <PopoverContent position={position}>
                    <Text style={{ color: colors.foreground }}>
                      Positioned {position}
                    </Text>
                  </PopoverContent>
                </Popover>
              ))}
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Menu Style">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ alignItems: 'center' }}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <Text style={{ color: colors.foreground }}>•••</Text>
                  </Button>
                </PopoverTrigger>
                <PopoverContent style={{ width: 200, padding: 0 }}>
                  <View>
                    {['Edit', 'Duplicate', 'Archive'].map((item, index) => (
                      <PopoverClose key={item} asChild>
                        <Button
                          variant="ghost"
                          style={{ justifyContent: 'flex-start', borderRadius: 0 }}
                          onPress={() => Alert.alert(item)}
                        >
                          <Text style={{ color: colors.foreground }}>{item}</Text>
                        </Button>
                      </PopoverClose>
                    ))}
                    <Separator />
                    <PopoverClose asChild>
                      <Button
                        variant="ghost"
                        style={{ justifyContent: 'flex-start', borderRadius: 0 }}
                        onPress={() => Alert.alert('Delete')}
                      >
                        <Text style={{ color: colors.destructive }}>Delete</Text>
                      </Button>
                    </PopoverClose>
                  </View>
                </PopoverContent>
              </Popover>
            </View>
          </CardContent>
        </Card>
      </Section>

      <Section title="Info Popover">
        <Card>
          <CardContent style={{ paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <Text style={{ color: colors.foreground }}>Subscription Plan</Text>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" style={{ padding: spacing[1] }}>
                    <InfoIcon size={16} color={colors.foregroundMuted} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent style={{ width: 240 }}>
                  <Text style={[styles.popoverTitle, { color: colors.foreground }]}>
                    About Plans
                  </Text>
                  <Text style={[styles.popoverText, { color: colors.foregroundMuted, marginTop: spacing[2] }]}>
                    Choose from Free, Pro, or Enterprise plans. Each tier includes additional features and support options.
                  </Text>
                </PopoverContent>
              </Popover>
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
  popoverTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  popoverText: {
    fontSize: 14,
    lineHeight: 20,
  },
  stateText: {
    fontSize: 13,
  },
});
