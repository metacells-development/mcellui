import React, { useState } from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, ViewStyle } from 'react-native';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  source?: ImageSourcePropType;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export function Avatar({ source, fallback = '?', size = 'md', style }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !source || imageError;
  const sizeValue = sizes[size];

  return (
    <View style={cn(styles.container, { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 }, style)}>
      {showFallback ? (
        <View style={cn(styles.fallback, { borderRadius: sizeValue / 2 })}>
          <Text style={cn(styles.fallbackText, styles[`${size}Text`])}>{fallback.slice(0, 2).toUpperCase()}</Text>
        </View>
      ) : (
        <Image source={source} style={cn(styles.image, { borderRadius: sizeValue / 2 })} onError={() => setImageError(true)} />
      )}
    </View>
  );
}

const sizes = { sm: 32, md: 40, lg: 56, xl: 80 };

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#e5e5e5' },
  image: { width: '100%', height: '100%' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6' },
  fallbackText: { color: '#ffffff', fontWeight: '600' },
  smText: { fontSize: 12 },
  mdText: { fontSize: 14 },
  lgText: { fontSize: 20 },
  xlText: { fontSize: 28 },
});
