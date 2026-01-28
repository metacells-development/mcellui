/**
 * TagInput
 *
 * Input field for entering multiple tags/chips.
 * Supports autocomplete suggestions and validation.
 *
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   placeholder="Add tags..."
 *   maxTags={5}
 * />
 *
 * // With suggestions
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   suggestions={['React', 'TypeScript', 'JavaScript']}
 * />
 * ```
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// ============================================================================
// Icons
// ============================================================================

function CloseIcon({ size = 14, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type TagInputSize = 'sm' | 'md' | 'lg';

export interface TagInputProps {
  /** Current tags */
  value: string[];
  /** Called when tags change */
  onChange: (tags: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: TagInputSize;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Maximum length of each tag */
  maxTagLength?: number;
  /** Minimum length of each tag */
  minTagLength?: number;
  /** Delimiter characters that create a new tag */
  delimiters?: string[];
  /** Whether duplicate tags are allowed */
  allowDuplicates?: boolean;
  /** Autocomplete suggestions */
  suggestions?: string[];
  /** Whether input is disabled */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Custom validation function */
  validate?: (tag: string) => boolean | string;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Size Configs
// ============================================================================
// Removed: Now using centralized tokens from components.tagInput[size]

// ============================================================================
// Tag Component
// ============================================================================

const AnimatedView = Animated.createAnimatedComponent(View);

function Tag({
  label,
  onRemove,
  size,
  disabled,
}: {
  label: string;
  onRemove: () => void;
  size: TagInputSize;
  disabled?: boolean;
}) {
  const { colors, radius, spacing, components } = useTheme();
  const tokens = components.tagInput[size];

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedView
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      layout={Layout.springify()}
      style={[
        animatedStyle,
        styles.tag,
        {
          height: tokens.tagHeight,
          backgroundColor: colors.secondary,
          borderRadius: radius.full,
          paddingHorizontal: spacing[2],
          gap: spacing[1],
        },
      ]}
    >
      <Text
        style={[
          styles.tagText,
          {
            fontSize: tokens.tagFontSize,
            color: colors.foreground,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {!disabled && (
        <Pressable
          onPress={onRemove}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <CloseIcon size={12} color={colors.foregroundMuted} />
        </Pressable>
      )}
    </AnimatedView>
  );
}

// ============================================================================
// Suggestion Item
// ============================================================================

function SuggestionItem({
  label,
  onPress,
  size,
}: {
  label: string;
  onPress: () => void;
  size: TagInputSize;
}) {
  const { colors, spacing, components } = useTheme();
  const tokens = components.tagInput[size];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.suggestionItem,
        {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          backgroundColor: pressed ? colors.secondary : 'transparent',
        },
      ]}
    >
      <Text style={{ fontSize: tokens.inputFontSize, color: colors.foreground }}>
        {label}
      </Text>
    </Pressable>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TagInput({
  value,
  onChange,
  placeholder = 'Add tag...',
  size = 'md',
  maxTags,
  maxTagLength = 50,
  minTagLength = 1,
  delimiters = [',', 'Enter'],
  allowDuplicates = false,
  suggestions = [],
  disabled = false,
  error,
  label,
  helperText,
  validate,
  style,
}: TagInputProps) {
  const { colors, spacing, components, componentRadius, platformShadow } = useTheme();
  const tokens = components.tagInput[size];
  const inputRef = useRef<TextInput>(null);

  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const canAddMore = !maxTags || value.length < maxTags;

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      (allowDuplicates || !value.includes(s))
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    // Validation
    if (!trimmedTag) return;
    if (trimmedTag.length < minTagLength) {
      setValidationError(`Tag must be at least ${minTagLength} characters`);
      return;
    }
    if (trimmedTag.length > maxTagLength) {
      setValidationError(`Tag must be at most ${maxTagLength} characters`);
      return;
    }
    if (!allowDuplicates && value.includes(trimmedTag)) {
      setValidationError('Tag already exists');
      return;
    }
    if (maxTags && value.length >= maxTags) {
      setValidationError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    // Custom validation
    if (validate) {
      const result = validate(trimmedTag);
      if (result !== true) {
        setValidationError(typeof result === 'string' ? result : 'Invalid tag');
        return;
      }
    }

    haptic('light');
    setValidationError(null);
    onChange([...value, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    haptic('light');
    setValidationError(null);
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;

    if (delimiters.includes(key)) {
      e.preventDefault?.();
      addTag(inputValue);
    } else if (key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleTextChange = (text: string) => {
    // Check for delimiter characters in pasted text
    for (const delimiter of delimiters) {
      if (delimiter !== 'Enter' && text.includes(delimiter)) {
        const parts = text.split(delimiter);
        const tagsToAdd = parts.slice(0, -1).filter((t) => t.trim());

        tagsToAdd.forEach((tag) => addTag(tag));
        setInputValue(parts[parts.length - 1]);
        return;
      }
    }

    setInputValue(text);
    setShowSuggestions(text.length > 0 && filteredSuggestions.length > 0);
    setValidationError(null);
  };

  const handleSubmitEditing = () => {
    addTag(inputValue);
  };

  const handleSuggestionPress = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const handleContainerPress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const displayError = error || validationError;

  return (
    <View style={style}>
      {/* Label */}
      {label && (
        <Text
          style={[
            styles.label,
            {
              fontSize: tokens.labelFontSize,
              color: colors.foreground,
              marginBottom: spacing[1],
            },
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input container */}
      <Pressable
        onPress={handleContainerPress}
        style={[
          styles.container,
          {
            borderWidth: 1,
            borderColor: displayError ? colors.destructive : colors.border,
            borderRadius: componentRadius.tagInput,
            padding: tokens.padding,
            gap: tokens.gap,
            backgroundColor: disabled ? colors.secondary : colors.background,
            opacity: disabled ? 0.6 : 1,
            minHeight: tokens.minHeight,
          },
        ]}
      >
        {/* Tags */}
        {value.map((tag, index) => (
          <Tag
            key={`${tag}-${index}`}
            label={tag}
            onRemove={() => removeTag(index)}
            size={size}
            disabled={disabled}
          />
        ))}

        {/* Input */}
        {canAddMore && !disabled && (
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={handleTextChange}
            onKeyPress={handleKeyPress}
            onSubmitEditing={handleSubmitEditing}
            onFocus={() => setShowSuggestions(inputValue.length > 0 && filteredSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            placeholderTextColor={colors.foregroundMuted}
            style={[
              styles.input,
              {
                fontSize: tokens.inputFontSize,
                color: colors.foreground,
                minWidth: value.length === 0 ? '100%' : 80,
              },
            ]}
            blurOnSubmit={false}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      </Pressable>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View
          style={[
            styles.suggestions,
            {
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: componentRadius.tagInput,
              marginTop: spacing[1],
            },
            platformShadow('sm'),
          ]}
        >
          <ScrollView style={{ maxHeight: 150 }} keyboardShouldPersistTaps="handled">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion}
                label={suggestion}
                onPress={() => handleSuggestionPress(suggestion)}
                size={size}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Helper text / Error */}
      {(helperText || displayError) && (
        <Text
          style={[
            styles.helperText,
            {
              fontSize: tokens.helperFontSize,
              color: displayError ? colors.destructive : colors.foregroundMuted,
              marginTop: spacing[1],
            },
          ]}
        >
          {displayError || helperText}
        </Text>
      )}

      {/* Tag count */}
      {maxTags && (
        <Text
          style={[
            styles.tagCount,
            {
              color: value.length >= maxTags ? colors.destructive : colors.foregroundMuted,
              marginTop: spacing[1],
            },
          ]}
        >
          {value.length}/{maxTags} tags
        </Text>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontWeight: '500',
    maxWidth: 150,
  },
  input: {
    flex: 1,
    minHeight: 24,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  suggestions: {
    position: 'relative',
    zIndex: 100,
  },
  suggestionItem: {},
  helperText: {
    fontSize: 12,
  },
  tagCount: {
    fontSize: 12,
    textAlign: 'right',
  },
});
