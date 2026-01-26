/**
 * ChatScreen
 *
 * Complete chat/messaging screen with message bubbles, typing indicator,
 * and message input. Ready to connect to your messaging backend.
 *
 * @example
 * ```tsx
 * <ChatScreen
 *   recipient={{ name: 'Sarah Miller', avatar: 'SM', status: 'online' }}
 *   messages={messages}
 *   onSendMessage={(text) => sendMessage(text)}
 *   onBack={() => navigation.goBack()}
 * />
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme, getLineHeight, lineHeight } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';

// ============================================================================
// Types
// ============================================================================

export interface ChatMessage {
  /** Unique message ID */
  id: string;
  /** Message text content */
  text: string;
  /** Whether message is from current user */
  isMe: boolean;
  /** Display time */
  time: string;
  /** Message status (for sent messages) */
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatRecipient {
  /** Recipient name */
  name: string;
  /** Avatar fallback text or image URL */
  avatar?: string;
  /** Online status */
  status?: 'online' | 'offline' | 'typing';
  /** Last seen timestamp */
  lastSeen?: string;
}

export interface ChatScreenProps {
  /** Chat recipient info */
  recipient: ChatRecipient;
  /** List of messages */
  messages?: ChatMessage[];
  /** Called when user sends a message */
  onSendMessage?: (text: string) => void;
  /** Called when back button is pressed */
  onBack?: () => void;
  /** Called when recipient header is pressed */
  onRecipientPress?: () => void;
  /** Show typing indicator */
  isTyping?: boolean;
  /** Placeholder text for input */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
}

// ============================================================================
// Icons
// ============================================================================

function BackIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SendIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoreIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="12" cy="12" r="1.5" />
      <Circle cx="19" cy="12" r="1.5" />
      <Circle cx="5" cy="12" r="1.5" />
    </Svg>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

function TypingIndicator({ color }: { color: string }) {
  return (
    <View style={styles.typingContainer}>
      <View style={[styles.typingDot, { backgroundColor: color }]} />
      <View style={[styles.typingDot, { backgroundColor: color, opacity: 0.7 }]} />
      <View style={[styles.typingDot, { backgroundColor: color, opacity: 0.4 }]} />
    </View>
  );
}

function MessageBubble({
  message,
  colors,
  radius,
  fontSize,
  lineHeight,
}: {
  message: ChatMessage;
  colors: any;
  radius: any;
  fontSize: any;
  lineHeight: any;
}) {
  const bubbleStyle = message.isMe
    ? {
        backgroundColor: colors.primary,
        borderBottomRightRadius: radius.sm,
        borderBottomLeftRadius: radius.xl,
      }
    : {
        backgroundColor: colors.card,
        borderBottomRightRadius: radius.xl,
        borderBottomLeftRadius: radius.sm,
      };

  const textColor = message.isMe ? colors.primaryForeground : colors.foreground;

  return (
    <View
      style={[
        styles.messageWrapper,
        { alignSelf: message.isMe ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          {
            borderRadius: radius.xl,
            ...bubbleStyle,
          },
        ]}
      >
        <Text
          style={{
            color: textColor,
            fontSize: fontSize.base,
            lineHeight: getLineHeight(fontSize.base, lineHeight.normal),
          }}
        >
          {message.text}
        </Text>
      </View>
      <View
        style={[
          styles.messageFooter,
          { alignSelf: message.isMe ? 'flex-end' : 'flex-start' },
        ]}
      >
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>
          {message.time}
        </Text>
        {message.isMe && message.status && (
          <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs }}>
            {message.status === 'read' ? ' ✓✓' : message.status === 'delivered' ? ' ✓✓' : ' ✓'}
          </Text>
        )}
      </View>
    </View>
  );
}

// ============================================================================
// Default Data
// ============================================================================

const DEFAULT_MESSAGES: ChatMessage[] = [
  { id: '1', text: 'Hey! How are you doing?', isMe: false, time: '10:30 AM' },
  { id: '2', text: "I'm good, thanks! Just working on a new project.", isMe: true, time: '10:32 AM', status: 'read' },
  { id: '3', text: 'Oh nice! What kind of project?', isMe: false, time: '10:33 AM' },
  { id: '4', text: "It's a mobile app using React Native. Really enjoying it so far!", isMe: true, time: '10:35 AM', status: 'read' },
  { id: '5', text: "That sounds awesome! I'd love to see it when it's done.", isMe: false, time: '10:36 AM' },
  { id: '6', text: "Sure! I'll share it with you soon.", isMe: true, time: '10:37 AM', status: 'delivered' },
];

// ============================================================================
// Component
// ============================================================================

export function ChatScreen({
  recipient,
  messages = DEFAULT_MESSAGES,
  onSendMessage,
  onBack,
  onRecipientPress,
  isTyping = false,
  placeholder = 'Type a message...',
  loading = false,
}: ChatScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight, lineHeight } = useTheme();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length, isTyping]);

  const handleSend = () => {
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const getStatusText = () => {
    if (recipient.status === 'online') return 'Online';
    if (recipient.status === 'typing') return 'Typing...';
    if (recipient.lastSeen) return `Last seen ${recipient.lastSeen}`;
    return 'Offline';
  };

  const getStatusColor = () => {
    if (recipient.status === 'online') return colors.success;
    if (recipient.status === 'typing') return colors.primary;
    return colors.foregroundMuted;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing[2],
            paddingBottom: spacing[3],
            paddingHorizontal: spacing[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
        ]}
      >
        {onBack && (
          <Pressable
            onPress={onBack}
            style={[styles.backButton, { marginRight: spacing[3] }]}
            hitSlop={8}
          >
            <BackIcon size={24} color={colors.foreground} />
          </Pressable>
        )}

        <Pressable
          onPress={onRecipientPress}
          style={styles.recipientInfo}
          disabled={!onRecipientPress}
        >
          <Avatar fallback={recipient.avatar || recipient.name.substring(0, 2)} size="sm" />
          <View style={{ marginLeft: spacing[3] }}>
            <Text
              style={{
                color: colors.foreground,
                fontSize: fontSize.base,
                fontWeight: fontWeight.semibold,
              }}
            >
              {recipient.name}
            </Text>
            <Text style={{ color: getStatusColor(), fontSize: fontSize.xs }}>
              {getStatusText()}
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.moreButton} hitSlop={8}>
          <MoreIcon size={24} color={colors.foregroundMuted} />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          { padding: spacing[4], gap: spacing[3] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            colors={colors}
            radius={radius}
            fontSize={fontSize}
            lineHeight={lineHeight}
          />
        ))}

        {isTyping && (
          <View style={[styles.typingBubble, { backgroundColor: colors.card, borderRadius: radius.xl }]}>
            <TypingIndicator color={colors.foregroundMuted} />
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View
        style={[
          styles.inputArea,
          {
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            paddingBottom: insets.bottom + spacing[3],
            borderTopWidth: 1,
            borderTopColor: colors.border,
            gap: spacing[3],
          },
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <TextInput
            style={{
              color: colors.foreground,
              fontSize: fontSize.base,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              maxHeight: 80,
            }}
            placeholder={placeholder}
            placeholderTextColor={colors.foregroundMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
        </View>

        <Pressable
          onPress={handleSend}
          disabled={!inputText.trim()}
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim() ? colors.primary : colors.secondary,
              borderRadius: radius.full,
              width: 44,
              height: 44,
            },
          ]}
        >
          <SendIcon
            size={20}
            color={inputText.trim() ? colors.primaryForeground : colors.foregroundMuted}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {},
  recipientInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {},
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
  },
  messageWrapper: {
    maxWidth: '80%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    marginTop: 4,
  },
  typingBubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
