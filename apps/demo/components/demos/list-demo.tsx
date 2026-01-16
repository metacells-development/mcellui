import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { List, ListItem } from '@/components/ui/list';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

// Demo Icons
function UserIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function BellIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function HelpIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ListDemo() {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handlePress = (item: string) => {
    Alert.alert('List Item', `${item} pressed`);
  };

  return (
    <View style={styles.container}>
      <Section title="Basic">
        <List>
          <ListItem title="Settings" showChevron onPress={() => handlePress('Settings')} />
          <ListItem title="Profile" subtitle="John Doe" showChevron onPress={() => handlePress('Profile')} />
          <ListItem title="About" subtitle="Version 1.0.0" />
        </List>
      </Section>

      <Section title="With Icons">
        <List>
          <ListItem
            title="Account"
            subtitle="Manage your account"
            left={<UserIcon />}
            showChevron
            onPress={() => handlePress('Account')}
          />
          <ListItem
            title="Notifications"
            left={<BellIcon />}
            showChevron
            onPress={() => handlePress('Notifications')}
          />
          <ListItem
            title="Privacy"
            subtitle="Control your data"
            left={<LockIcon />}
            showChevron
            onPress={() => handlePress('Privacy')}
          />
          <ListItem
            title="Help"
            left={<HelpIcon />}
            showChevron
            onPress={() => handlePress('Help')}
          />
        </List>
      </Section>

      <Section title="With Right Content">
        <List>
          <ListItem
            title="Push Notifications"
            left={<BellIcon />}
            right={
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            }
          />
          <ListItem
            title="Messages"
            left={<UserIcon />}
            right={<Badge variant="secondary">3</Badge>}
            showChevron
            onPress={() => handlePress('Messages')}
          />
        </List>
      </Section>

      <Section title="Inset Dividers">
        <List insetDividers>
          <ListItem
            title="Account"
            left={<UserIcon />}
            showChevron
            onPress={() => handlePress('Account')}
          />
          <ListItem
            title="Notifications"
            left={<BellIcon />}
            showChevron
            onPress={() => handlePress('Notifications')}
          />
          <ListItem
            title="Privacy"
            left={<LockIcon />}
            showChevron
            onPress={() => handlePress('Privacy')}
          />
        </List>
      </Section>

      <Section title="No Dividers">
        <List showDividers={false}>
          <ListItem title="Item 1" onPress={() => handlePress('Item 1')} />
          <ListItem title="Item 2" onPress={() => handlePress('Item 2')} />
          <ListItem title="Item 3" onPress={() => handlePress('Item 3')} />
        </List>
      </Section>

      <Section title="Disabled">
        <List>
          <ListItem title="Enabled" showChevron onPress={() => handlePress('Enabled')} />
          <ListItem title="Disabled" subtitle="This item is disabled" disabled />
          <ListItem title="Also Enabled" showChevron onPress={() => handlePress('Also Enabled')} />
        </List>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
