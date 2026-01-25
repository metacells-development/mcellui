import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@metacells/mcellui-core';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Section } from './section';

export function TabsDemo() {
  const { colors, spacing, fontSize, fontWeight } = useTheme();
  const [controlled, setControlled] = useState('account');

  const contentTitleStyle: TextStyle = {
    fontSize: fontSize.md, // 16px
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing[1], // 4px
  };

  const contentTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
  };

  const descriptionStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    marginBottom: spacing[3], // 12px
  };

  return (
    <View style={styles.container}>
      <Section title="Pill Variant (Default)">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <Text style={contentTitleStyle}>Account Settings</Text>
              <Text style={contentTextStyle}>
                Manage your account settings and preferences.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <Text style={contentTitleStyle}>Password Settings</Text>
              <Text style={contentTextStyle}>
                Change your password and security settings.
              </Text>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Three Tabs">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <Text style={contentTextStyle}>Overview content goes here.</Text>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <Text style={contentTextStyle}>Analytics data and charts.</Text>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <Text style={contentTextStyle}>Generated reports list.</Text>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Underline Variant">
        <Text style={descriptionStyle}>
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
              <Text style={contentTextStyle}>User posts and activity feed.</Text>
            </Card>
          </TabsContent>
          <TabsContent value="media">
            <Card>
              <Text style={contentTextStyle}>Photos and videos gallery.</Text>
            </Card>
          </TabsContent>
          <TabsContent value="likes">
            <Card>
              <Text style={contentTextStyle}>Liked posts and content.</Text>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Controlled Tabs">
        <Text style={descriptionStyle}>Current: {controlled}</Text>
        <Tabs value={controlled} onValueChange={setControlled}>
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <Text style={contentTextStyle}>Your account information.</Text>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card>
              <Text style={contentTextStyle}>
                Billing and subscription details.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="team">
            <Card>
              <Text style={contentTextStyle}>Team members and roles.</Text>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="With Disabled Tab">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              Disabled
            </TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card>
              <Text style={contentTextStyle}>
                This tab is active and selectable.
              </Text>
            </Card>
          </TabsContent>
          <TabsContent value="other">
            <Card>
              <Text style={contentTextStyle}>Another tab content.</Text>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Many Tabs (Scrollable)">
        <Text style={descriptionStyle}>Tab list scrolls horizontally when overflow</Text>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">First</TabsTrigger>
            <TabsTrigger value="tab2">Second</TabsTrigger>
            <TabsTrigger value="tab3">Third</TabsTrigger>
            <TabsTrigger value="tab4">Fourth</TabsTrigger>
            <TabsTrigger value="tab5">Fifth</TabsTrigger>
            <TabsTrigger value="tab6">Sixth</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card>
              <Text style={contentTextStyle}>First tab content</Text>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card>
              <Text style={contentTextStyle}>Second tab content</Text>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card>
              <Text style={contentTextStyle}>Third tab content</Text>
            </Card>
          </TabsContent>
          <TabsContent value="tab4">
            <Card>
              <Text style={contentTextStyle}>Fourth tab content</Text>
            </Card>
          </TabsContent>
          <TabsContent value="tab5">
            <Card>
              <Text style={contentTextStyle}>Fifth tab content</Text>
            </Card>
          </TabsContent>
          <TabsContent value="tab6">
            <Card>
              <Text style={contentTextStyle}>Sixth tab content</Text>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24, // spacing[6]
  },
});
