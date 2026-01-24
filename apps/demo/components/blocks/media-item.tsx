/**
 * MediaItem
 *
 * Thumbnail grid item for photos, videos, and files.
 * Perfect for galleries, media pickers, and file browsers.
 *
 * @example
 * ```tsx
 * // Photo grid
 * <MediaItem
 *   type="image"
 *   source={{ uri: 'https://example.com/photo.jpg' }}
 *   onPress={() => openViewer(photo)}
 * />
 *
 * // Video with duration
 * <MediaItem
 *   type="video"
 *   source={{ uri: 'https://example.com/thumb.jpg' }}
 *   duration={125}
 *   onPress={() => playVideo(video)}
 * />
 *
 * // Selectable media
 * <MediaItem
 *   type="image"
 *   source={{ uri: photo.uri }}
 *   selectable
 *   selected={selectedIds.includes(photo.id)}
 *   onSelect={() => toggleSelect(photo.id)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';

// Import UI primitives
import { Badge } from '@/components/ui/badge';

// ============================================================================
// Types
// ============================================================================

export type MediaType = 'image' | 'video' | 'file';

export interface MediaItemProps {
  /** Media type */
  type?: MediaType;
  /** Image/thumbnail source */
  source: ImageSourcePropType;
  /** Video duration in seconds (for type="video") */
  duration?: number;
  /** File extension label (for type="file") */
  fileType?: string;
  /** Size of the item (default: 100) */
  size?: number;
  /** Border radius (default: theme radius.md) */
  borderRadius?: number;
  /** Enable selection mode */
  selectable?: boolean;
  /** Whether item is selected */
  selected?: boolean;
  /** Called when item is pressed */
  onPress?: () => void;
  /** Called when item is selected (in selection mode) */
  onSelect?: () => void;
  /** Called on long press */
  onLongPress?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Helpers
// ============================================================================

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// Icons
// ============================================================================

function PlayIcon({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M8 5v14l11-7z" />
    </Svg>
  );
}

function CheckIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
      <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FileIcon({ size = 32, color = '#666666' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Component
// ============================================================================

export function MediaItem({
  type = 'image',
  source,
  duration,
  fileType,
  size = 100,
  borderRadius,
  selectable = false,
  selected = false,
  onPress,
  onSelect,
  onLongPress,
  style,
}: MediaItemProps) {
  const { colors, spacing, radius } = useTheme();

  const itemRadius = borderRadius ?? radius.md;
  const isVideo = type === 'video';
  const isFile = type === 'file';

  const handlePress = () => {
    if (selectable && onSelect) {
      onSelect();
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: itemRadius,
          backgroundColor: colors.secondary,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {/* Thumbnail */}
      {isFile ? (
        <View style={styles.fileContainer}>
          <FileIcon size={size * 0.35} color={colors.foregroundMuted} />
          {fileType && (
            <Badge variant="secondary" style={{ marginTop: spacing[2] }}>
              {fileType.toUpperCase()}
            </Badge>
          )}
        </View>
      ) : (
        <Image
          source={source}
          style={[styles.image, { borderRadius: itemRadius }]}
          resizeMode="cover"
        />
      )}

      {/* Video Play Indicator */}
      {isVideo && !selectable && (
        <View style={styles.playButton}>
          <View style={[styles.playButtonBg, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <PlayIcon size={24} />
          </View>
        </View>
      )}

      {/* Video Duration Badge */}
      {isVideo && duration !== undefined && (
        <View style={[styles.durationBadge, { margin: spacing[1] }]}>
          <Badge variant="secondary">{formatDuration(duration)}</Badge>
        </View>
      )}

      {/* Selection Overlay */}
      {selectable && (
        <>
          {/* Dim overlay when selected */}
          {selected && (
            <View
              style={[
                styles.selectedOverlay,
                { borderRadius: itemRadius, borderColor: colors.primary, borderWidth: 3 },
              ]}
            />
          )}

          {/* Checkbox */}
          <View style={[styles.checkbox, { top: spacing[2], right: spacing[2] }]}>
            <View
              style={[
                styles.checkboxInner,
                {
                  backgroundColor: selected ? colors.primary : 'rgba(255,255,255,0.8)',
                  borderColor: selected ? colors.primary : colors.border,
                  borderRadius: radius.full,
                },
              ]}
            >
              {selected && <CheckIcon size={14} />}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  checkbox: {
    position: 'absolute',
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
