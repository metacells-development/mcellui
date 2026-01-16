import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SearchInput } from '@/components/ui/search-input';
import { Section } from './section';
import { useTheme } from '@nativeui/core';

export function SearchInputDemo() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    // Simulate search loading
    if (text.length > 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleSubmit = (text: string) => {
    console.log('Search submitted:', text);
  };

  return (
    <View style={styles.container}>
      <Section title="Basic">
        <SearchInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search..."
        />
        {query.length > 0 && (
          <Text style={[styles.resultText, { color: colors.foregroundMuted }]}>
            Searching for: "{query}"
          </Text>
        )}
      </Section>

      <Section title="With Loading">
        <SearchInput
          value={query}
          onChangeText={handleSearch}
          loading={isLoading}
          placeholder="Search with loading..."
        />
      </Section>

      <Section title="With Submit">
        <SearchInput
          placeholder="Type and press enter"
          onSubmit={handleSubmit}
        />
      </Section>

      <Section title="Without Clear Button">
        <SearchInput
          placeholder="No clear button"
          showClearButton={false}
        />
      </Section>

      <Section title="Auto Focus">
        <SearchInput
          placeholder="This would auto focus"
          autoFocus={false}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  resultText: { fontSize: 14, marginTop: 8 },
});
