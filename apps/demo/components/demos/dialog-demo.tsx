import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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

export function DialogDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  form: {
    gap: 12,
    marginTop: 16,
  },
});
