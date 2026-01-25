import React from 'react';
import { View, Text, ViewStyle, TextStyle, Alert } from 'react-native';
import { StoryAvatar, StoriesRow } from '@/components/ui/stories';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

const SAMPLE_USERS = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1', hasNew: true },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2', hasNew: true },
  { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3', hasNew: false },
  { id: '4', name: 'Diana', avatar: 'https://i.pravatar.cc/150?img=4', hasNew: true },
  { id: '5', name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=5', hasNew: false },
  { id: '6', name: 'Frank', avatar: 'https://i.pravatar.cc/150?img=6', hasNew: true },
];

export function StoriesDemo() {
  const { colors, spacing, fontSize } = useTheme();

  const handleStoryPress = (name: string) => {
    Alert.alert('Story pressed', `Opening ${name}'s story`);
  };

  const handleAddStory = () => {
    Alert.alert('Add Story', 'Opening camera to add story');
  };

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4], // 16px
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    fontWeight: '500',
    color: colors.foregroundMuted,
    marginBottom: spacing[2], // 8px
    textAlign: 'center',
  };

  return (
    <View style={containerStyle}>
      <Section title="Sizes">
        <View style={rowStyle}>
          <View style={{ alignItems: 'center' }}>
            <Text style={labelStyle}>Small</Text>
            <StoryAvatar
              source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
              name="Small"
              size="sm"
              hasUnseenStory
              onPress={() => {}}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={labelStyle}>Medium</Text>
            <StoryAvatar
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
              name="Medium"
              size="md"
              hasUnseenStory
              onPress={() => {}}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={labelStyle}>Large</Text>
            <StoryAvatar
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              name="Large"
              size="lg"
              hasUnseenStory
              onPress={() => {}}
            />
          </View>
        </View>
      </Section>

      <Section title="Ring States">
        <View style={rowStyle}>
          <View style={{ alignItems: 'center' }}>
            <Text style={labelStyle}>Unseen</Text>
            <StoryAvatar
              source={{ uri: 'https://i.pravatar.cc/150?img=20' }}
              name="Unseen"
              hasUnseenStory
              onPress={() => {}}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={labelStyle}>Seen</Text>
            <StoryAvatar
              source={{ uri: 'https://i.pravatar.cc/150?img=21' }}
              name="Seen"
              seen
              onPress={() => {}}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={labelStyle}>No Story</Text>
            <StoryAvatar
              source={{ uri: 'https://i.pravatar.cc/150?img=22' }}
              name="No Story"
              onPress={() => {}}
            />
          </View>
        </View>
      </Section>

      <Section title="Features">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Add Story Button</Text>
            <View style={rowStyle}>
              <StoryAvatar
                name="You"
                isAddStory
                onPress={handleAddStory}
              />
              <StoryAvatar
                source={{ uri: 'https://i.pravatar.cc/150?img=30' }}
                name="User 1"
                hasUnseenStory
                onPress={() => {}}
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Custom Gradient Colors</Text>
            <View style={rowStyle}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[labelStyle, { marginBottom: spacing[1] }]}>Default</Text>
                <StoryAvatar
                  source={{ uri: 'https://i.pravatar.cc/150?img=31' }}
                  name="Default"
                  hasUnseenStory
                  onPress={() => {}}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[labelStyle, { marginBottom: spacing[1] }]}>Blue</Text>
                <StoryAvatar
                  source={{ uri: 'https://i.pravatar.cc/150?img=32' }}
                  name="Blue"
                  hasUnseenStory
                  gradientColors={['#00C6FF', '#0072FF'] as [string, string]}
                  onPress={() => {}}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[labelStyle, { marginBottom: spacing[1] }]}>Green</Text>
                <StoryAvatar
                  source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
                  name="Green"
                  hasUnseenStory
                  gradientColors={['#11998E', '#38EF7D'] as [string, string]}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Fallback Initials (No Image)</Text>
            <View style={rowStyle}>
              <StoryAvatar
                name="John Doe"
                hasUnseenStory
                onPress={() => {}}
              />
              <StoryAvatar
                name="Jane Smith"
                seen
                onPress={() => {}}
              />
              <StoryAvatar
                name="A"
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </Section>

      <Section title="Layout">
        <View>
          <Text style={labelStyle}>StoriesRow Component</Text>
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
        </View>
      </Section>

      <Section title="Use Cases">
        <View>
          <Text style={labelStyle}>Social Feed Stories Header</Text>
          <View
            style={{
              marginHorizontal: -spacing[4],
              backgroundColor: colors.card,
              paddingVertical: spacing[3],
            }}
          >
            <StoriesRow>
              <StoryAvatar
                name="Add Story"
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
        </View>
      </Section>
    </View>
  );
}
