import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/input';

export function InputDemo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Input
        label="With Helper Text"
        placeholder="Username"
        helperText="This will be your public display name"
      />

      <Input
        label="With Error"
        placeholder="Email"
        value="invalid-email"
        error="Please enter a valid email address"
      />

      <Input
        label="Disabled"
        placeholder="Can't edit this"
        value="Read only value"
        editable={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
});
