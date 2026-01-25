import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { List, ListItem } from '@/components/ui/list';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

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

function ClockIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function StarIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FireIcon({ color = '#000', width = 24, height = 24 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22c-4.97 0-9-4.03-9-9 0-3.59 2.89-7.52 5.78-10.26.4-.38 1.05-.08 1.05.49v2.54c0 1.12.9 2.03 2.02 2.05A2 2 0 0014 5.82V3.23c0-.57.65-.87 1.05-.49C17.95 5.48 21 9.41 21 13c0 4.97-4.03 9-9 9z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ListDemo() {
  const { colors, spacing } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handlePress = (item: string) => {
    Alert.alert('List Item', `${item} pressed`);
  };

  const containerStyle = {
    gap: spacing[6], // 24px
  };

  const standaloneListStyle = {
    gap: 0,
    marginHorizontal: -spacing[4], // Counteract screen padding for edge-to-edge
  };

  return (
    <View style={containerStyle}>
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

      <Section title="Thumbnail Variant">
        <List>
          <ListItem
            variant="thumbnail"
            title="Pasta Carbonara"
            description="Creamy Italian classic with bacon, eggs, and parmesan cheese"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop' }}
            metadata={[
              { icon: <ClockIcon />, label: '30 min' },
              { icon: <StarIcon />, label: '4.8' },
              { icon: <FireIcon />, label: '520 kcal' },
            ]}
            showChevron
            onPress={() => handlePress('Pasta Carbonara')}
          />
          <ListItem
            variant="thumbnail"
            title="Grilled Salmon"
            description="Fresh Atlantic salmon with lemon herb butter sauce"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop' }}
            metadata={[
              { icon: <ClockIcon />, label: '25 min' },
              { icon: <StarIcon />, label: '4.9' },
              { icon: <FireIcon />, label: '380 kcal' },
            ]}
            showChevron
            onPress={() => handlePress('Grilled Salmon')}
          />
          <ListItem
            variant="thumbnail"
            title="Caesar Salad"
            description="Crisp romaine lettuce with classic Caesar dressing"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop' }}
            metadata={[
              { icon: <ClockIcon />, label: '15 min' },
              { icon: <StarIcon />, label: '4.5' },
              { icon: <FireIcon />, label: '240 kcal' },
            ]}
            showChevron
            onPress={() => handlePress('Caesar Salad')}
          />
        </List>
      </Section>

      <Section title="Thumbnail - Compact">
        <List>
          <ListItem
            variant="thumbnail"
            title="Chocolate Cake"
            description="Rich and decadent"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop' }}
            thumbnailSize={70}
            metadata={[
              { icon: <ClockIcon />, label: '45 min' },
            ]}
            showChevron
            onPress={() => handlePress('Chocolate Cake')}
          />
          <ListItem
            variant="thumbnail"
            title="Avocado Toast"
            description="Simple and healthy"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop' }}
            thumbnailSize={70}
            metadata={[
              { icon: <ClockIcon />, label: '10 min' },
            ]}
            showChevron
            onPress={() => handlePress('Avocado Toast')}
          />
        </List>
      </Section>

      <Section title="Thumbnail - Without Card">
        <View style={standaloneListStyle}>
          <ListItem
            variant="thumbnail"
            title="Spaghetti Bolognese"
            description="Classic Italian meat sauce with fresh pasta"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=200&h=200&fit=crop' }}
            metadata={[
              { icon: <ClockIcon />, label: '40 min' },
              { icon: <StarIcon />, label: '4.7' },
            ]}
            showChevron
            onPress={() => handlePress('Spaghetti Bolognese')}
          />
          <View style={[styles.standaloneDivider, { backgroundColor: colors.border }]} />
          <ListItem
            variant="thumbnail"
            title="Margherita Pizza"
            description="Fresh mozzarella, tomatoes, and basil"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop' }}
            metadata={[
              { icon: <ClockIcon />, label: '35 min' },
              { icon: <StarIcon />, label: '4.9' },
            ]}
            showChevron
            onPress={() => handlePress('Margherita Pizza')}
          />
          <View style={[styles.standaloneDivider, { backgroundColor: colors.border }]} />
          <ListItem
            variant="thumbnail"
            title="Thai Green Curry"
            description="Fragrant coconut curry with vegetables"
            thumbnail={{ uri: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&h=200&fit=crop' }}
            metadata={[
              { icon: <ClockIcon />, label: '30 min' },
              { icon: <StarIcon />, label: '4.6' },
            ]}
            showChevron
            onPress={() => handlePress('Thai Green Curry')}
          />
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  standaloneDivider: {
    height: StyleSheet.hairlineWidth,
  },
  box: {
    padding: 12,
    borderRadius: 8,
  },
  boxText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
