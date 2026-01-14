import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CardDemo() {
  return (
    <View style={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a description of the card content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text style={styles.text}>
            Cards are used to group and display content in a clearly way.
          </Text>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" onPress={() => {}}>Cancel</Button>
          <Button size="sm" onPress={() => {}}>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Text style={styles.text}>
            Push notifications are currently enabled.
          </Text>
        </CardContent>
      </Card>

      <Card style={styles.simpleCard}>
        <Text style={styles.simpleCardText}>Simple card without header/footer</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  text: { fontSize: 14, color: '#525252', lineHeight: 20 },
  simpleCard: { padding: 16 },
  simpleCardText: { fontSize: 14, color: '#525252' },
});
