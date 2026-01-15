/**
 * nativeui Figma Plugin - UI Entry (React)
 *
 * Dieser Code läuft in einem iframe und rendert das Plugin UI.
 * Kommunikation mit dem Main-Thread erfolgt über postMessage.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import type {
  UIMessage,
  PluginMessage,
  CollectionInfo,
  ExtractOptions,
  TokenCollection,
} from './lib/types';

// ============================================================================
// App Component
// ============================================================================

function App() {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [options, setOptions] = useState<ExtractOptions>({
    includeColors: true,
    includeSpacing: true,
    includeRadius: true,
    includeTypography: false,
  });
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Nachrichten vom Main-Thread empfangen
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Figma sendet Nachrichten als event.data.pluginMessage
      const msg = event.data?.pluginMessage as UIMessage;
      if (!msg) return;

      console.log('[nativeui UI] Nachricht empfangen:', msg);

      switch (msg.type) {
        case 'collections':
          setCollections(msg.collections);
          if (msg.collections.length > 0 && !selectedCollection) {
            setSelectedCollection(msg.collections[0].id);
          }
          setIsLoading(false);
          break;

        case 'tokens-extracted':
          setTokens(msg.tokens);
          setGeneratedConfig(msg.config);
          setIsLoading(false);
          setSuccessMessage('Tokens erfolgreich extrahiert!');
          setTimeout(() => setSuccessMessage(null), 3000);
          break;

        case 'error':
          setError(msg.message);
          setIsLoading(false);
          setTimeout(() => setError(null), 5000);
          break;

        case 'success':
          setSuccessMessage(msg.message);
          setTimeout(() => setSuccessMessage(null), 3000);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedCollection]);

  // Initial Collections laden
  useEffect(() => {
    sendToMain({ type: 'init' });
  }, []);

  const sendToMain = useCallback((message: PluginMessage) => {
    parent.postMessage({ pluginMessage: message }, '*');
  }, []);

  const handleExtract = () => {
    if (!selectedCollection) return;

    setIsLoading(true);
    setError(null);

    const collection = collections.find((c) => c.id === selectedCollection);
    if (!collection) return;

    // Light/Dark Mode IDs ermitteln
    const lightMode = collection.modes.find(
      (m) => m.name.toLowerCase().includes('light') || m.name.toLowerCase() === 'default'
    );
    const darkMode = collection.modes.find(
      (m) => m.name.toLowerCase().includes('dark')
    );

    sendToMain({
      type: 'extract-tokens',
      collectionId: selectedCollection,
      options: {
        ...options,
        lightModeId: lightMode?.id || collection.modes[0]?.id,
        darkModeId: darkMode?.id,
      },
    });
  };

  const handleCopyConfig = async () => {
    if (!generatedConfig) return;

    try {
      await navigator.clipboard.writeText(generatedConfig);
      sendToMain({ type: 'notify', message: 'Config in Zwischenablage kopiert!' });
      setSuccessMessage('In Zwischenablage kopiert!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      // Fallback für ältere Browser
      sendToMain({ type: 'notify', message: 'Kopieren fehlgeschlagen', error: true });
    }
  };

  const selectedCollectionInfo = collections.find((c) => c.id === selectedCollection);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div className="section" style={{ paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>nativeui</span>
          <span style={{ fontSize: 11, color: 'var(--figma-color-text-secondary)' }}>
            Token Sync
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Collection Selector */}
        <div className="section">
          <div className="section-title">Variable Collection</div>
          {collections.length === 0 ? (
            <div style={{ color: 'var(--figma-color-text-secondary)', fontStyle: 'italic' }}>
              Keine Variable Collections gefunden.
              <br />
              <span style={{ fontSize: 10 }}>
                Erstelle eine Collection in Figma unter "Local variables".
              </span>
            </div>
          ) : (
            <select
              className="select"
              value={selectedCollection || ''}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name} ({collection.variableCount} variables)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Token Options */}
        {selectedCollectionInfo && (
          <div className="section">
            <div className="section-title">Tokens zum Exportieren</div>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.includeColors}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeColors: e.target.checked }))
                  }
                />
                <span>
                  Colors ({selectedCollectionInfo.tokenCounts.colors} tokens)
                </span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.includeSpacing}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeSpacing: e.target.checked }))
                  }
                />
                <span>
                  Spacing ({selectedCollectionInfo.tokenCounts.spacing} tokens)
                </span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.includeRadius}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeRadius: e.target.checked }))
                  }
                />
                <span>
                  Radius ({selectedCollectionInfo.tokenCounts.radius} tokens)
                </span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.includeTypography}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeTypography: e.target.checked }))
                  }
                />
                <span>
                  Typography ({selectedCollectionInfo.tokenCounts.typography} tokens)
                </span>
              </label>
            </div>

            {/* Mode Info */}
            {selectedCollectionInfo.modes.length > 1 && (
              <div
                style={{
                  marginTop: 12,
                  padding: 8,
                  background: 'var(--figma-color-bg-secondary)',
                  borderRadius: 4,
                  fontSize: 11,
                }}
              >
                <strong>Modes erkannt:</strong>{' '}
                {selectedCollectionInfo.modes.map((m) => m.name).join(', ')}
                <br />
                <span style={{ color: 'var(--figma-color-text-secondary)' }}>
                  Light/Dark werden automatisch zugeordnet.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Extract Button */}
        {selectedCollection && (
          <div className="section">
            <button
              className="btn btn-primary"
              onClick={handleExtract}
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Extrahiere...
                </>
              ) : (
                'Tokens extrahieren'
              )}
            </button>
          </div>
        )}

        {/* Generated Config Preview */}
        {generatedConfig && (
          <div className="section">
            <div className="section-title">Generierte Config</div>
            <div className="code-preview">{generatedConfig}</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                className="btn btn-primary"
                onClick={handleCopyConfig}
                style={{ flex: 1 }}
              >
                In Zwischenablage kopieren
              </button>
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 10,
                color: 'var(--figma-color-text-secondary)',
              }}
            >
              Kopiere den Code in deine <code>nativeui.config.ts</code> Datei.
            </div>
          </div>
        )}

        {/* Token Summary */}
        {tokens && (
          <div className="section">
            <div className="section-title">Extrahierte Tokens</div>
            <div style={{ fontSize: 11 }}>
              <div>
                <strong>Colors:</strong>{' '}
                {Object.keys(tokens.colors.light).length} light,{' '}
                {Object.keys(tokens.colors.dark).length} dark
              </div>
              <div>
                <strong>Spacing:</strong> {Object.keys(tokens.spacing).length} values
              </div>
              <div>
                <strong>Radius:</strong> {Object.keys(tokens.radius).length} values
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span>
          {error ? (
            <span style={{ color: 'var(--figma-color-text-danger)' }}>{error}</span>
          ) : successMessage ? (
            <span className="status-success">{successMessage}</span>
          ) : (
            `${collections.length} Collection(s) verfügbar`
          )}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Render
// ============================================================================

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
