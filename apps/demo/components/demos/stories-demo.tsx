import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { StoryAvatar, StoriesRow } from '@/components/ui/stories';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

const SAMPLE_USERS = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1', hasNew: true },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2', hasNew: true },
  { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3', hasNew: false },
  { id: '4', name: 'Diana', avatar: 'https://i.pravatar.cc/150?img=4', hasNew: true },
  { id: '5', name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=5', hasNew: false },
  { id: '6', name: 'Frank', avatar: 'https://i.pravatar.cc/150?img=6', hasNew: true },
];

export function StoriesDemo() {
  const { colors, spacing } = useTheme();

  const handleStoryPress = (name: string) => {
    Alert.alert('Story pressed', `Opening ${name}'s story`);
  };

  const handleAddStory = () => {
    Alert.alert('Add Story', 'Opening camera to add story');
  };

  return (
    <View style={styles.container}>
      <Section title="Stories Row">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <StoriesRow>
            <StoryAvatar
              name="You"
              isAddStory
              onPress={handleAddStory}
            />
            {SAMPLE_USERS.map((user) => (
              <StoryAvatar
                key={user.id}
                source={{ uri: user.avatar }}
                name={user.name}
                hasUnseenStory={user.hasNew}
                onPress={() => handleStoryPress(user.name)}
              />
            ))}
          </StoriesRow>
        </View>
      </Section>

      <Section title="Sizes">
        <View style={styles.row}>
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
            name="Small"
            size="sm"
            hasUnseenStory
            onPress={() => {}}
          />
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
            name="Medium"
            size="md"
            hasUnseenStory
            onPress={() => {}}
          />
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            name="Large"
            size="lg"
            hasUnseenStory
            onPress={() => {}}
          />
        </View>
      </Section>

      <Section title="Story States">
        <View style={styles.row}>
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=20' }}
            name="Unseen"
            hasUnseenStory
            onPress={() => {}}
          />
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=21' }}
            name="Seen"
            seen
            onPress={() => {}}
          />
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=22' }}
            name="No Story"
            onPress={() => {}}
          />
        </View>
      </Section>

      <Section title="Custom Gradient">
        <View style={styles.row}>
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=30' }}
            name="Default"
            hasUnseenStory
            onPress={() => {}}
          />
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=31' }}
            name="Blue"
            hasUnseenStory
            gradientColors={['#00C6FF', '#0072FF'] as [string, string]}
            onPress={() => {}}
          />
          <StoryAvatar
            source={{ uri: 'https://i.pravatar.cc/150?img=32' }}
            name="Green"
            hasUnseenStory
            gradientColors={['#11998E', '#38EF7D'] as [string, string]}
            onPress={() => {}}
          />
        </View>
      </Section>

      <Section title="Fallback (No Image)">
        <View style={styles.row}>
          <StoryAvatar
            name="John Doe"
            hasUnseenStory
            onPress={() => {}}
          />
          <StoryAvatar
            name="Jane"
            seen
            onPress={() => {}}
          />
          <StoryAvatar
            name="Add"
            isAddStory
            onPress={handleAddStory}
          />
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
});
