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

  return (
    <View style={styles.container}>
      <Section title="Basic Sheet">
        <Button onPress={() => setBasicOpen(true)}>Open Sheet</Button>
        <Sheet open={basicOpen} onOpenChange={setBasicOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>
                This is a basic sheet that slides up from the bottom.
                Swipe down to dismiss.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.sheetBody}>
              <Button variant="outline" onPress={() => setBasicOpen(false)}>
                Close Sheet
              </Button>
            </View>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Form Sheet">
        <Button variant="secondary" onPress={() => setFormOpen(true)}>
          Edit Profile
        </Button>
        <Sheet open={formOpen} onOpenChange={setFormOpen}>
          <SheetContent height="70%">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here.
              </SheetDescription>
            </SheetHeader>
            <View style={styles.form}>
              <Input label="Name" placeholder="Your name" />
              <Input label="Username" placeholder="@username" />
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

      <Section title="Tall Sheet">
        <Button variant="outline" onPress={() => setTallOpen(true)}>
          Open Tall Sheet (80%)
        </Button>
        <Sheet open={tallOpen} onOpenChange={setTallOpen}>
          <SheetContent height="80%">
            <SheetHeader>
              <SheetTitle>More Content</SheetTitle>
              <SheetDescription>
                This sheet takes 80% of the screen height.
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
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
