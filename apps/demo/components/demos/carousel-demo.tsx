import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TextStyle, ViewStyle } from 'react-native';
import { Carousel, CarouselItem, CarouselRef } from '@/components/ui/carousel';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';
import { Button } from '@/components/ui/button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const banners = [
  { title: 'Summer Sale', subtitle: 'Up to 50% off', bg: '#FF6B6B' },
  { title: 'New Arrivals', subtitle: 'Fresh styles weekly', bg: '#4ECDC4' },
  { title: 'Free Shipping', subtitle: 'Orders over $50', bg: '#45B7D1' },
  { title: 'Members Only', subtitle: 'Exclusive deals', bg: '#9B59B6' },
];

const images = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'];

export function CarouselDemo() {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);

  const slideInfoStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    textAlign: 'center',
    color: colors.foregroundMuted,
    marginTop: spacing[2], // 8px
  };

  const hintStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    textAlign: 'center',
    color: colors.foregroundMuted,
    marginTop: spacing[2], // 8px
  };

  const bannerStyle: ViewStyle = {
    flex: 1,
    borderRadius: radius.xl, // 16px
    padding: spacing[5], // 20px
    justifyContent: 'flex-end',
  };

  const bannerTitleStyle: TextStyle = {
    color: '#fff', // Intentional contrast on colored backgrounds
    fontSize: fontSize['2xl'], // 24px
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1], // 4px
  };

  const bannerSubtitleStyle: TextStyle = {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSize.sm, // 14px
  };

  const colorSlideStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const colorTextStyle: TextStyle = {
    color: '#fff',
    fontSize: fontSize.md, // 16px
    fontWeight: fontWeight.semibold,
  };

  const productCardStyle: ViewStyle = {
    flex: 1,
    padding: spacing[4], // 16px
    backgroundColor: colors.card,
    borderRadius: radius.xl, // 20px
  };

  const productImageStyle: ViewStyle = {
    height: 100,
    marginBottom: spacing[3], // 12px
    borderRadius: radius.lg, // 12px
  };

  const productNameStyle: TextStyle = {
    fontSize: fontSize.md, // 16px
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing[1], // 4px
  };

  const productPriceStyle: TextStyle = {
    fontSize: fontSize.lg, // 18px
    fontWeight: fontWeight.bold,
    color: colors.primary,
  };

  return (
    <View style={[styles.container, { gap: spacing[8] }]}>
      <Section title="Basic Carousel">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={160} onSlideChange={setActiveSlide}>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    bannerStyle,
                    { backgroundColor: banner.bg, margin: spacing[4] },
                  ]}
                >
                  <Text style={bannerTitleStyle}>{banner.title}</Text>
                  <Text style={bannerSubtitleStyle}>{banner.subtitle}</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
        <Text style={slideInfoStyle}>
          Current slide: {activeSlide + 1} / {banners.length}
        </Text>
      </Section>

      <Section title="Autoplay">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={120} autoplay autoplayInterval={3000}>
            {images.map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    colorSlideStyle,
                    {
                      backgroundColor: color,
                      margin: spacing[4],
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <Text style={colorTextStyle}>Slide {index + 1}</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
        <Text style={hintStyle}>Auto-advances every 3 seconds</Text>
      </Section>

      <Section title="Without Indicators">
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={100} showIndicators={false}>
            {['#1ABC9C', '#E67E22', '#3498DB'].map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    colorSlideStyle,
                    {
                      backgroundColor: color,
                      margin: spacing[4],
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <Text style={colorTextStyle}>No indicators</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
      </Section>

      <Section title="Indicator Styles">
        <Text style={{ ...hintStyle, marginTop: 0, marginBottom: spacing[2] }}>
          Dot style (default)
        </Text>
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={100} indicatorStyle="dot">
            {['#8E44AD', '#16A085', '#D35400'].map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    colorSlideStyle,
                    {
                      backgroundColor: color,
                      margin: spacing[4],
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <Text style={colorTextStyle}>Dot</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
        <Text style={{ ...hintStyle, marginBottom: spacing[2] }}>
          Line style
        </Text>
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={100} indicatorStyle="line">
            {['#8E44AD', '#16A085', '#D35400'].map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    colorSlideStyle,
                    {
                      backgroundColor: color,
                      margin: spacing[4],
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <Text style={colorTextStyle}>Line</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
      </Section>

      <Section title="Indicator Positions">
        <Text style={{ ...hintStyle, marginTop: 0, marginBottom: spacing[2] }}>
          Indicators on top
        </Text>
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel height={120} indicatorPosition="top">
            {['#8E44AD', '#16A085', '#D35400'].map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    colorSlideStyle,
                    {
                      backgroundColor: color,
                      margin: spacing[4],
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <Text style={colorTextStyle}>Top</Text>
                </View>
              </CarouselItem>
            ))}
          </Carousel>
        </View>
      </Section>

      <Section title="Controlled via Ref">
        <View style={{ flexDirection: 'row', gap: spacing[2], marginBottom: spacing[3] }}>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => carouselRef.current?.scrollToIndex(0)}
          >
            First
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => carouselRef.current?.scrollToIndex(1)}
          >
            Second
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => carouselRef.current?.scrollToIndex(2)}
          >
            Third
          </Button>
        </View>
        <View style={{ marginHorizontal: -spacing[4] }}>
          <Carousel ref={carouselRef} height={100}>
            {images.slice(0, 3).map((color, index) => (
              <CarouselItem key={index}>
                <View
                  style={[
                    colorSlideStyle,
                    {
                      backgroundColor: color,
                      margin: spacing[4],
                      borderRadius: radius.lg,
                    },
                  ]}
                >
                  <Text style={colorTextStyle}>Slide {index + 1}</Text>
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
                <View style={[productCardStyle, { margin: spacing[4] }]}>
                  <View
                    style={[productImageStyle, { backgroundColor: product.color }]}
                  />
                  <Text style={productNameStyle}>{product.name}</Text>
                  <Text style={productPriceStyle}>{product.price}</Text>
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
  container: {}, // gap applied inline with spacing token
});
