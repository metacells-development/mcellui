/**
 * ChatBubble
 *
 * Chat message bubble with status indicators for messaging interfaces.
 * Supports sent/received messages, read receipts, and timestamps.
 *
 * @example
 * ```tsx
 * // Received message
 * <ChatBubble
 *   message="Hey! How's it going?"
 *   isOwn={false}
 *   time="10:30 AM"
 *   avatar={{ name: 'John', avatarUrl: '...' }}
 * />
 *
 * // Sent message with status
 * <ChatBubble
 *   message="I'm doing great, thanks!"
 *   isOwn={true}
 *   time="10:31 AM"
 *   status="read"
 * />
 * ```
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageSourcePropType, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, socialBlockTokens } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';

// ============================================================================
// Icons
// ============================================================================

function CheckIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DoubleCheckIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L7 17l-5-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 10l-9 9-1-1"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface ChatBubbleUser {
  /** User display name */
  name: string;
  /** Avatar fallback initials */
  avatar?: string;
  /** Avatar image URL */
  avatarUrl?: string;
}

export interface ChatBubbleProps {
  /** Message text content */
  message: string;
  /** Whether this is the current user's message */
  isOwn?: boolean;
  /** Message timestamp string */
  time?: string;
  /** Message status (only shown for own messages) */
  status?: MessageStatus;
  /** User info (only shown for received messages) */
  user?: ChatBubbleUser;
  /** Whether to show the avatar */
  showAvatar?: boolean;
  /** Whether this is the first message in a group */
  isFirst?: boolean;
  /** Whether this is the last message in a group */
  isLast?: boolean;
  /** Optional image attachment */
  image?: ImageSourcePropType;
  /** Called when message is long pressed */
  onLongPress?: () => void;
  /** Whether message interactions are disabled */
  disabled?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function ChatBubble({
  message,
  isOwn = false,
  time,
  status,
  user,
  showAvatar = true,
  isFirst = true,
  isLast = true,
  image,
  onLongPress,
  disabled = false,
  style,
}: ChatBubbleProps) {
  const { colors, spacing, radius } = useTheme();

  // Get initials from name
  const initials = user?.avatar || user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  // Status icon
  const renderStatus = () => {
    if (!isOwn || !status) return null;

    const statusColor = status === 'read' ? colors.primary : 'rgba(255,255,255,0.7)';
    const iconSize = 14;

    switch (status) {
      case 'sending':
        return <ClockIcon size={iconSize} color="rgba(255,255,255,0.7)" />;
      case 'sent':
        return <CheckIcon size={iconSize} color="rgba(255,255,255,0.7)" />;
      case 'delivered':
        return <DoubleCheckIcon size={iconSize} color="rgba(255,255,255,0.7)" />;
      case 'read':
        return <DoubleCheckIcon size={iconSize} color={statusColor} />;
      case 'error':
        return (
          <View style={[styles.errorDot, { backgroundColor: colors.destructive }]} />
        );
      default:
        return null;
    }
  };

  // Bubble colors
  const bubbleBackground = isOwn ? colors.primary : colors.secondary;
  const textColor = isOwn ? colors.primaryForeground : colors.foreground;
  const timeColor = isOwn ? 'rgba(255,255,255,0.7)' : colors.foregroundMuted;

  // Border radius based on position in group
  const getBorderRadius = () => {
    const baseRadius = radius.xl;
    const smallRadius = radius.sm;

    if (isOwn) {
      return {
        borderTopLeftRadius: baseRadius,
        borderTopRightRadius: isFirst ? baseRadius : smallRadius,
        borderBottomLeftRadius: baseRadius,
        borderBottomRightRadius: isLast ? baseRadius : smallRadius,
      };
    }

    return {
      borderTopLeftRadius: isFirst ? baseRadius : smallRadius,
      borderTopRightRadius: baseRadius,
      borderBottomLeftRadius: isLast ? baseRadius : smallRadius,
      borderBottomRightRadius: baseRadius,
    };
  };

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.containerOwn : styles.containerOther,
        { marginBottom: isLast ? spacing[2] : spacing[0.5] },
        style,
      ]}
    >
      {/* Avatar for received messages */}
      {!isOwn && showAvatar && isLast && user && (
        <Avatar
          source={user.avatarUrl ? { uri: user.avatarUrl } : undefined}
          fallback={initials}
          size={socialBlockTokens.avatar.chatSize}
          style={{ marginRight: spacing[2] }}
        />
      )}

      {/* Spacer when avatar is hidden */}
      {!isOwn && showAvatar && !isLast && (
        <View style={{ width: 32 + spacing[2] }} />
      )}

      {/* Message bubble */}
      <Pressable
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleBackground,
            maxWidth: socialBlockTokens.bubble.maxWidth,
            paddingHorizontal: socialBlockTokens.bubble.paddingHorizontal,
            paddingVertical: socialBlockTokens.bubble.paddingVertical,
            opacity: disabled ? 0.5 : 1,
          },
          getBorderRadius(),
        ]}
        accessibilityRole="text"
        accessibilityLabel={`Message from ${isOwn ? 'you' : user?.name || 'user'}: ${message}${time ? `, sent ${time}` : ''}`}
      >
        {/* Image attachment */}
        {image && (
          <Image
            source={image}
            style={[
              styles.image,
              { borderRadius: radius.md, marginBottom: spacing[2] },
            ]}
            resizeMode="cover"
          />
        )}

        {/* Message text */}
        <Text
          style={[
            {
              fontSize: socialBlockTokens.typography.contentFontSize,
              lineHeight: 20,
              color: textColor,
            },
          ]}
        >
          {message}
        </Text>

        {/* Time and status */}
        <View style={[styles.meta, { marginTop: spacing[1] }]}>
          {time && (
            <Text
              style={[
                {
                  fontSize: socialBlockTokens.typography.timeFontSize,
                  color: timeColor,
                },
              ]}
            >
              {time}
            </Text>
          )}
          {isOwn && renderStatus()}
        </View>
      </Pressable>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  containerOwn: {
    justifyContent: 'flex-end',
  },
  containerOther: {
    justifyContent: 'flex-start',
  },
  bubble: {},
  image: {
    width: 200,
    height: 150,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
