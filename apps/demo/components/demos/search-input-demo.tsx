import React, { useState } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { SearchInput } from '@/components/ui/search-input';
import { Section } from './section';
import { useTheme } from '@metacells/mcellui-core';

export function SearchInputDemo() {
  const { colors, spacing, fontSize } = useTheme();
  const [query, setQuery] = useState('');
  const [controlledValue, setControlledValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    // Simulate search loading
    if (text.length > 0) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    } else {
      setIsLoading(false);
    }
  };

  const handleSubmit = (text: string) => {
    console.log('Search submitted:', text);
  };

  const containerStyle: ViewStyle = {
    gap: spacing[6], // 24px
  };

  const resultTextStyle: TextStyle = {
    fontSize: fontSize.sm, // 14px
    color: colors.foregroundMuted,
    marginTop: spacing[2], // 8px
  };

  const labelStyle: TextStyle = {
    fontSize: fontSize.xs, // 12px
    fontWeight: '500',
    color: colors.foregroundMuted,
    marginBottom: spacing[2], // 8px
  };

  return (
    <View style={containerStyle}>
      <Section title="Basic">
        <SearchInput
          placeholder="Search..."
        />
      </Section>

      <Section title="States">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Default</Text>
            <SearchInput
              placeholder="Search..."
            />
          </View>
          <View>
            <Text style={labelStyle}>Focused (type to see)</Text>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              placeholder="Start typing..."
            />
            {query.length > 0 && (
              <Text style={resultTextStyle}>
                Searching for: "{query}"
              </Text>
            )}
          </View>
          <View>
            <Text style={labelStyle}>Loading</Text>
            <SearchInput
              value={query}
              onChangeText={handleSearch}
              loading={isLoading}
              placeholder="Search with loading..."
            />
          </View>
          <View>
            <Text style={labelStyle}>With Text (shows clear button)</Text>
            <SearchInput
              value="Search term"
              onChangeText={() => {}}
              showClearButton
              placeholder="Search..."
            />
          </View>
        </View>
      </Section>

      <Section title="Features">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Auto Focus</Text>
            <SearchInput
              placeholder="Auto-focused input"
              autoFocus={false}
            />
          </View>
          <View>
            <Text style={labelStyle}>Custom Placeholder</Text>
            <SearchInput
              placeholder="Search for products, brands, or categories..."
            />
          </View>
          <View>
            <Text style={labelStyle}>Submit Handler</Text>
            <SearchInput
              placeholder="Type and press enter"
              onSubmit={handleSubmit}
            />
          </View>
          <View>
            <Text style={labelStyle}>Without Clear Button</Text>
            <SearchInput
              value="Cannot clear this"
              showClearButton={false}
              placeholder="No clear button"
            />
          </View>
        </View>
      </Section>

      <Section title="Controlled vs Uncontrolled">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Controlled</Text>
            <SearchInput
              value={controlledValue}
              onChangeText={setControlledValue}
              placeholder="Controlled input"
            />
            <Text style={resultTextStyle}>
              Value: {controlledValue || '(empty)'}
            </Text>
          </View>
          <View>
            <Text style={labelStyle}>Uncontrolled</Text>
            <SearchInput
              placeholder="Uncontrolled input"
              onChangeText={(text) => console.log('Changed:', text)}
            />
          </View>
        </View>
      </Section>

      <Section title="Use Cases">
        <View style={{ gap: spacing[4] }}>
          <View>
            <Text style={labelStyle}>Search Header</Text>
            <View
              style={{
                marginHorizontal: -spacing[4],
                backgroundColor: colors.card,
                padding: spacing[4],
              }}
            >
              <SearchInput
                value={query}
                onChangeText={handleSearch}
                loading={isLoading}
                placeholder="Search messages, people, or groups..."
              />
            </View>
          </View>
          <View>
            <Text style={labelStyle}>Filter List</Text>
            <SearchInput
              placeholder="Filter items..."
              onChangeText={(text) => {
                console.log('Filtering by:', text);
              }}
            />
            <Text style={resultTextStyle}>
              Use this to filter a list of items in real-time
            </Text>
          </View>
        </View>
      </Section>
    </View>
  );
}
