/**
 * EventCard
 *
 * Calendar event display with date, time, location, and attendees.
 * Perfect for calendars, event apps, and scheduling interfaces.
 *
 * @example
 * ```tsx
 * <EventCard
 *   event={{
 *     id: '1',
 *     title: 'Team Meeting',
 *     startTime: '2024-01-20T10:00:00',
 *     endTime: '2024-01-20T11:00:00',
 *     location: 'Conference Room A',
 *     attendees: [{ name: 'John', avatar: { uri: '...' } }]
 *   }}
 *   onPress={() => openEventDetails(event.id)}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useTheme, cardBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { AvatarStack } from '../ui/avatar-stack';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

// ============================================================================
// Icons
// ============================================================================

function ClockIcon({ size = 14, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <SvgCircle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MapPinIcon({ size = 14, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      <SvgCircle cx="12" cy="10" r="3" />
    </Svg>
  );
}

function VideoIcon({ size = 14, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UsersIcon({ size = 14, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type EventType = 'meeting' | 'call' | 'task' | 'reminder' | 'event';

export interface EventAttendee {
  id?: string;
  name: string;
  avatar?: ImageSourcePropType;
  status?: 'accepted' | 'declined' | 'pending';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay?: boolean;
  location?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  type?: EventType;
  color?: string;
  attendees?: EventAttendee[];
  organizer?: EventAttendee;
}

export interface EventCardProps {
  /** Event data */
  event: CalendarEvent;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'timeline';
  /** Called when event is pressed */
  onPress?: () => void;
  /** Called when join button is pressed (for online events) */
  onJoin?: () => void;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Component
// ============================================================================

export function EventCard({
  event,
  variant = 'default',
  onPress,
  onJoin,
  style,
}: EventCardProps) {
  const { colors, spacing, radius, platformShadow } = useTheme();

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const handleJoin = () => {
    haptic('medium');
    onJoin?.();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  };

  const getTimeRange = () => {
    if (event.allDay) return 'All day';
    if (!event.endTime) return formatTime(event.startTime);
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  };

  const eventColor = event.color ?? colors.primary;
  const dateInfo = formatDate(event.startTime);

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <View style={[styles.timelineContainer, style]}>
        {/* Time column */}
        <View style={[styles.timeColumn, { marginRight: spacing[3] }]}>
          <Text style={[styles.timelineTime, { color: colors.foregroundMuted }]}>
            {formatTime(event.startTime)}
          </Text>
        </View>

        {/* Color bar */}
        <View
          style={[
            styles.colorBar,
            { backgroundColor: eventColor, borderRadius: radius.full },
          ]}
        />

        {/* Content */}
        <Pressable
          onPress={onPress ? handlePress : undefined}
          style={[
            styles.timelineContent,
            { marginLeft: spacing[3], flex: 1 },
          ]}
        >
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {event.title}
          </Text>
          {event.location && (
            <View style={[styles.infoRow, { marginTop: spacing[1] }]}>
              <MapPinIcon size={12} color={colors.foregroundMuted} />
              <Text style={[styles.infoText, { color: colors.foregroundMuted, marginLeft: spacing[1] }]}>
                {event.location}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Pressable
        onPress={onPress ? handlePress : undefined}
        style={[
          styles.compactContainer,
          {
            backgroundColor: colors.background,
            borderLeftWidth: 3,
            borderLeftColor: eventColor,
            paddingVertical: cardBlockTokens.content.paddingVertical,
            paddingHorizontal: cardBlockTokens.content.paddingHorizontal,
            borderRadius: radius.md,
          },
          platformShadow(cardBlockTokens.shadow),
          style,
        ]}
      >
        <Text style={[styles.compactTitle, { color: colors.foreground }]} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={[styles.compactTime, { color: colors.foregroundMuted }]}>
          {getTimeRange()}
        </Text>
      </Pressable>
    );
  }

  // Default variant
  return (
    <Card
      onPress={onPress ? handlePress : undefined}
      style={style}
    >
      <View style={{
        paddingVertical: cardBlockTokens.content.paddingVertical,
        paddingHorizontal: cardBlockTokens.content.paddingHorizontal,
      }}>
        {/* Header with date and status */}
        <View style={[styles.header, { marginBottom: spacing[3] }]}>
          <View
            style={[
              styles.dateBadge,
              {
                backgroundColor: eventColor + '15',
                borderRadius: radius.md,
                padding: spacing[2],
              },
            ]}
          >
            <Text style={[styles.dateDay, { color: eventColor }]}>{dateInfo.day}</Text>
            <Text style={[styles.dateMonth, { color: eventColor }]}>{dateInfo.weekday}</Text>
          </View>

          <View style={styles.headerRight}>
            {event.isOnline && (
              <Badge variant="secondary" size="sm">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <VideoIcon size={10} color={colors.foreground} />
                  <Text style={{ fontSize: 11 }}>Online</Text>
                </View>
              </Badge>
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.foreground, marginBottom: spacing[2] }]}>
          {event.title}
        </Text>

        {/* Description */}
        {event.description && (
          <Text style={[styles.description, { color: colors.foregroundMuted, marginBottom: spacing[3] }]} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Info rows */}
        <View style={[styles.infoSection, { gap: spacing[2] }]}>
          {/* Time */}
          <View style={styles.infoRow}>
            <ClockIcon size={14} color={colors.foregroundMuted} />
            <Text style={[styles.infoText, { color: colors.foregroundMuted, marginLeft: spacing[2] }]}>
              {getTimeRange()}
            </Text>
          </View>

          {/* Location */}
          {event.location && (
            <View style={styles.infoRow}>
              {event.isOnline ? (
                <VideoIcon size={14} color={colors.foregroundMuted} />
              ) : (
                <MapPinIcon size={14} color={colors.foregroundMuted} />
              )}
              <Text style={[styles.infoText, { color: colors.foregroundMuted, marginLeft: spacing[2] }]} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <View style={[styles.attendeesRow, { marginTop: spacing[1] }]}>
              <UsersIcon size={14} color={colors.foregroundMuted} />
              <View style={{ marginLeft: spacing[2] }}>
                <AvatarStack
                  avatars={event.attendees.slice(0, 5).map((a) => ({
                    source: a.avatar,
                    fallback: a.name.charAt(0),
                  }))}
                  size="sm"
                  max={5}
                />
              </View>
              {event.attendees.length > 5 && (
                <Text style={[styles.moreAttendees, { color: colors.foregroundMuted, marginLeft: spacing[1] }]}>
                  +{event.attendees.length - 5} more
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Join button for online events */}
        {event.isOnline && onJoin && (
          <Pressable
            onPress={handleJoin}
            style={[
              styles.joinButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.md,
                paddingVertical: spacing[2],
                marginTop: spacing[3],
              },
            ]}
          >
            <VideoIcon size={16} color={colors.primaryForeground} />
            <Text style={[styles.joinText, { color: colors.primaryForeground, marginLeft: spacing[2] }]}>
              Join Meeting
            </Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerRight: {},
  dateBadge: {
    alignItems: 'center',
    minWidth: 48,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: cardBlockTokens.typography.titleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  description: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    lineHeight: 20,
  },
  infoSection: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: cardBlockTokens.typography.metaFontSize,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreAttendees: {
    fontSize: cardBlockTokens.typography.metaFontSize,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  // Compact variant
  compactContainer: {},
  compactTitle: {
    fontSize: cardBlockTokens.typography.subtitleFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  compactTime: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    marginTop: 2,
  },
  // Timeline variant
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeColumn: {
    width: 50,
  },
  timelineTime: {
    fontSize: cardBlockTokens.typography.metaFontSize,
    fontWeight: cardBlockTokens.typography.titleFontWeight,
  },
  colorBar: {
    width: 3,
    minHeight: 40,
    alignSelf: 'stretch',
  },
  timelineContent: {},
});
