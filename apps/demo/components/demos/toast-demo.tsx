import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Section } from './section';

export function ToastDemo() {
  const { toast, dismissAll } = useToast();

  return (
    <View style={styles.container}>
      <Section title="Variants">
        <View style={styles.buttons}>
          <Button
            variant="outline"
            onPress={() =>
              toast({
                title: 'Default Toast',
                description: 'This is a default toast message.',
              })
            }
          >
            Default
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              toast({
                title: 'Success!',
                description: 'Your changes have been saved.',
                variant: 'success',
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                variant: 'error',
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              toast({
                title: 'Warning',
                description: 'Your session will expire soon.',
                variant: 'warning',
              })
            }
          >
            Warning
          </Button>
        </View>
      </Section>

      <Section title="With Action">
        <Button
          onPress={() =>
            toast({
              title: 'File deleted',
              description: 'The file has been moved to trash.',
              action: {
                label: 'Undo',
                onPress: () => {
                  toast({
                    title: 'Restored',
                    description: 'File has been restored.',
                    variant: 'success',
                  });
                },
              },
            })
          }
        >
          Delete with Undo
        </Button>
      </Section>

      <Section title="Title Only">
        <Button
          variant="secondary"
          onPress={() =>
            toast({
              title: 'Copied to clipboard!',
              variant: 'success',
              duration: 2000,
            })
          }
        >
          Copy Link
        </Button>
      </Section>

      <Section title="Custom Duration">
        <View style={styles.buttons}>
          <Button
            variant="ghost"
            onPress={() =>
              toast({
                title: 'Quick toast (2s)',
                duration: 2000,
              })
            }
          >
            2 seconds
          </Button>
          <Button
            variant="ghost"
            onPress={() =>
              toast({
                title: 'Long toast (8s)',
                description: 'This toast stays visible for 8 seconds.',
                duration: 8000,
              })
            }
          >
            8 seconds
          </Button>
        </View>
      </Section>

      <Section title="Dismiss All">
        <Button variant="destructive" onPress={dismissAll}>
          Dismiss All Toasts
        </Button>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  buttons: { gap: 8 },
});
