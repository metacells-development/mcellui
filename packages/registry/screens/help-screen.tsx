/**
 * HelpScreen
 *
 * FAQ and support screen with searchable help topics and contact options.
 * Perfect for help centers, FAQs, and customer support.
 *
 * @example
 * ```tsx
 * <HelpScreen
 *   faqs={faqItems}
 *   onContactSupport={() => openContactForm()}
 *   onBack={() => navigation.goBack()}
 * />
 * ```
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { IconButton } from '../ui/icon-button';
import { SearchInput } from '../ui/search-input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { Separator } from '../ui/separator';
import { Card } from '../ui/card';

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MessageCircleIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MailIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PhoneIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BookOpenIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ExternalLinkIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon({ size = 48, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <SvgCircle cx="11" cy="11" r="8" />
      <Path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactOption {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  href?: string;
}

export interface HelpScreenProps {
  /** FAQ items */
  faqs: FAQItem[];
  /** FAQ categories to filter by */
  categories?: string[];
  /** Contact options */
  contactOptions?: ContactOption[];
  /** Support email */
  supportEmail?: string;
  /** Support phone */
  supportPhone?: string;
  /** Documentation URL */
  docsUrl?: string;
  /** Called when back is pressed */
  onBack?: () => void;
  /** Called when contact support is pressed */
  onContactSupport?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function HelpScreen({
  faqs,
  categories,
  contactOptions,
  supportEmail,
  supportPhone,
  docsUrl,
  onBack,
  onContactSupport,
}: HelpScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight, lineHeight } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from FAQs
  const uniqueCategories = useMemo(() => {
    if (categories) return categories;
    const cats = new Set(faqs.map((f) => f.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [faqs, categories]);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    let result = faqs;

    if (selectedCategory) {
      result = result.filter((f) => f.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(query) ||
          f.answer.toLowerCase().includes(query)
      );
    }

    return result;
  }, [faqs, searchQuery, selectedCategory]);

  // Default contact options
  const defaultContactOptions: ContactOption[] = [
    ...(onContactSupport
      ? [
          {
            id: 'chat',
            label: 'Live Chat',
            description: 'Chat with our support team',
            icon: <MessageCircleIcon size={24} color={colors.primary} />,
            onPress: onContactSupport,
          },
        ]
      : []),
    ...(supportEmail
      ? [
          {
            id: 'email',
            label: 'Email Support',
            description: supportEmail,
            icon: <MailIcon size={24} color={colors.primary} />,
            href: `mailto:${supportEmail}`,
          },
        ]
      : []),
    ...(supportPhone
      ? [
          {
            id: 'phone',
            label: 'Phone Support',
            description: supportPhone,
            icon: <PhoneIcon size={24} color={colors.primary} />,
            href: `tel:${supportPhone}`,
          },
        ]
      : []),
    ...(docsUrl
      ? [
          {
            id: 'docs',
            label: 'Documentation',
            description: 'Read our guides',
            icon: <BookOpenIcon size={24} color={colors.primary} />,
            href: docsUrl,
          },
        ]
      : []),
  ];

  const displayContactOptions = contactOptions ?? defaultContactOptions;

  const handleContactPress = (option: ContactOption) => {
    haptic('light');
    if (option.onPress) {
      option.onPress();
    } else if (option.href) {
      Linking.openURL(option.href);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          {onBack && <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={onBack} />}
          <Text style={[styles.headerTitle, { color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
            Help & Support
          </Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4] }}
      >
        {/* Search */}
        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
          <SearchInput
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        {uniqueCategories.length > 0 && !searchQuery && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[3], gap: spacing[2] }}
          >
            <Pressable
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: !selectedCategory ? colors.primary : colors.secondary,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1.5],
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: !selectedCategory ? colors.primaryForeground : colors.foreground, fontSize: fontSize.xs, fontWeight: fontWeight.medium },
                ]}
              >
                All
              </Text>
            </Pressable>
            {uniqueCategories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === category ? colors.primary : colors.secondary,
                    borderRadius: radius.full,
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[1.5],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: selectedCategory === category ? colors.primaryForeground : colors.foreground, fontSize: fontSize.xs, fontWeight: fontWeight.medium },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* FAQs */}
        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[4] }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
            Frequently Asked Questions
          </Text>

          {filteredFaqs.length === 0 ? (
            <View style={[styles.emptyState, { padding: spacing[6] }]}>
              <SearchIcon size={48} color={colors.foregroundMuted} />
              <Text style={[styles.emptyTitle, { color: colors.foreground, marginTop: spacing[3], fontSize: fontSize.md, fontWeight: fontWeight.semibold }]}>
                No results found
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.foregroundMuted, marginTop: spacing[1], fontSize: fontSize.sm }]}>
                Try searching with different keywords
              </Text>
            </View>
          ) : (
            <Accordion type="single">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>
                    <Text style={[styles.faqQuestion, { color: colors.foreground, fontSize: fontSize.base, fontWeight: fontWeight.medium }]}>
                      {faq.question}
                    </Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text style={[styles.faqAnswer, { color: colors.foregroundMuted, fontSize: fontSize.sm, lineHeight: lineHeight.relaxed }]}>
                      {faq.answer}
                    </Text>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </View>

        {/* Contact Options */}
        {displayContactOptions.length > 0 && (
          <>
            <Separator style={{ marginVertical: spacing[4] }} />

            <View style={{ paddingHorizontal: spacing[4] }}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: spacing[3], fontSize: fontSize.lg, fontWeight: fontWeight.semibold }]}>
                Contact Us
              </Text>

              <View style={{ gap: spacing[3] }}>
                {displayContactOptions.map((option) => (
                  <Card
                    key={option.id}
                    pressable
                    onPress={() => handleContactPress(option)}
                  >
                    <View style={[styles.contactOption, { padding: spacing[4] }]}>
                      <View style={[styles.contactIcon, { marginRight: spacing[3] }]}>
                        {option.icon}
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { color: colors.foreground, fontSize: fontSize.base, fontWeight: fontWeight.semibold }]}>
                          {option.label}
                        </Text>
                        {option.description && (
                          <Text style={[styles.contactDescription, { color: colors.foregroundMuted, fontSize: fontSize.xs }]}>
                            {option.description}
                          </Text>
                        )}
                      </View>
                      {option.href && (
                        <ExternalLinkIcon size={16} color={colors.foregroundMuted} />
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {},
  sectionTitle: {},
  categoryChip: {},
  categoryText: {},
  faqQuestion: {
    flex: 1,
  },
  faqAnswer: {},
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {},
  emptyDescription: {
    textAlign: 'center',
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {},
  contactInfo: {
    flex: 1,
  },
  contactLabel: {},
  contactDescription: {
    marginTop: 2,
  },
});
