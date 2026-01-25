/**
 * AccountScreen
 *
 * User account management with profile, preferences, and settings.
 * Perfect for user profile pages and account settings.
 *
 * @example
 * ```tsx
 * <AccountScreen
 *   user={{
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     avatar: { uri: '...' }
 *   }}
 *   onEditProfile={() => navigateToEditProfile()}
 *   onLogout={() => handleLogout()}
 * />
 * ```
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Rect } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { List, ListItem } from '../ui/list';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function UserIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <SvgCircle cx="12" cy="7" r="4" />
    </Svg>
  );
}

function PackageIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HeartIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MapPinIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      <SvgCircle cx="12" cy="10" r="3" />
    </Svg>
  );
}

function CreditCardIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <Path d="M1 10h22" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HelpCircleIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <SvgCircle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LogOutIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SettingsIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <SvgCircle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
      <SvgCircle cx="12" cy="13" r="4" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface AccountUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: ImageSourcePropType;
  memberSince?: string;
  isPremium?: boolean;
}

export interface AccountScreenProps {
  /** User data */
  user: AccountUser;
  /** Order count */
  orderCount?: number;
  /** Wishlist count */
  wishlistCount?: number;
  /** Address count */
  addressCount?: number;
  /** Called when back is pressed */
  onBack?: () => void;
  /** Called when edit profile is pressed */
  onEditProfile?: () => void;
  /** Called when change avatar is pressed */
  onChangeAvatar?: () => void;
  /** Called when orders is pressed */
  onOrders?: () => void;
  /** Called when wishlist is pressed */
  onWishlist?: () => void;
  /** Called when addresses is pressed */
  onAddresses?: () => void;
  /** Called when payment methods is pressed */
  onPaymentMethods?: () => void;
  /** Called when notifications is pressed */
  onNotifications?: () => void;
  /** Called when settings is pressed */
  onSettings?: () => void;
  /** Called when help is pressed */
  onHelp?: () => void;
  /** Called when logout is pressed */
  onLogout?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function AccountScreen({
  user,
  orderCount,
  wishlistCount,
  addressCount,
  onBack,
  onEditProfile,
  onChangeAvatar,
  onOrders,
  onWishlist,
  onAddresses,
  onPaymentMethods,
  onNotifications,
  onSettings,
  onHelp,
  onLogout,
}: AccountScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
          <Text style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: colors.foreground,
          }}>Account</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { padding: spacing[4] }]}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={user.avatar}
              fallback={user.name.charAt(0)}
              size="xl"
            />
            {onChangeAvatar && (
              <Pressable
                onPress={() => {
                  haptic('light');
                  onChangeAvatar();
                }}
                style={[
                  styles.cameraButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: radius.full,
                    borderWidth: 2,
                    borderColor: colors.background,
                  },
                ]}
              >
                <CameraIcon size={14} color={colors.primaryForeground} />
              </Pressable>
            )}
          </View>

          <View style={[styles.profileInfo, { marginTop: spacing[3] }]}>
            <View style={styles.nameRow}>
              <Text style={{
                fontSize: fontSize.xl,
                fontWeight: fontWeight.bold,
                color: colors.foreground,
              }}>
                {user.name}
              </Text>
              {user.isPremium && (
                <Badge variant="default" size="sm" style={{ marginLeft: spacing[2] }}>
                  Premium
                </Badge>
              )}
            </View>
            <Text style={{
              fontSize: fontSize.base,
              color: colors.foregroundMuted,
              marginTop: 2,
            }}>
              {user.email}
            </Text>
            {user.memberSince && (
              <Text style={{
                fontSize: fontSize.xs,
                color: colors.foregroundMuted,
                marginTop: spacing[1],
              }}>
                Member since {user.memberSince}
              </Text>
            )}
          </View>

          {onEditProfile && (
            <Button
              variant="outline"
              size="sm"
              onPress={onEditProfile}
              style={{ marginTop: spacing[3] }}
            >
              Edit Profile
            </Button>
          )}
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsRow, { paddingHorizontal: spacing[4], gap: spacing[3], marginBottom: spacing[4] }]}>
          <Pressable
            onPress={onOrders}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.lg,
                padding: spacing[3],
                flex: 1,
              },
            ]}
          >
            <PackageIcon size={24} color={colors.primary} />
            <Text style={{
              fontSize: fontSize.xl,
              fontWeight: fontWeight.bold,
              color: colors.foreground,
              marginTop: 4,
            }}>
              {orderCount ?? 0}
            </Text>
            <Text style={{
              fontSize: fontSize.xs,
              color: colors.foregroundMuted,
              marginTop: 2,
            }}>
              Orders
            </Text>
          </Pressable>

          <Pressable
            onPress={onWishlist}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.lg,
                padding: spacing[3],
                flex: 1,
              },
            ]}
          >
            <HeartIcon size={24} color={colors.destructive} />
            <Text style={{
              fontSize: fontSize.xl,
              fontWeight: fontWeight.bold,
              color: colors.foreground,
              marginTop: 4,
            }}>
              {wishlistCount ?? 0}
            </Text>
            <Text style={{
              fontSize: fontSize.xs,
              color: colors.foregroundMuted,
              marginTop: 2,
            }}>
              Wishlist
            </Text>
          </Pressable>

          <Pressable
            onPress={onAddresses}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.secondary,
                borderRadius: radius.lg,
                padding: spacing[3],
                flex: 1,
              },
            ]}
          >
            <MapPinIcon size={24} color={colors.success} />
            <Text style={{
              fontSize: fontSize.xl,
              fontWeight: fontWeight.bold,
              color: colors.foreground,
              marginTop: 4,
            }}>
              {addressCount ?? 0}
            </Text>
            <Text style={{
              fontSize: fontSize.xs,
              color: colors.foregroundMuted,
              marginTop: 2,
            }}>
              Addresses
            </Text>
          </Pressable>
        </View>

        {/* Menu Items */}
        <List>
          {onOrders && (
            <ListItem
              title="My Orders"
              left={<PackageIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onOrders}
            />
          )}
          {onWishlist && (
            <ListItem
              title="Wishlist"
              left={<HeartIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onWishlist}
            />
          )}
          {onAddresses && (
            <ListItem
              title="Addresses"
              left={<MapPinIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onAddresses}
            />
          )}
          {onPaymentMethods && (
            <ListItem
              title="Payment Methods"
              left={<CreditCardIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onPaymentMethods}
            />
          )}
        </List>

        <Separator style={{ marginVertical: spacing[2] }} />

        <List>
          {onNotifications && (
            <ListItem
              title="Notifications"
              left={<BellIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onNotifications}
            />
          )}
          {onSettings && (
            <ListItem
              title="Settings"
              left={<SettingsIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onSettings}
            />
          )}
          {onHelp && (
            <ListItem
              title="Help & Support"
              left={<HelpCircleIcon size={20} color={colors.foreground} />}
              showChevron
              onPress={onHelp}
            />
          )}
        </List>

        {onLogout && (
          <>
            <Separator style={{ marginVertical: spacing[2] }} />
            <List>
              <ListItem
                title="Log Out"
                left={<LogOutIcon size={20} color={colors.destructive} />}
                titleStyle={{ color: colors.destructive }}
                onPress={onLogout}
              />
            </List>
          </>
        )}

        <View style={{ height: insets.bottom + spacing[4] }} />
      </ScrollView>
    </View>
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
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCard: {
    alignItems: 'center',
  },
});
