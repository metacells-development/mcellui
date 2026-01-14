import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const components = [
  { name: 'button', title: 'Button', description: 'Pressable button with variants' },
  { name: 'card', title: 'Card', description: 'Container with shadow' },
  { name: 'input', title: 'Input', description: 'Text input with validation' },
  { name: 'badge', title: 'Badge', description: 'Status indicator' },
  { name: 'avatar', title: 'Avatar', description: 'Profile picture' },
];

export default function Home() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Components</Text>
        <Text style={styles.subtitle}>
          Tap a component to see examples and variants
        </Text>
      </View>

      <View style={styles.grid}>
        {components.map((component) => (
          <Link
            key={component.name}
            href={`/components/${component.name}`}
            asChild
          >
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{component.title}</Text>
              <Text style={styles.cardDescription}>{component.description}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#171717',
  },
  subtitle: {
    fontSize: 16,
    color: '#737373',
    marginTop: 4,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#171717',
  },
  cardDescription: {
    fontSize: 14,
    color: '#737373',
    marginTop: 4,
  },
});
