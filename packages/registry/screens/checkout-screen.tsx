/**
 * CheckoutScreen
 *
 * Multi-step checkout flow with shipping, payment, and order review.
 * Perfect for e-commerce checkout processes.
 *
 * @example
 * ```tsx
 * <CheckoutScreen
 *   items={cartItems}
 *   total={99.99}
 *   onPlaceOrder={(data) => processOrder(data)}
 *   onBack={() => navigation.goBack()}
 * />
 * ```
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { useTheme } from '@metacells/mcellui-core';
import { haptic } from '@metacells/mcellui-core';

// Import UI primitives
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

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

function CheckIcon({ size = 16, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3}>
      <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CreditCardIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TruckIcon({ size = 20, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon({ size = 14, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export type CheckoutStep = 'shipping' | 'payment' | 'review';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  nameOnCard?: string;
}

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutScreenProps {
  /** Cart items */
  items: CheckoutItem[];
  /** Subtotal amount */
  subtotal: number;
  /** Shipping cost */
  shipping?: number;
  /** Tax amount */
  tax?: number;
  /** Total amount */
  total: number;
  /** Currency symbol */
  currency?: string;
  /** Initial shipping address */
  initialAddress?: Partial<ShippingAddress>;
  /** Called when order is placed */
  onPlaceOrder: (data: { address: ShippingAddress; payment: PaymentMethod }) => void;
  /** Called when back is pressed */
  onBack?: () => void;
}

// ============================================================================
// Step Indicator
// ============================================================================

function StepIndicator({
  steps,
  currentStep,
  colors,
  spacing,
  fontSize,
  fontWeight,
}: {
  steps: { key: CheckoutStep; label: string }[];
  currentStep: CheckoutStep;
  colors: any;
  spacing: any;
  fontSize: any;
  fontWeight: any;
}) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <View style={[stepStyles.container, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={step.key}>
            <View style={stepStyles.step}>
              <View
                style={[
                  stepStyles.circle,
                  {
                    backgroundColor: isCompleted || isCurrent ? colors.primary : colors.secondary,
                    borderColor: isCompleted || isCurrent ? colors.primary : colors.border,
                  },
                ]}
              >
                {isCompleted ? (
                  <CheckIcon size={12} color={colors.primaryForeground} />
                ) : (
                  <Text
                    style={{
                      color: isCurrent ? colors.primaryForeground : colors.foregroundMuted,
                      fontSize: fontSize.xs,
                      fontWeight: fontWeight.semibold,
                    }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={{
                  color: isCurrent ? colors.foreground : colors.foregroundMuted,
                  fontSize: fontSize.xs,
                  fontWeight: isCurrent ? fontWeight.semibold : fontWeight.normal,
                  marginTop: 4,
                }}
              >
                {step.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  stepStyles.connector,
                  { backgroundColor: isCompleted ? colors.primary : colors.border },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    alignItems: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 40,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 16,
  },
});

// ============================================================================
// Component
// ============================================================================

export function CheckoutScreen({
  items,
  subtotal,
  shipping = 0,
  tax = 0,
  total,
  currency = '$',
  initialAddress,
  onPlaceOrder,
  onBack,
}: CheckoutScreenProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: initialAddress?.firstName ?? '',
    lastName: initialAddress?.lastName ?? '',
    email: initialAddress?.email ?? '',
    phone: initialAddress?.phone ?? '',
    address: initialAddress?.address ?? '',
    city: initialAddress?.city ?? '',
    state: initialAddress?.state ?? '',
    zipCode: initialAddress?.zipCode ?? '',
    country: initialAddress?.country ?? '',
  });
  const [paymentType, setPaymentType] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];

  const formatPrice = (value: number) => `${currency}${value.toFixed(2)}`;

  const handleContinue = () => {
    haptic('light');
    if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    } else {
      onPlaceOrder({
        address,
        payment: {
          type: paymentType as any,
          cardNumber,
          expiryDate,
          cvv,
          nameOnCard,
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    } else {
      onBack?.();
    }
  };

  const updateAddress = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const renderShippingStep = () => (
    <View style={{ gap: spacing[4] }}>
      <Text style={{ color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
        Shipping Address
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <Input
            label="First Name"
            placeholder="John"
            value={address.firstName}
            onChangeText={(v) => updateAddress('firstName', v)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Last Name"
            placeholder="Doe"
            value={address.lastName}
            onChangeText={(v) => updateAddress('lastName', v)}
          />
        </View>
      </View>

      <Input
        label="Email"
        placeholder="john@example.com"
        value={address.email}
        onChangeText={(v) => updateAddress('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Phone"
        placeholder="+1 (555) 000-0000"
        value={address.phone}
        onChangeText={(v) => updateAddress('phone', v)}
        keyboardType="phone-pad"
      />

      <Input
        label="Address"
        placeholder="123 Main St"
        value={address.address}
        onChangeText={(v) => updateAddress('address', v)}
      />

      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <Input
            label="City"
            placeholder="New York"
            value={address.city}
            onChangeText={(v) => updateAddress('city', v)}
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <Input
            label="State"
            placeholder="NY"
            value={address.state}
            onChangeText={(v) => updateAddress('state', v)}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <Input
            label="ZIP Code"
            placeholder="10001"
            value={address.zipCode}
            onChangeText={(v) => updateAddress('zipCode', v)}
            keyboardType="number-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Country"
            placeholder="United States"
            value={address.country}
            onChangeText={(v) => updateAddress('country', v)}
          />
        </View>
      </View>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={{ gap: spacing[4] }}>
      <Text style={{ color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
        Payment Method
      </Text>

      <RadioGroup value={paymentType} onValueChange={setPaymentType}>
        <RadioGroupItem value="card" label="Credit/Debit Card" />
        <RadioGroupItem value="paypal" label="PayPal" />
        <RadioGroupItem value="applepay" label="Apple Pay" />
      </RadioGroup>

      {paymentType === 'card' && (
        <View style={{ gap: spacing[3], marginTop: spacing[2] }}>
          <Input
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            leftIcon={<CreditCardIcon size={18} color={colors.foregroundMuted} />}
          />

          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                secureTextEntry
              />
            </View>
          </View>

          <Input
            label="Name on Card"
            placeholder="JOHN DOE"
            value={nameOnCard}
            onChangeText={setNameOnCard}
            autoCapitalize="characters"
          />
        </View>
      )}

      <View style={[styles.securityNote, { backgroundColor: colors.secondary, padding: spacing[3], borderRadius: radius.md }]}>
        <LockIcon size={14} color={colors.foregroundMuted} />
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.xs, marginLeft: spacing[2], flex: 1 }}>
          Your payment information is secure and encrypted
        </Text>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={{ gap: spacing[4] }}>
      <Text style={{ color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>
        Order Review
      </Text>

      {/* Shipping Address Summary */}
      <View style={[styles.summaryCard, { backgroundColor: colors.secondary, padding: spacing[3], borderRadius: radius.md }]}>
        <View style={styles.summaryHeader}>
          <TruckIcon size={16} color={colors.foreground} />
          <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginLeft: spacing[2] }}>
            Shipping Address
          </Text>
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm, lineHeight: 20, marginTop: spacing[2] }}>
          {address.firstName} {address.lastName}{'\n'}
          {address.address}{'\n'}
          {address.city}, {address.state} {address.zipCode}{'\n'}
          {address.country}
        </Text>
      </View>

      {/* Payment Summary */}
      <View style={[styles.summaryCard, { backgroundColor: colors.secondary, padding: spacing[3], borderRadius: radius.md }]}>
        <View style={styles.summaryHeader}>
          <CreditCardIcon size={16} color={colors.foreground} />
          <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginLeft: spacing[2] }}>
            Payment Method
          </Text>
        </View>
        <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm, lineHeight: 20, marginTop: spacing[2] }}>
          {paymentType === 'card' && `Card ending in ${cardNumber.slice(-4)}`}
          {paymentType === 'paypal' && 'PayPal'}
          {paymentType === 'applepay' && 'Apple Pay'}
        </Text>
      </View>

      {/* Order Items */}
      <View>
        <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginBottom: spacing[2] }}>
          Order Items ({items.length})
        </Text>
        {items.map((item) => (
          <View key={item.id} style={[styles.itemRow, { paddingVertical: spacing[2] }]}>
            <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>
              {item.name} x{item.quantity}
            </Text>
            <Text style={{ color: colors.foreground, fontSize: fontSize.sm, fontWeight: fontWeight.medium }}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.border }]}>
        <View style={[styles.headerContent, { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }]}>
          <IconButton icon={<ChevronLeftIcon />} variant="ghost" onPress={handleBack} />
          <Text style={{ color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.semibold }}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} colors={colors} spacing={spacing} fontSize={fontSize} fontWeight={fontWeight} />

      <Separator />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: spacing[4] }}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 'shipping' && renderShippingStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'review' && renderReviewStep()}

        {/* Order Summary */}
        <View style={{ marginTop: spacing[6] }}>
          <Separator style={{ marginBottom: spacing[4] }} />
          <View style={[styles.totalRow, { marginBottom: spacing[1] }]}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>Subtotal</Text>
            <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={[styles.totalRow, { marginBottom: spacing[1] }]}>
            <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>Shipping</Text>
            <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </Text>
          </View>
          {tax > 0 && (
            <View style={[styles.totalRow, { marginBottom: spacing[1] }]}>
              <Text style={{ color: colors.foregroundMuted, fontSize: fontSize.sm }}>Tax</Text>
              <Text style={{ color: colors.foreground, fontSize: fontSize.sm }}>{formatPrice(tax)}</Text>
            </View>
          )}
          <Separator style={{ marginVertical: spacing[2] }} />
          <View style={styles.totalRow}>
            <Text style={{ color: colors.foreground, fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>Total</Text>
            <Text style={{ color: colors.foreground, fontSize: fontSize.lg, fontWeight: fontWeight.bold }}>{formatPrice(total)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom || spacing[4],
            paddingHorizontal: spacing[4],
            paddingTop: spacing[3],
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Button variant="default" onPress={handleContinue} fullWidth>
          {currentStep === 'review' ? 'Place Order' : 'Continue'}
        </Button>
      </View>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCard: {},
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBar: {},
});
