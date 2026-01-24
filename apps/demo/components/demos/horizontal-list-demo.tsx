import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { HorizontalList } from '@/components/ui/horizontal-list';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function HorizontalListDemo() {
  const { colors, spacing, radius, platformShadow } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Section title="Product Cards">
        <HorizontalList
          contentInset={16}
          itemSpacing={12}
          style={{ marginHorizontal: -spacing[4] }}
        >
          {['Wireless Earbuds', 'Smart Watch', 'Phone Case', 'Charger', 'Cable'].map(
            (item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.productCard,
                  {
                    backgroundColor: colors.card,
                    borderRadius: radius.xl,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                  platformShadow('md'),
                ]}
              >
                <View
                  style={[
                    styles.productImage,
                    {
                      backgroundColor: colors.backgroundMuted,
                      borderRadius: radius.lg,
                    },
                  ]}
                />
                <Text
                  style={[styles.productTitle, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>
                  ${(19.99 + index * 10).toFixed(2)}
                </Text>
              </Pressable>
            )
          )}
        </HorizontalList>
      </Section>

      <Section title="Featured Banners">
        <HorizontalList
          contentInset={16}
          itemSpacing={16}
          style={{ marginHorizontal: -spacing[4] }}
          onActiveIndexChange={setActiveIndex}
        >
          {[
            { title: 'Summer Sale', subtitle: 'Up to 50% off', bg: '#FF6B6B' },
            { title: 'New Arrivals', subtitle: 'Fresh styles', bg: '#4ECDC4' },
            { title: 'Free Shipping', subtitle: 'Orders over $50', bg: '#45B7D1' },
            { title: 'Members Only', subtitle: 'Exclusive deals', bg: '#9B59B6' },
          ].map((banner, index) => (
            <View
              key={index}
              style={[
                styles.bannerCard,
                {
                  width: SCREEN_WIDTH - 32,
                  backgroundColor: banner.bg,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
          ))}
        </HorizontalList>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>
      </Section>

      <Section title="Categories">
        <HorizontalList contentInset={16} itemSpacing={10} style={{ marginHorizontal: -spacing[4] }}>
          {[
            { name: 'Electronics', emoji: '📱' },
            { name: 'Fashion', emoji: '👕' },
            { name: 'Home', emoji: '🏠' },
            { name: 'Sports', emoji: '⚽' },
            { name: 'Books', emoji: '📚' },
            { name: 'Beauty', emoji: '💄' },
          ].map((cat, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.categoryChip,
                {
                  backgroundColor: colors.secondary,
                  borderRadius: radius.full,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text
                style={[styles.categoryName, { color: colors.secondaryForeground }]}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </HorizontalList>
      </Section>

      <Section title="Story Avatars">
        <HorizontalList contentInset={16} itemSpacing={12} snapEnabled={false} style={{ marginHorizontal: -spacing[4] }}>
          {['You', 'Alex', 'Emma', 'John', 'Lisa', 'Mike', 'Sara'].map(
            (name, index) => (
              <Pressable
                key={name}
                style={({ pressed }) => [
                  styles.storyContainer,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View
                  style={[
                    styles.storyRing,
                    {
                      borderColor: index === 0 ? colors.border : colors.primary,
                      borderWidth: index === 0 ? 1 : 2,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.storyAvatar,
                      {
                        backgroundColor: `hsl(${index * 45}, 60%, 65%)`,
                      },
                    ]}
                  >
                    <Text style={styles.storyInitial}>
                      {index === 0 ? '+' : name[0]}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.storyName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Pressable>
            )
          )}
        </HorizontalList>
      </Section>

      <Section title="Image Gallery">
        <HorizontalList contentInset={16} itemSpacing={8} style={{ marginHorizontal: -spacing[4] }}>
          {['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'].map(
            (color, index) => (
              <View
                key={index}
                style={[
                  styles.galleryImage,
                  {
                    backgroundColor: color,
                    borderRadius: radius.lg,
                  },
                ]}
              />
            )
          )}
        </HorizontalList>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },

  // Product Cards
  productCard: {
    width: 150,
    padding: 12,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Banner Cards
  bannerCard: {
    height: 140,
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Categories
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Stories
  storyContainer: {
    alignItems: 'center',
    width: 68,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  storyName: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },

  // Gallery
  galleryImage: {
    width: 120,
    height: 160,
  },
});
