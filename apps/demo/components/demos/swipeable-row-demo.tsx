import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { SwipeableRow, SwipeAction } from '@/components/ui/swipeable-row';

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
  {
    id: '4',
    sender: 'App Store Connect',
    subject: 'App Status Update',
    preview: 'Your app has been approved and is now...',
    isRead: true,
  },
];

export function SwipeableRowDemo() {
  const { colors, spacing, radius } = useTheme();
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

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.foreground }]}>
        Swipe left or right on items
      </Text>
      <Text style={[styles.hint, { color: colors.foregroundMuted }]}>
        Full swipe triggers first action
      </Text>

      <ScrollView
        style={[
          styles.list,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
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
              <View
                style={[
                  styles.emailItem,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.emailHeader}>
                  <View style={styles.senderRow}>
                    {!email.isRead && (
                      <View
                        style={[
                          styles.unreadDot,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.sender,
                        {
                          color: colors.foreground,
                          fontWeight: email.isRead ? '400' : '600',
                        },
                      ]}
                    >
                      {email.sender}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.subject,
                    {
                      color: colors.foreground,
                      fontWeight: email.isRead ? '400' : '500',
                    },
                  ]}
                >
                  {email.subject}
                </Text>
                <Text
                  style={[styles.preview, { color: colors.foregroundMuted }]}
                  numberOfLines={1}
                >
                  {email.preview}
                </Text>
              </View>
            </SwipeableRow>
          );
        })}

        {emails.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ color: colors.foregroundMuted }}>
              All emails cleared! Pull down to reset.
            </Text>
          </View>
        )}
      </ScrollView>

      {emails.length === 0 && (
        <Text
          style={[styles.resetHint, { color: colors.primary }]}
          onPress={() => setEmails(initialEmails)}
        >
          Tap to reset demo
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    marginBottom: 12,
  },
  list: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  emailItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sender: {
    fontSize: 15,
  },
  subject: {
    fontSize: 14,
    marginBottom: 4,
  },
  preview: {
    fontSize: 13,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  resetHint: {
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
});
