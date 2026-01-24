/**
 * ErrorBoundary
 *
 * A React error boundary component for catching and handling
 * runtime errors in mcellui components.
 *
 * @example
 * ```tsx
 * // Wrap individual components
 * <ErrorBoundary fallback={<Text>Something went wrong</Text>}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom error handler
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     logErrorToService(error, errorInfo);
 *   }}
 *   fallback={({ error, reset }) => (
 *     <View>
 *       <Text>Error: {error.message}</Text>
 *       <Button onPress={reset}>Try Again</Button>
 *     </View>
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface ErrorBoundaryFallbackProps {
  /** The error that was caught */
  error: Error;
  /** Function to reset the error boundary and retry */
  reset: () => void;
}

export interface ErrorBoundaryProps {
  /** Children to render when no error */
  children: ReactNode;

  /**
   * Fallback UI to show when an error occurs.
   * Can be a ReactNode or a render function receiving error details.
   */
  fallback?: ReactNode | ((props: ErrorBoundaryFallbackProps) => ReactNode);

  /**
   * Callback when an error is caught.
   * Use for logging errors to external services.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Callback when the error boundary resets.
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // No fallback provided - render default
      if (!fallback) {
        return (
          <DefaultErrorFallback
            error={error}
            reset={this.reset}
          />
        );
      }

      // Render function fallback
      if (typeof fallback === 'function') {
        return fallback({ error, reset: this.reset });
      }

      // ReactNode fallback
      return fallback;
    }

    return children;
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, reset }: ErrorBoundaryFallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{error.message}</Text>
      <Pressable style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

/**
 * Higher-order component to wrap a component with an error boundary
 *
 * @example
 * ```tsx
 * const SafeMyComponent = withErrorBoundary(MyComponent, {
 *   fallback: <Text>Error loading component</Text>,
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}
