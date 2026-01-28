import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { SwipeableRow, SwipeAction } from '@/components/ui/swipeable-row';
import { Section } from './section';

interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  isRead: boolean;
}

const initialEmails: EmailItem[] = [
  {
    id: '1',
    sender: 'GitHub',
    subject: 'New pull request',
    preview: 'Someone opened a new PR in your repo...',
    isRead: false,
  },
  {
    id: '2',
    sender: 'Slack',
    subject: 'New message from team',
    preview: 'Hey, can we schedule a call to discuss...',
    isRead: true,
  },
  {
    id: '3',
    sender: 'Figma',
    subject: 'Design update',
    preview: 'Your design has been updated with new...',
    isRead: false,
  },
];

export function SwipeableRowDemo() {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);

  const handleDelete = (id: string) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
  };

  const handleArchive = (id: string) => {
    Alert.alert('Archived', `Email ${id} has been archived`);
    setEmails((prev) => prev.filter((email) => email.id !== id));
  };

  const handleMarkRead = (id: string) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, isRead: !email.isRead } : email
      )
    );
  };

  const handleFlag = (id: string) => {
    Alert.alert('Flagged', `Email ${id} has been flagged`);
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  };

  const hintStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    color: colors.foregroundMuted,
    marginBottom: spacing[3], // 12px
  };

  const listStyle: ViewStyle = {
    borderRadius: radius.lg, // 12px
    borderWidth: 1,
    backgroundColor: colors.card,
    borderColor: colors.border,
    overflow: 'hidden',
  };

  const emailItemStyle: ViewStyle = {
    padding: spacing[4], // 16px
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const senderTextStyle: TextStyle = {
    fontSize: fontSize.md, // 15px
    color: colors.foreground,
  };

  const subjectTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foreground,
    marginBottom: spacing[1], // 4px
  };

  const previewTextStyle: TextStyle = {
    fontSize: fontSize.xs, // 13px
    color: colors.foregroundMuted,
  };

  const resetHintStyle: TextStyle = {
    textAlign: 'center',
    marginTop: spacing[4], // 16px
    fontWeight: fontWeight.medium,
    color: colors.primary,
    fontSize: fontSize.sm, // 14px
  };

  const emptyStyle: ViewStyle = {
    padding: spacing[10], // 40px
    alignItems: 'center',
  };

  const unreadDotStyle: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  };

  const senderRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2], // 8px
  };

  const simpleItemStyle: ViewStyle = {
    padding: spacing[4], // 16px
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const simpleTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foreground,
  };

  return (
    <View style={[styles.container, { gap: spacing[6] }]}>
      <Section title="Email List Example">
        <Text style={labelStyle}>Swipe left or right on items</Text>
        <Text style={hintStyle}>Full swipe triggers first action</Text>
        <ScrollView style={listStyle}>
          {emails.map((email) => {
            const rightActions: SwipeAction[] = [
              {
                label: 'Archive',
                color: '#3b82f6',
                onPress: () => handleArchive(email.id),
              },
              {
                label: 'Delete',
                color: '#ef4444',
                onPress: () => handleDelete(email.id),
              },
            ];

            const leftActions: SwipeAction[] = [
              {
                label: email.isRead ? 'Unread' : 'Read',
                color: '#10b981',
                onPress: () => handleMarkRead(email.id),
              },
              {
                label: 'Flag',
                color: '#f59e0b',
                onPress: () => handleFlag(email.id),
              },
            ];

            return (
              <SwipeableRow
                key={email.id}
                rightActions={rightActions}
                leftActions={leftActions}
                fullSwipeEnabled={true}
              >
                <View style={emailItemStyle}>
                  <View style={senderRowStyle}>
                    {!email.isRead && <View style={unreadDotStyle} />}
                    <Text
                      style={[
                        senderTextStyle,
                        {
                          fontWeight: email.isRead
                            ? fontWeight.normal
                            : fontWeight.semibold,
                        },
                      ]}
                    >
                      {email.sender}
                    </Text>
                  </View>
                  <Text
                    style={[
                      subjectTextStyle,
                      {
                        fontWeight: email.isRead
                          ? fontWeight.normal
                          : fontWeight.medium,
                      },
                    ]}
                  >
                    {email.subject}
                  </Text>
                  <Text style={previewTextStyle} numberOfLines={1}>
                    {email.preview}
                  </Text>
                </View>
              </SwipeableRow>
            );
          })}
          {emails.length === 0 && (
            <View style={emptyStyle}>
              <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>
                All emails cleared!
              </Text>
            </View>
          )}
        </ScrollView>
        {emails.length === 0 && (
          <Text
            style={resetHintStyle}
            onPress={() => setEmails(initialEmails)}
          >
            Tap to reset demo
          </Text>
        )}
      </Section>

      <Section title="Right Actions Only">
        <Text style={hintStyle}>Swipe left to reveal actions</Text>
        <View style={listStyle}>
          <SwipeableRow
            rightActions={[
              { label: 'Edit', color: '#3b82f6', onPress: () => Alert.alert('Edit') },
              { label: 'Delete', color: '#ef4444', onPress: () => Alert.alert('Delete') },
            ]}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Swipe left to see actions</Text>
            </View>
          </SwipeableRow>
          <SwipeableRow
            rightActions={[
              { label: 'Share', color: '#10b981', onPress: () => Alert.alert('Share') },
            ]}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Single action example</Text>
            </View>
          </SwipeableRow>
        </View>
      </Section>

      <Section title="Left Actions Only">
        <Text style={hintStyle}>Swipe right to reveal actions</Text>
        <View style={listStyle}>
          <SwipeableRow
            leftActions={[
              { label: 'Star', color: '#f59e0b', onPress: () => Alert.alert('Starred') },
              { label: 'Pin', color: '#8b5cf6', onPress: () => Alert.alert('Pinned') },
            ]}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Swipe right to see actions</Text>
            </View>
          </SwipeableRow>
        </View>
      </Section>

      <Section title="Full Swipe Disabled">
        <Text style={hintStyle}>
          Must explicitly tap action buttons (full swipe doesn't trigger)
        </Text>
        <View style={listStyle}>
          <SwipeableRow
            rightActions={[
              { label: 'Archive', color: '#3b82f6', onPress: () => Alert.alert('Archive') },
              { label: 'Delete', color: '#ef4444', onPress: () => Alert.alert('Delete') },
            ]}
            fullSwipeEnabled={false}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Try a full swipe - it won't trigger</Text>
            </View>
          </SwipeableRow>
        </View>
      </Section>

      <Section title="Custom Action Width">
        <Text style={hintStyle}>Actions with wider touch targets</Text>
        <View style={listStyle}>
          <SwipeableRow
            rightActions={[
              { label: 'More', color: '#64748b', onPress: () => Alert.alert('More') },
              { label: 'Delete', color: '#ef4444', onPress: () => Alert.alert('Delete') },
            ]}
            actionWidth={100}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Actions are 100px wide</Text>
            </View>
          </SwipeableRow>
        </View>
      </Section>

      <Section title="With Icons in Actions">
        <Text style={hintStyle}>
          Pass custom action components for icons (via action content prop if supported)
        </Text>
        <View style={listStyle}>
          <SwipeableRow
            rightActions={[
              { label: '📋', color: '#3b82f6', onPress: () => Alert.alert('Copy') },
              { label: '🗑️', color: '#ef4444', onPress: () => Alert.alert('Delete') },
            ]}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Actions with emoji icons</Text>
            </View>
          </SwipeableRow>
          <SwipeableRow
            leftActions={[
              { label: '⭐', color: '#f59e0b', onPress: () => Alert.alert('Star') },
            ]}
            rightActions={[
              { label: '📤', color: '#10b981', onPress: () => Alert.alert('Share') },
            ]}
          >
            <View style={simpleItemStyle}>
              <Text style={simpleTextStyle}>Swipe either direction</Text>
            </View>
          </SwipeableRow>
        </View>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
