import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export function TabsDemo() {
  const { colors, spacing } = useTheme();
  const [controlled, setControlled] = useState('account');

  return (
    <View style={styles.container}>
      {/* Pill Variant (Default) */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Pill Variant (Default)
        </Text>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <Text style={[styles.contentTitle, { color: colors.foreground }]}>
                Account Settings
              </Text>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Manage your account settings and preferences.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <Text style={[styles.contentTitle, { color: colors.foreground }]}>
                Password Settings
              </Text>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Change your password and security settings.
              </Text>
            </Card>
          </TabsContent>
        </Tabs>
      </View>

      {/* Three Tabs */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Three Tabs
        </Text>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Overview content goes here.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Analytics data and charts.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Generated reports list.
              </Text>
            </Card>
          </TabsContent>
        </Tabs>
      </View>

      {/* Underline Variant */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Underline Variant
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.foregroundMuted, marginBottom: spacing[3] }]}>
          Perfect for profile pages and content tabs
        </Text>
        <Tabs defaultValue="posts">
          <TabsList variant="underline">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                User posts and activity feed.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="media">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Photos and videos gallery.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="likes">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Liked posts and content.
              </Text>
            </Card>
          </TabsContent>
        </Tabs>
      </View>

      {/* Controlled Tabs */}
      <View style={[styles.section, { marginBottom: spacing[6] }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          Controlled Tabs
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.foregroundMuted, marginBottom: spacing[3] }]}>
          Current: {controlled}
        </Text>
        <Tabs value={controlled} onValueChange={setControlled}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Your account information.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Billing and subscription details.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="team">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Team members and roles.
              </Text>
            </Card>
          </TabsContent>
        </Tabs>
      </View>

      {/* With Disabled Tab */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3] }]}>
          With Disabled Tab
        </Text>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                This tab is active and selectable.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="other">
            <Card>
              <Text style={[styles.contentText, { color: colors.foregroundMuted }]}>
                Another tab content.
              </Text>
            </Card>
          </TabsContent>
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 14,
  },
});
