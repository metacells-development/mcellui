import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Section } from './section';

export function SheetDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [tallOpen, setTallOpen] = useState(false);
  const [smallOpen, setSmallOpen] = useState(false);
  const [mediumOpen, setMediumOpen] = useState(false);
  const [noHandleOpen, setNoHandleOpen] = useState(false);
  const [customThresholdOpen, setCustomThresholdOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Section title="Different Heights">
        <View style={styles.buttonRow}>
          <Button size="sm" variant="outline" onPress={() => setSmallOpen(true)}>
            Small (25%)
          </Button>
          <Button size="sm" variant="outline" onPress={() => setMediumOpen(true)}>
            Medium (50%)
          </Button>
          <Button size="sm" variant="outline" onPress={() => setTallOpen(true)}>
            Large (75%)
          </Button>
        </View>
        <Sheet open={smallOpen} onOpenChange={setSmallOpen}>
          <SheetContent height="25%">
            <SheetHeader>
              <SheetTitle>Small Sheet</SheetTitle>
              <SheetDescription>
                Compact sheet at 25% screen height.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.sheetBody}>
              <Button variant="outline" onPress={() => setSmallOpen(false)}>
                Close
              </Button>
            </View>
          </SheetContent>
        </Sheet>
        <Sheet open={mediumOpen} onOpenChange={setMediumOpen}>
          <SheetContent height="50%">
            <SheetHeader>
              <SheetTitle>Medium Sheet</SheetTitle>
              <SheetDescription>
                Default sheet at 50% screen height.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.sheetBody}>
              <Button variant="outline" onPress={() => setMediumOpen(false)}>
                Close
              </Button>
            </View>
          </SheetContent>
        </Sheet>
        <Sheet open={tallOpen} onOpenChange={setTallOpen}>
          <SheetContent height="75%">
            <SheetHeader>
              <SheetTitle>Large Sheet</SheetTitle>
              <SheetDescription>
                Tall sheet at 75% screen height.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.tallContent}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={styles.item}>
                  <Button variant="ghost" fullWidth>
                    Item {i + 1}
                  </Button>
                </View>
              ))}
            </View>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Without Handle">
        <Button variant="secondary" onPress={() => setNoHandleOpen(true)}>
          No Drag Handle
        </Button>
        <Sheet open={noHandleOpen} onOpenChange={setNoHandleOpen}>
          <SheetContent showHandle={false}>
            <SheetHeader>
              <SheetTitle>Clean Design</SheetTitle>
              <SheetDescription>
                This sheet has no drag handle for a cleaner appearance.
                Swipe down to dismiss.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.sheetBody}>
              <Button variant="outline" onPress={() => setNoHandleOpen(false)}>
                Close Sheet
              </Button>
            </View>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Custom Gesture Threshold">
        <Button variant="ghost" onPress={() => setCustomThresholdOpen(true)}>
          Easy Dismiss (30%)
        </Button>
        <Sheet open={customThresholdOpen} onOpenChange={setCustomThresholdOpen}>
          <SheetContent closeThreshold={0.3}>
            <SheetHeader>
              <SheetTitle>Custom Threshold</SheetTitle>
              <SheetDescription>
                This sheet closes when you swipe down 30% (default is 50%).
                Try the gesture to feel the difference.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.sheetBody}>
              <Button variant="outline" onPress={() => setCustomThresholdOpen(false)}>
                Close
              </Button>
            </View>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Sheet with Form">
        <Button onPress={() => setFormOpen(true)}>Edit Profile</Button>
        <Sheet open={formOpen} onOpenChange={setFormOpen}>
          <SheetContent height="70%">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Keyboard handling is automatic.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.form}>
              <Input label="Name" placeholder="Your name" />
              <Input label="Username" placeholder="@username" />
              <Input label="Email" placeholder="email@example.com" keyboardType="email-address" />
              <Input label="Bio" placeholder="Tell us about yourself" />
            </View>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onPress={() => setFormOpen(false)}>Save Changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sheetBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    gap: 16,
    paddingTop: 16,
  },
  tallContent: {
    flex: 1,
    paddingTop: 16,
  },
  item: {
    paddingVertical: 4,
  },
});
