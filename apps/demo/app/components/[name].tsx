import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Component demos
import { ButtonDemo } from '@/components/demos/button-demo';
import { CardDemo } from '@/components/demos/card-demo';
import { InputDemo } from '@/components/demos/input-demo';
import { BadgeDemo } from '@/components/demos/badge-demo';
import { AvatarDemo } from '@/components/demos/avatar-demo';

const demos: Record<string, React.ComponentType> = {
  button: ButtonDemo,
  card: CardDemo,
  input: InputDemo,
  badge: BadgeDemo,
  avatar: AvatarDemo,
};

const titles: Record<string, string> = {
  button: 'Button',
  card: 'Card',
  input: 'Input',
  badge: 'Badge',
  avatar: 'Avatar',
};

export default function ComponentPage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const DemoComponent = demos[name ?? ''];
  const title = titles[name ?? ''] ?? 'Component';

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {DemoComponent ? (
          <DemoComponent />
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>Component not found</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    padding: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundText: {
    fontSize: 16,
    color: '#737373',
  },
});
