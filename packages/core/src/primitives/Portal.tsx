/**
 * Portal Primitive
 *
 * Teleports children to a different part of the React tree.
 * Essential for overlays like Dialogs, Toasts, Dropdowns.
 *
 * Usage:
 * 1. Wrap your app with <PortalProvider>
 * 2. Place <PortalHost /> at the root (after other content)
 * 3. Use <Portal> anywhere to render content at the host
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useId,
} from 'react';
import { View, StyleSheet } from 'react-native';

// --- Types ---

export interface PortalContextValue {
  /**
   * Register a portal to be rendered at the host
   */
  mount: (key: string, element: React.ReactNode) => void;
  /**
   * Remove a portal from the host
   */
  unmount: (key: string) => void;
}

export interface PortalProviderProps {
  children: React.ReactNode;
}

export interface PortalHostProps {
  /**
   * Name of the host (for multiple hosts)
   * @default 'root'
   */
  name?: string;
}

export interface PortalProps {
  children: React.ReactNode;
  /**
   * Name of the host to render into
   * @default 'root'
   */
  hostName?: string;
}

// --- Context ---

const PortalContext = createContext<PortalContextValue | null>(null);

const usePortalContext = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('Portal must be used within a PortalProvider');
  }
  return context;
};

// --- Components ---

/**
 * Provides the portal context to the app.
 * Wrap your root component with this provider.
 */
export function PortalProvider({ children }: PortalProviderProps) {
  const [portals, setPortals] = useState<Map<string, React.ReactNode>>(
    new Map()
  );

  const mount = useCallback((key: string, element: React.ReactNode) => {
    setPortals((prev) => {
      const next = new Map(prev);
      next.set(key, element);
      return next;
    });
  }, []);

  const unmount = useCallback((key: string) => {
    setPortals((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const contextValue = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <PortalContext.Provider value={contextValue}>
      {children}
      <PortalHost />
    </PortalContext.Provider>
  );
}

PortalProvider.displayName = 'PortalProvider';

/**
 * The target where portals render their content.
 * Automatically included in PortalProvider, but can be placed manually
 * for custom layouts.
 */
export function PortalHost({ name = 'root' }: PortalHostProps) {
  const [portals, setPortals] = useState<Map<string, React.ReactNode>>(
    new Map()
  );

  // Create a separate context for this specific host
  const mount = useCallback((key: string, element: React.ReactNode) => {
    setPortals((prev) => {
      const next = new Map(prev);
      next.set(key, element);
      return next;
    });
  }, []);

  const unmount = useCallback((key: string) => {
    setPortals((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  return (
    <PortalHostContext.Provider value={{ mount, unmount, name }}>
      <View style={styles.host} pointerEvents="box-none">
        {Array.from(portals.values())}
      </View>
    </PortalHostContext.Provider>
  );
}

PortalHost.displayName = 'PortalHost';

// Host-specific context for named hosts
interface PortalHostContextValue extends PortalContextValue {
  name: string;
}

const PortalHostContext = createContext<PortalHostContextValue | null>(null);

/**
 * Renders children into the nearest PortalHost.
 */
export function Portal({ children, hostName = 'root' }: PortalProps) {
  const portalContext = useContext(PortalContext);
  const key = useId();

  React.useEffect(() => {
    if (!portalContext) {
      console.warn('Portal: No PortalProvider found. Content will not render.');
      return;
    }

    portalContext.mount(key, children);

    return () => {
      portalContext.unmount(key);
    };
  }, [portalContext, key, children]);

  return null;
}

Portal.displayName = 'Portal';

// --- Styles ---

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
