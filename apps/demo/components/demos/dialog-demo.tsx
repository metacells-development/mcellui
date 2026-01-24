import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function DialogDemo() {
  const { colors, spacing } = useTheme();
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [longContentOpen, setLongContentOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Section title="Basic Dialog">
        <Button onPress={() => setBasicOpen(true)}>Open Dialog</Button>
        <Dialog open={basicOpen} onOpenChange={setBasicOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome!</DialogTitle>
              <DialogDescription>
                This is a basic dialog component. Tap outside or press the
                button below to close it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Got it</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Form Dialog">
        <Button variant="secondary" onPress={() => setFormOpen(true)}>
          Add New Item
        </Button>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new item.
              </DialogDescription>
            </DialogHeader>
            <View style={styles.form}>
              <Input label="Title" placeholder="Enter title" />
              <Input label="Description" placeholder="Enter description" />
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onPress={() => setFormOpen(false)}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Long Content">
        <Button variant="outline" onPress={() => setLongContentOpen(true)}>
          Open Long Dialog
        </Button>
        <Dialog open={longContentOpen} onOpenChange={setLongContentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
              <DialogDescription>
                Please read and accept our terms to continue.
              </DialogDescription>
            </DialogHeader>
            <ScrollView style={styles.scrollContent}>
              <Text style={[styles.contentText, { color: colors.foreground }]}>
                This is a dialog with scrollable content to test layout behavior
                when content exceeds the available space.{'\n\n'}
                1. You agree to use this service responsibly and in accordance
                with all applicable laws and regulations.{'\n\n'}
                2. We reserve the right to modify these terms at any time. Your
                continued use of the service constitutes acceptance of changes.{'\n\n'}
                3. All content provided through this service is for informational
                purposes only. We make no warranties about accuracy or completeness.{'\n\n'}
                4. You retain ownership of any content you submit, but grant us
                a license to use, modify, and display it as necessary to provide
                the service.{'\n\n'}
                5. We may terminate or suspend your access at any time for
                violations of these terms.{'\n\n'}
                6. The dialog should handle scrolling smoothly on both iOS and Android.
              </Text>
            </ScrollView>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Decline</Button>
              </DialogClose>
              <Button onPress={() => setLongContentOpen(false)}>Accept</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Keyboard Handling">
        <Button variant="ghost" onPress={() => setKeyboardOpen(true)}>
          Multiple Inputs
        </Button>
        <Dialog open={keyboardOpen} onOpenChange={setKeyboardOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Fill in your details to create a new account.
              </DialogDescription>
            </DialogHeader>
            <View style={styles.multiInputForm}>
              <Input label="Full Name" placeholder="John Doe" />
              <Input label="Email" placeholder="john@example.com" keyboardType="email-address" />
              <Input label="Phone" placeholder="+1 (555) 000-0000" keyboardType="phone-pad" />
              <Input label="Password" placeholder="Enter password" secureTextEntry />
              <Input label="Confirm Password" placeholder="Re-enter password" secureTextEntry />
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onPress={() => setKeyboardOpen(false)}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  form: {
    gap: 12,
    marginTop: 16,
  },
  scrollContent: {
    maxHeight: 300,
    marginTop: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  multiInputForm: {
    gap: 12,
    marginTop: 16,
  },
});
