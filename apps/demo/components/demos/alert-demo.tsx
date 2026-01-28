import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Alert } from '@/components/ui/alert';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function AlertDemo() {
  const { colors, fontSize } = useTheme();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  const isVisible = (id: string) => !dismissedAlerts.includes(id);

  return (
    <View style={styles.container}>
      <Section title="Variants">
        <Alert>
          This is a default informational alert with some helpful content.
        </Alert>
        <Alert variant="info">
          Info alert: Here's some information you might find useful.
        </Alert>
        <Alert variant="success">
          Success! Your changes have been saved successfully.
        </Alert>
        <Alert variant="warning">
          Warning: Please review your input before proceeding.
        </Alert>
        <Alert variant="destructive">
          Error: Something went wrong. Please try again.
        </Alert>
      </Section>

      <Section title="With Titles">
        <Alert variant="info" title="Did you know?">
          You can customize the appearance of alerts using the variant prop.
        </Alert>
        <Alert variant="success" title="Payment successful">
          Your order #12345 has been confirmed and is being processed.
        </Alert>
        <Alert variant="warning" title="Action required">
          Your session will expire in 5 minutes. Save your work.
        </Alert>
        <Alert variant="destructive" title="Connection lost">
          Unable to connect to the server. Check your internet connection.
        </Alert>
      </Section>

      <Section title="Sizes">
        <Alert size="sm" title="Small Alert">
          This is a small alert with compact spacing.
        </Alert>
        <Alert size="md" title="Medium Alert">
          This is the default medium-sized alert.
        </Alert>
        <Alert size="lg" title="Large Alert">
          This is a large alert with more generous spacing.
        </Alert>
      </Section>

      <Section title="Dismissible">
        {isVisible('dismiss-1') && (
          <Alert
            variant="info"
            title="Dismissible Alert"
            onClose={() => handleDismiss('dismiss-1')}
          >
            Click the X to dismiss this alert.
          </Alert>
        )}
        {isVisible('dismiss-2') && (
          <Alert
            variant="warning"
            onClose={() => handleDismiss('dismiss-2')}
          >
            This is a dismissible warning without a title.
          </Alert>
        )}
        {!isVisible('dismiss-1') && !isVisible('dismiss-2') && (
          <Text style={{ color: colors.foregroundMuted, fontStyle: 'italic', textAlign: 'center', padding: 16 }}>All alerts dismissed!</Text>
        )}
      </Section>

      <Section title="Without Icon">
        <Alert hideIcon variant="info" title="No Icon">
          This alert has the icon hidden for a cleaner look.
        </Alert>
        <Alert hideIcon variant="success">
          Success message without an icon.
        </Alert>
      </Section>

      <Section title="Long Content">
        <Alert variant="info" title="Terms of Service Update">
          We've updated our Terms of Service. By continuing to use our services,
          you agree to the new terms. Please review the changes carefully as they
          affect your rights and responsibilities. The key changes include updates
          to our privacy policy, data handling procedures, and user agreements.
        </Alert>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
