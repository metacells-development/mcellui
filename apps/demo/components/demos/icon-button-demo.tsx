import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { IconButton } from '@/components/ui/icon-button';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

// Demo Icons
function PlusIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function HeartIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TrashIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MenuIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function SettingsIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShareIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconButtonDemo() {
  const { colors, fontSize } = useTheme();

  const handlePress = () => {
    Alert.alert('Icon Button', 'Button pressed!');
  };

  return (
    <View style={styles.container}>
      <Section title="Variants">
        <View style={styles.row}>
          <IconButton
            icon={<PlusIcon />}
            accessibilityLabel="Add"
            onPress={handlePress}
          />
          <IconButton
            icon={<HeartIcon />}
            variant="secondary"
            accessibilityLabel="Like"
            onPress={handlePress}
          />
          <IconButton
            icon={<ShareIcon />}
            variant="outline"
            accessibilityLabel="Share"
            onPress={handlePress}
          />
          <IconButton
            icon={<MenuIcon />}
            variant="ghost"
            accessibilityLabel="Menu"
            onPress={handlePress}
          />
          <IconButton
            icon={<TrashIcon />}
            variant="destructive"
            accessibilityLabel="Delete"
            onPress={handlePress}
          />
        </View>
      </Section>

      <Section title="Sizes">
        <View style={styles.row}>
          <IconButton
            icon={<PlusIcon />}
            size="sm"
            accessibilityLabel="Small"
            onPress={handlePress}
          />
          <IconButton
            icon={<PlusIcon />}
            size="md"
            accessibilityLabel="Medium"
            onPress={handlePress}
          />
          <IconButton
            icon={<PlusIcon />}
            size="lg"
            accessibilityLabel="Large"
            onPress={handlePress}
          />
          <IconButton
            icon={<PlusIcon />}
            size="xl"
            accessibilityLabel="Extra Large"
            onPress={handlePress}
          />
        </View>
      </Section>

      <Section title="Rounded">
        <View style={styles.row}>
          <IconButton
            icon={<PlusIcon />}
            rounded
            accessibilityLabel="Add"
            onPress={handlePress}
          />
          <IconButton
            icon={<HeartIcon />}
            variant="secondary"
            rounded
            accessibilityLabel="Like"
            onPress={handlePress}
          />
          <IconButton
            icon={<ShareIcon />}
            variant="outline"
            rounded
            accessibilityLabel="Share"
            onPress={handlePress}
          />
          <IconButton
            icon={<TrashIcon />}
            variant="destructive"
            rounded
            accessibilityLabel="Delete"
            onPress={handlePress}
          />
        </View>
      </Section>

      <Section title="Loading & Disabled">
        <View style={styles.row}>
          <IconButton
            icon={<PlusIcon />}
            loading
            accessibilityLabel="Loading"
          />
          <IconButton
            icon={<HeartIcon />}
            disabled
            accessibilityLabel="Disabled"
          />
          <IconButton
            icon={<ShareIcon />}
            variant="outline"
            loading
            accessibilityLabel="Loading"
          />
        </View>
      </Section>

      <Section title="All Sizes × Variants">
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8 }}>Default variant:</Text>
        <View style={styles.row}>
          {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
            <IconButton
              key={size}
              icon={<PlusIcon />}
              size={size}
              accessibilityLabel={`Size ${size}`}
              onPress={handlePress}
            />
          ))}
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8 }}>Secondary variant:</Text>
        <View style={styles.row}>
          {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
            <IconButton
              key={size}
              icon={<HeartIcon />}
              size={size}
              variant="secondary"
              accessibilityLabel={`Secondary ${size}`}
              onPress={handlePress}
            />
          ))}
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginTop: 8 }}>Outline variant:</Text>
        <View style={styles.row}>
          {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
            <IconButton
              key={size}
              icon={<SettingsIcon />}
              size={size}
              variant="outline"
              accessibilityLabel={`Outline ${size}`}
              onPress={handlePress}
            />
          ))}
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
});
