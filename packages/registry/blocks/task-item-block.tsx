/**
 * TaskItem
 *
 * Todo/task item with checkbox, priority, due date, and actions.
 * Perfect for todo lists, task managers, and productivity apps.
 *
 * @example
 * ```tsx
 * <TaskItem
 *   task={{
 *     id: '1',
 *     title: 'Complete project review',
 *     completed: false,
 *     priority: 'high',
 *     dueDate: '2024-01-20'
 *   }}
 *   onToggle={() => toggleTask(task.id)}
 *   onPress={() => openTaskDetails(task.id)}
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
} from 'react-native';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme, infoBlockTokens } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { SwipeableRow, SwipeAction } from '../ui/swipeable-row';

// ============================================================================
// Icons
// ============================================================================

function CalendarIcon({ size = 14, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EditIcon({ size = 20, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={finalColor} strokeWidth={2}>
      <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FlagIcon({ size = 12, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const finalColor = color ?? colors.foreground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={finalColor} stroke={finalColor} strokeWidth={1}>
      <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  assignee?: {
    name: string;
    avatar?: { uri: string };
  };
}

export interface TaskItemProps {
  /** Task data */
  task: Task;
  /** Called when checkbox is toggled */
  onToggle?: () => void;
  /** Called when task is pressed */
  onPress?: () => void;
  /** Called when edit action is triggered */
  onEdit?: () => void;
  /** Called when delete action is triggered */
  onDelete?: () => void;
  /** Whether swipe actions are enabled */
  swipeable?: boolean;
  /** Container style */
  style?: ViewStyle;
}

// ============================================================================
// Priority Config
// ============================================================================

// Priority colors use semantic tokens - defined in component to access theme
const getPriorityConfig = (colors: any): Record<TaskPriority, { color: string; label: string }> => ({
  low: { color: colors.success, label: 'Low' },
  medium: { color: colors.warning, label: 'Medium' },
  high: { color: colors.warning, label: 'High' },
  urgent: { color: colors.destructive, label: 'Urgent' },
});

// ============================================================================
// Component
// ============================================================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskItem({
  task,
  onToggle,
  onPress,
  onEdit,
  onDelete,
  swipeable = true,
  style,
}: TaskItemProps) {
  const { colors, spacing, radius } = useTheme();
  const tokens = infoBlockTokens.task;

  const scale = useSharedValue(1);

  const handlePress = () => {
    haptic('light');
    onPress?.();
  };

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const PRIORITY_CONFIG = getPriorityConfig(colors);
  const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null;

  // Swipe actions
  const rightActions: SwipeAction[] = [];

  if (onEdit) {
    rightActions.push({
      label: 'Edit',
      color: colors.primary,
      icon: <EditIcon />,
      onPress: onEdit,
    });
  }

  if (onDelete) {
    rightActions.push({
      label: 'Delete',
      color: colors.destructive,
      icon: <TrashIcon />,
      onPress: onDelete,
    });
  }

  const content = (
    <AnimatedPressable
      onPress={onPress ? handlePress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          padding: spacing[3],
          opacity: task.completed ? 0.6 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {/* Checkbox */}
      <View style={{ marginRight: spacing[3] }}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          {/* Priority flag */}
          {priorityConfig && !task.completed && (
            <View style={{ marginRight: spacing[1.5] }}>
              <FlagIcon size={tokens.flagIconSize} color={priorityConfig.color} />
            </View>
          )}

          <Text
            style={[
              styles.title,
              {
                color: colors.foreground,
                textDecorationLine: task.completed ? 'line-through' : 'none',
                fontSize: tokens.titleFontSize,
                fontWeight: tokens.titleFontWeight as any,
                lineHeight: tokens.titleLineHeight,
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>

        {/* Description */}
        {task.description && !task.completed && (
          <Text
            style={[
              styles.description,
              {
                color: colors.foregroundMuted,
                marginTop: spacing[0.5],
                fontSize: tokens.descriptionFontSize,
              },
            ]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        )}

        {/* Meta row */}
        <View style={[styles.metaRow, { marginTop: spacing[1.5], gap: spacing[2] }]}>
          {/* Due date */}
          {task.dueDate && !task.completed && (
            <View style={styles.dueDateRow}>
              <CalendarIcon size={tokens.calendarIconSize} color={isOverdue ? colors.destructive : colors.foregroundMuted} />
              <Text
                style={[
                  styles.dueDate,
                  {
                    color: isOverdue ? colors.destructive : colors.foregroundMuted,
                    marginLeft: spacing[0.5],
                    fontSize: tokens.dueDateFontSize,
                  },
                ]}
              >
                {formatDueDate(task.dueDate)}
              </Text>
            </View>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && !task.completed && (
            <View style={[styles.tags, { gap: spacing[1] }]}>
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Text
                  style={[
                    styles.moreTags,
                    {
                      color: colors.foregroundMuted,
                      fontSize: tokens.moreTagsFontSize,
                    },
                  ]}
                >
                  +{task.tags.length - 2}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );

  if (swipeable && rightActions.length > 0) {
    return (
      <SwipeableRow rightActions={rightActions}>
        {content}
      </SwipeableRow>
    );
  }

  return content;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  description: {},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {},
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreTags: {},
});
