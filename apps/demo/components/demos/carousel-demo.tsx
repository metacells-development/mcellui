import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const banners = [
  { title: 'Summer Sale', subtitle: 'Up to 50% off', bg: '#FF6B6B' },
  { title: 'New Arrivals', subtitle: 'Fresh styles weekly', bg: '#4ECDC4' },
  { title: 'Free Shipping', subtitle: 'Orders over $50', bg: '#45B7D1' },
  { title: 'Members Only', subtitle: 'Exclusive deals', bg: '#9B59B6' },
];

const images = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
];

export function CarouselDemo() {
  const { colors, spacing, radius } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View style={styles.container}>
      <Section title="Basic Carousel">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={160} onSlideChange={setActiveSlide}>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    styles.banner,
                    { backgroundColor: banner.bg, margin: spacing[4] },
                  ]}
                >
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
        <Text style={[styles.slideInfo, { color: colors.foregroundMuted }]}>
          Current slide: {activeSlide + 1} / {banners.length}
        </Text>
      </Section>

      <Section title="Autoplay Carousel">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={120} autoplay autoplayInterval={3000}>
            {images.map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    styles.colorSlide,
                    { backgroundColor: color, margin: spacing[4], borderRadius: radius.lg },
                  ]}
                >
                  <Text style={styles.colorText}>Slide {index + 1}</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
        <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
          Auto-advances every 3 seconds
        </Text>
      </Section>

      <Section title="Without Indicators">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={100} showIndicators={false}>
            {['#1ABC9C', '#E67E22', '#3498DB'].map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    styles.colorSlide,
                    { backgroundColor: color, margin: spacing[4], borderRadius: radius.lg },
                  ]}
                >
                  <Text style={styles.colorText}>No indicators</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
      </Section>

      <Section title="Product Showcase">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={280}>
            {[
              { name: 'Wireless Earbuds', price: '$79', color: '#F8F9FA' },
              { name: 'Smart Watch', price: '$199', color: '#F1F3F4' },
              { name: 'Laptop Stand', price: '$49', color: '#E8EAED' },
            ].map((product, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    styles.productCard,
                    {
                      backgroundColor: colors.card,
                      margin: spacing[4],
                      borderRadius: radius.xl,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.productImage,
                      { backgroundColor: product.color, borderRadius: radius.lg },
                    ]}
                  />
                  <Text style={[styles.productName, { color: colors.foreground }]}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productPrice, { color: colors.primary }]}>
                    {product.price}
                  </Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
      </Section>

      <Section title="Top Indicators">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={120} indicatorPosition="top">
            {['#8E44AD', '#16A085', '#D35400'].map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    styles.colorSlide,
                    { backgroundColor: color, margin: spacing[4], borderRadius: radius.lg },
                  ]}
                >
                  <Text style={styles.colorText}>Indicators on top</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 32 },
  banner: {
    flex: 1,
    borderRadius: 16,
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
  },
  colorSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  slideInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  productCard: {
    flex: 1,
    padding: 16,
  },
  productImage: {
    height: 100,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
});
