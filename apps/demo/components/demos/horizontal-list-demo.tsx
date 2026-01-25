import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { HorizontalList } from '@/components/ui/horizontal-list';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function HorizontalListDemo() {
  const { colors, spacing, radius, platformShadow, fontSize, fontWeight } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const containerStyle = {
    gap: spacing[8], // 32px
  };

  return (
    <View style={containerStyle}>
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
                    padding: spacing[3], // 12px
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
                      marginBottom: spacing[2.5], // 10px
                    },
                  ]}
                />
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: fontSize.sm, // 14px
                    fontWeight: fontWeight.semibold, // 600
                    marginBottom: spacing[1], // 4px
                  }}
                  numberOfLines={1}
                >
                  {item}
                </Text>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: fontSize.md, // 16px
                    fontWeight: fontWeight.bold, // 700
                  }}
                >
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
                  padding: spacing[5], // 20px
                },
              ]}
            >
              <Text
                style={[
                  styles.bannerTitle,
                  {
                    fontSize: fontSize['2xl'], // 24px
                    fontWeight: fontWeight.bold, // 700
                    marginBottom: spacing[1], // 4px
                  },
                ]}
              >
                {banner.title}
              </Text>
              <Text
                style={[
                  styles.bannerSubtitle,
                  {
                    fontSize: fontSize.sm, // 14px
                    fontWeight: fontWeight.medium, // 500
                  },
                ]}
              >
                {banner.subtitle}
              </Text>
            </View>
          ))}
        </HorizontalList>
        {/* Pagination dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing[1.5], // 6px
            marginTop: spacing[3], // 12px
          }}
        >
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
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.secondary,
                borderRadius: radius.full,
                paddingHorizontal: spacing[3.5], // 14px
                paddingVertical: spacing[2.5], // 10px
                gap: spacing[1.5], // 6px
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ fontSize: fontSize.md }}>{cat.emoji}</Text>
              <Text
                style={{
                  color: colors.secondaryForeground,
                  fontSize: fontSize.sm, // 14px
                  fontWeight: fontWeight.medium, // 500
                }}
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
                      padding: spacing[0.5], // 2px
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
                    <Text
                      style={[
                        styles.storyInitial,
                        {
                          fontSize: fontSize['2xl'], // 22px
                          fontWeight: fontWeight.semibold, // 600
                        },
                      ]}
                    >
                      {index === 0 ? '+' : name[0]}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: fontSize.xs, // 12px
                    marginTop: spacing[1.5], // 6px
                    textAlign: 'center',
                  }}
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
  // Product Cards - semantic dimensions kept
  productCard: {
    width: 150, // Semantic card width
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },

  // Banner Cards - semantic dimensions kept
  bannerCard: {
    height: 140, // Semantic banner height
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#fff', // Intentional contrast on colored backgrounds
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)', // Intentional contrast
  },

  // Pagination
  dot: {
    width: 6, // Semantic micro element
    height: 6,
    borderRadius: 3,
  },

  // Stories - semantic dimensions kept
  storyContainer: {
    alignItems: 'center',
    width: 68, // Semantic story width
  },
  storyRing: {
    width: 64, // Semantic ring size
    height: 64,
    borderRadius: 32,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 30, // Semantic circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyInitial: {
    color: '#fff', // Intentional white on colored avatar
  },

  // Gallery - semantic dimensions kept
  galleryImage: {
    width: 120, // Semantic image dimensions
    height: 160,
  },
});
