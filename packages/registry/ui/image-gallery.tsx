/**
 * ImageGallery
 *
 * Grid of images with fullscreen viewer on tap.
 * Supports pinch-to-zoom and swipe navigation in fullscreen mode.
 *
 * @example
 * ```tsx
 * // Basic gallery
 * <ImageGallery
 *   images={[
 *     { uri: 'https://...' },
 *     { uri: 'https://...' },
 *     { uri: 'https://...' },
 *   ]}
 * />
 *
 * // Custom columns
 * <ImageGallery
 *   images={photos}
 *   columns={2}
 *   spacing={8}
 * />
 *
 * // With aspect ratio
 * <ImageGallery
 *   images={photos}
 *   aspectRatio={1} // Square
 * />
 *
 * // With onImagePress callback
 * <ImageGallery
 *   images={photos}
 *   onImagePress={(index) => console.log('Pressed image:', index)}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  FlatList,
  ImageSourcePropType,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useTheme, haptic, imageGalleryTokens } from '@metacells/mcellui-core';
import { Skeleton } from './skeleton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryImage {
  /** Image URI */
  uri: string;
  /** Optional thumbnail URI (for grid) */
  thumbnail?: string;
  /** Optional alt text */
  alt?: string;
}

export interface ImageGalleryProps {
  /** Array of images */
  images: GalleryImage[];
  /** Number of columns in grid */
  columns?: number;
  /** Spacing between images */
  spacing?: number;
  /** Aspect ratio of grid images (width/height) */
  aspectRatio?: number;
  /** Border radius for grid images */
  borderRadius?: number;
  /** Called when an image is pressed */
  onImagePress?: (index: number) => void;
  /** Disable fullscreen viewer */
  disableViewer?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// FullscreenViewer Component
// ─────────────────────────────────────────────────────────────────────────────

interface FullscreenViewerProps {
  images: GalleryImage[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

function FullscreenViewer({
  images,
  initialIndex,
  visible,
  onClose,
}: FullscreenViewerProps) {
  const { colors } = useTheme();
  const tokens = imageGalleryTokens;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fullscreenLoaded, setFullscreenLoaded] = useState<Set<number>>(new Set());

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      setCurrentIndex(initialIndex);
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, initialIndex, opacity]);

  const close = useCallback(() => {
    opacity.value = withTiming(0, { duration: 150 });
    setTimeout(onClose, 150);
  }, [opacity, onClose]);

  // Pinch to zoom gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(event.scale, 3));
    })
    .onEnd(() => {
      if (scale.value < 1.1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // Pan gesture (when zoomed)
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      } else if (Math.abs(event.translationY) > 50) {
        // Swipe down to close
        opacity.value = withTiming(0, { duration: 150 });
        runOnJS(close)();
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // Double tap to zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      } else {
        scale.value = withSpring(2);
      }
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (index !== currentIndex && index >= 0 && index < images.length) {
        setCurrentIndex(index);
        // Reset zoom when changing images
        scale.value = withTiming(1, { duration: 100 });
        translateX.value = withTiming(0, { duration: 100 });
        translateY.value = withTiming(0, { duration: 100 });
      }
    },
    [currentIndex, images.length, scale, translateX, translateY]
  );

  const renderImage = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => {
      const isLoaded = fullscreenLoaded.has(index);
      return (
        <GestureDetector gesture={composedGesture}>
          <View style={styles.fullscreenImageContainer}>
            <AnimatedImage
              source={{ uri: item.uri }}
              style={[styles.fullscreenImage, imageStyle]}
              resizeMode="contain"
              accessibilityLabel={item.alt}
              onLoadEnd={() => setFullscreenLoaded(prev => new Set([...prev, index]))}
            />
            {!isLoaded && (
              <ActivityIndicator
                size="large"
                color={colors.background}
                style={styles.fullscreenLoader}
              />
            )}
          </View>
        </GestureDetector>
      );
    },
    [composedGesture, imageStyle, fullscreenLoaded, colors.background]
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <GestureHandlerRootView style={styles.fullscreenContainer}>
        <Animated.View style={[styles.fullscreenBackdrop, { backgroundColor: `rgba(0, 0, 0, ${tokens.fullscreen.backdropOpacity})` }, backdropStyle]}>
          {/* Close button */}
          <Pressable
            style={[
              styles.closeButton,
              {
                top: Platform.OS === 'ios' ? tokens.fullscreen.closeButtonTop : tokens.fullscreen.closeButtonTopAndroid,
              },
            ]}
            onPress={() => {
              haptic('light');
              close();
            }}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <View style={[
              styles.closeIcon,
              {
                width: tokens.fullscreen.closeButtonSize,
                height: tokens.fullscreen.closeButtonSize,
                borderRadius: tokens.fullscreen.closeButtonSize / 2,
                backgroundColor: colors.background,
              },
            ]}>
              <View style={[
                styles.closeLine,
                styles.closeLine1,
                {
                  width: tokens.fullscreen.closeLineWidth,
                  height: tokens.fullscreen.closeLineHeight,
                  backgroundColor: colors.foreground,
                },
              ]} />
              <View style={[
                styles.closeLine,
                styles.closeLine2,
                {
                  width: tokens.fullscreen.closeLineWidth,
                  height: tokens.fullscreen.closeLineHeight,
                  backgroundColor: colors.foreground,
                },
              ]} />
            </View>
          </Pressable>

          {/* Images */}
          <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={handleScroll}
          />

          {/* Page indicator */}
          {images.length > 1 && (
            <View style={[
              styles.pageIndicator,
              {
                bottom: tokens.fullscreen.pageIndicatorBottom,
                gap: tokens.fullscreen.dotGap,
              },
            ]}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.pageDot,
                    {
                      width: tokens.fullscreen.dotSize,
                      height: tokens.fullscreen.dotSize,
                      borderRadius: tokens.fullscreen.dotSize / 2,
                      backgroundColor:
                        index === currentIndex
                          ? colors.background
                          : 'rgba(255,255,255,0.4)',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageGallery Component
// ─────────────────────────────────────────────────────────────────────────────

export function ImageGallery({
  images,
  columns = 3,
  spacing = 2,
  aspectRatio = 1,
  borderRadius = 0,
  onImagePress,
  disableViewer = false,
}: ImageGalleryProps) {
  const { colors, radius } = useTheme();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const imageSize = (SCREEN_WIDTH - spacing * (columns + 1)) / columns;

  const handleImagePress = useCallback(
    (index: number) => {
      haptic('light');
      onImagePress?.(index);

      if (!disableViewer) {
        setSelectedIndex(index);
        setViewerVisible(true);
      }
    },
    [onImagePress, disableViewer]
  );

  const handleCloseViewer = useCallback(() => {
    setViewerVisible(false);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => {
      const isLoaded = loadedImages.has(index);
      const imageHeight = imageSize / aspectRatio;
      return (
        <Pressable
          onPress={() => handleImagePress(index)}
          style={({ pressed }) => [
            styles.gridItem,
            {
              width: imageSize,
              height: imageHeight,
              marginLeft: spacing,
              marginTop: spacing,
              borderRadius: borderRadius || radius.sm,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={item.alt || `Image ${index + 1}`}
        >
          {!isLoaded && (
            <Skeleton
              width={imageSize}
              height={imageHeight}
              radius="sm"
              style={styles.gridSkeleton}
            />
          )}
          <Image
            source={{ uri: item.thumbnail || item.uri }}
            style={[
              styles.gridImage,
              { borderRadius: borderRadius || radius.sm },
              !isLoaded && styles.gridImageLoading,
            ]}
            onLoadEnd={() => setLoadedImages(prev => new Set([...prev, index]))}
          />
        </Pressable>
      );
    },
    [handleImagePress, imageSize, aspectRatio, spacing, borderRadius, radius.sm, loadedImages]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={columns}
        scrollEnabled={false}
        style={styles.grid}
        contentContainerStyle={{ paddingBottom: spacing }}
      />

      <FullscreenViewer
        images={images}
        initialIndex={selectedIndex}
        visible={viewerVisible}
        onClose={handleCloseViewer}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {},
  grid: {},
  gridItem: {
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridImageLoading: {
    opacity: 0,
  },
  gridSkeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fullscreenContainer: {
    flex: 1,
  },
  fullscreenBackdrop: {
    flex: 1,
  },
  fullscreenImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  fullscreenLoader: {
    position: 'absolute',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
  },
  closeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLine: {
    position: 'absolute',
    borderRadius: 1,
  },
  closeLine1: {
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  pageIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageDot: {},
});
