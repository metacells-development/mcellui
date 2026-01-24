/**
 * mcellui Figma Plugin - UI Entry (React)
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
  ImportOptions,
  ExistingCollections,
  ImportResult,
  ExistingComponents,
  ComponentGenerateResult,
} from './lib/types';

// ============================================================================
// Types
// ============================================================================

type TabId = 'import' | 'export' | 'components';

// ============================================================================
// App Component
// ============================================================================

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('import');

  // Export State
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState<ExtractOptions>({
    includeColors: true,
    includeSpacing: true,
    includeRadius: true,
    includeTypography: false,
  });
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenCollection | null>(null);

  // Import State
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    includeColors: true,
    includeSpacing: true,
    includeRadius: true,
    overwrite: true,
  });
  const [existingCollections, setExistingCollections] = useState<ExistingCollections | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Component State
  const [availableComponents, setAvailableComponents] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const [existingComponents, setExistingComponents] = useState<ExistingComponents | null>(null);
  const [componentResult, setComponentResult] = useState<ComponentGenerateResult | null>(null);

  // Shared State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Nachrichten vom Main-Thread empfangen
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as UIMessage;
      if (!msg) return;

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

        case 'existing-collections':
          setExistingCollections(msg.existing);
          setIsLoading(false);
          break;

        case 'import-complete':
          setImportResult(msg.result);
          setIsLoading(false);
          if (msg.result.success) {
            setSuccessMessage(
              `${msg.result.variablesCreated} Variables importiert!`
            );
          } else {
            setError(msg.result.errors.join(', '));
          }
          setTimeout(() => {
            setSuccessMessage(null);
            setError(null);
          }, 5000);
          // Collections aktualisieren
          sendToMain({ type: 'get-collections' });
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

        // Component messages
        case 'available-components':
          setAvailableComponents(msg.components);
          // Select all by default
          setSelectedComponents(new Set(msg.components));
          setIsLoading(false);
          break;

        case 'existing-components':
          setExistingComponents(msg.existing);
          setIsLoading(false);
          break;

        case 'components-generated':
          setComponentResult(msg.result);
          setIsLoading(false);
          if (msg.result.success) {
            setSuccessMessage(
              `${msg.result.componentsCreated} Components mit ${msg.result.variantsCreated} Variants erstellt!`
            );
          } else {
            setError(msg.result.errors.join(', '));
          }
          setTimeout(() => {
            setSuccessMessage(null);
            setError(null);
          }, 5000);
          // Refresh existing check
          sendToMain({ type: 'check-existing-components' });
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedCollection]);

  // Initial Collections und Components laden
  useEffect(() => {
    sendToMain({ type: 'init' });
    sendToMain({ type: 'check-existing-collections' });
    sendToMain({ type: 'get-available-components' });
    sendToMain({ type: 'check-existing-components' });
  }, []);

  const sendToMain = useCallback((message: PluginMessage) => {
    parent.postMessage({ pluginMessage: message }, '*');
  }, []);

  // ============================================================================
  // Export Handlers
  // ============================================================================

  const handleExtract = () => {
    if (!selectedCollection) return;

    setIsLoading(true);
    setError(null);

    const collection = collections.find((c) => c.id === selectedCollection);
    if (!collection) return;

    const lightMode = collection.modes.find(
      (m) => m.name.toLowerCase().includes('light') || m.name.toLowerCase() === 'default'
    );
    const darkMode = collection.modes.find((m) => m.name.toLowerCase().includes('dark'));

    sendToMain({
      type: 'extract-tokens',
      collectionId: selectedCollection,
      options: {
        ...exportOptions,
        lightModeId: lightMode?.id || collection.modes[0]?.id,
        darkModeId: darkMode?.id,
      },
    });
  };

  const handleCopyConfig = () => {
    if (!generatedConfig) return;

    const textArea = document.createElement('textarea');
    textArea.value = generatedConfig;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        sendToMain({ type: 'notify', message: 'Config in Zwischenablage kopiert!' });
        setSuccessMessage('In Zwischenablage kopiert!');
      } else {
        throw new Error('execCommand failed');
      }
    } catch {
      sendToMain({
        type: 'notify',
        message: 'Kopieren fehlgeschlagen - bitte manuell kopieren',
        error: true,
      });
      setError('Automatisches Kopieren nicht möglich.');
    } finally {
      document.body.removeChild(textArea);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // ============================================================================
  // Import Handlers
  // ============================================================================

  const handleImport = () => {
    setIsLoading(true);
    setError(null);
    setImportResult(null);
    sendToMain({ type: 'import-tokens', options: importOptions });
  };

  const handleDeleteCollections = () => {
    if (confirm('Alle mcellui Collections löschen?')) {
      setIsLoading(true);
      sendToMain({ type: 'delete-collections' });
    }
  };

  // ============================================================================
  // Component Handlers
  // ============================================================================

  const handleGenerateAllComponents = () => {
    setIsLoading(true);
    setError(null);
    setComponentResult(null);
    sendToMain({ type: 'generate-all-components' });
  };

  const handleGenerateSelectedComponents = () => {
    if (selectedComponents.size === 0) return;
    setIsLoading(true);
    setError(null);
    setComponentResult(null);
    sendToMain({ type: 'generate-components', componentNames: Array.from(selectedComponents) });
  };

  const handleDeleteComponents = () => {
    if (confirm('Alle mcellui Components löschen?')) {
      setIsLoading(true);
      sendToMain({ type: 'delete-components' });
    }
  };

  const toggleComponent = (name: string) => {
    setSelectedComponents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const selectAllComponents = () => {
    setSelectedComponents(new Set(availableComponents));
  };

  const deselectAllComponents = () => {
    setSelectedComponents(new Set());
  };

  const selectedCollectionInfo = collections.find((c) => c.id === selectedCollection);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div className="section" style={{ paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>mcellui</span>
          <span style={{ fontSize: 11, color: 'var(--figma-color-text-secondary)' }}>
            Token Sync
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'import' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          Tokens
        </button>
        <button
          className={`tab ${activeTab === 'components' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button
          className={`tab ${activeTab === 'export' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'import' && (
          <ImportTab
            options={importOptions}
            setOptions={setImportOptions}
            existingCollections={existingCollections}
            importResult={importResult}
            isLoading={isLoading}
            onImport={handleImport}
            onDelete={handleDeleteCollections}
          />
        )}
        {activeTab === 'components' && (
          <ComponentsTab
            availableComponents={availableComponents}
            selectedComponents={selectedComponents}
            existingComponents={existingComponents}
            componentResult={componentResult}
            isLoading={isLoading}
            onToggleComponent={toggleComponent}
            onSelectAll={selectAllComponents}
            onDeselectAll={deselectAllComponents}
            onGenerateAll={handleGenerateAllComponents}
            onGenerateSelected={handleGenerateSelectedComponents}
            onDelete={handleDeleteComponents}
          />
        )}
        {activeTab === 'export' && (
          <ExportTab
            collections={collections}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            selectedCollectionInfo={selectedCollectionInfo}
            options={exportOptions}
            setOptions={setExportOptions}
            generatedConfig={generatedConfig}
            tokens={tokens}
            isLoading={isLoading}
            onExtract={handleExtract}
            onCopy={handleCopyConfig}
          />
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
// Import Tab Component
// ============================================================================

interface ImportTabProps {
  options: ImportOptions;
  setOptions: React.Dispatch<React.SetStateAction<ImportOptions>>;
  existingCollections: ExistingCollections | null;
  importResult: ImportResult | null;
  isLoading: boolean;
  onImport: () => void;
  onDelete: () => void;
}

function ImportTab({
  options,
  setOptions,
  existingCollections,
  importResult,
  isLoading,
  onImport,
  onDelete,
}: ImportTabProps) {
  const hasExisting =
    existingCollections &&
    (existingCollections.hasColors ||
      existingCollections.hasSpacing ||
      existingCollections.hasRadius);

  return (
    <>
      {/* Info */}
      <div className="section">
        <div
          style={{
            padding: 12,
            background: 'var(--figma-color-bg-secondary)',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          <strong>mcellui Tokens importieren</strong>
          <br />
          Erstellt Figma Variable Collections mit allen Design Tokens aus der mcellui Library.
        </div>
      </div>

      {/* Existing Collections Warning */}
      {hasExisting && (
        <div className="section">
          <div
            style={{
              padding: 12,
              background: 'var(--figma-color-bg-warning)',
              borderRadius: 8,
              fontSize: 11,
            }}
          >
            <strong>Existierende Collections:</strong>
            <br />
            {existingCollections.hasColors && '• mcellui/colors\n'}
            {existingCollections.hasSpacing && '• mcellui/spacing\n'}
            {existingCollections.hasRadius && '• mcellui/radius'}
          </div>
        </div>
      )}

      {/* Import Options */}
      <div className="section">
        <div className="section-title">Tokens zum Importieren</div>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.includeColors}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, includeColors: e.target.checked }))
              }
            />
            <span>Colors (29 tokens, Light/Dark Mode)</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.includeSpacing}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, includeSpacing: e.target.checked }))
              }
            />
            <span>Spacing (23 tokens)</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.includeRadius}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, includeRadius: e.target.checked }))
              }
            />
            <span>Radius (7 tokens)</span>
          </label>
        </div>

        {hasExisting && (
          <label className="checkbox-item" style={{ marginTop: 12 }}>
            <input
              type="checkbox"
              checked={options.overwrite}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, overwrite: e.target.checked }))
              }
            />
            <span>Existierende Collections überschreiben</span>
          </label>
        )}
      </div>

      {/* Import Button */}
      <div className="section">
        <button
          className="btn btn-primary"
          onClick={onImport}
          disabled={isLoading || (!options.includeColors && !options.includeSpacing && !options.includeRadius)}
          style={{ width: '100%' }}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Importiere...
            </>
          ) : (
            'Tokens importieren'
          )}
        </button>
      </div>

      {/* Import Result */}
      {importResult && importResult.success && (
        <div className="section">
          <div
            style={{
              padding: 12,
              background: 'var(--figma-color-bg-success)',
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            <strong>Import erfolgreich!</strong>
            <br />
            {importResult.collectionsCreated} Collections erstellt
            <br />
            {importResult.variablesCreated} Variables importiert
          </div>
        </div>
      )}

      {/* Delete Button */}
      {hasExisting && (
        <div className="section">
          <button
            className="btn btn-secondary"
            onClick={onDelete}
            disabled={isLoading}
            style={{ width: '100%', fontSize: 11 }}
          >
            mcellui Collections löschen
          </button>
        </div>
      )}
    </>
  );
}

// ============================================================================
// Components Tab Component
// ============================================================================

interface ComponentsTabProps {
  availableComponents: string[];
  selectedComponents: Set<string>;
  existingComponents: ExistingComponents | null;
  componentResult: ComponentGenerateResult | null;
  isLoading: boolean;
  onToggleComponent: (name: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onGenerateAll: () => void;
  onGenerateSelected: () => void;
  onDelete: () => void;
}

function ComponentsTab({
  availableComponents,
  selectedComponents,
  existingComponents,
  componentResult,
  isLoading,
  onToggleComponent,
  onSelectAll,
  onDeselectAll,
  onGenerateAll,
  onGenerateSelected,
  onDelete,
}: ComponentsTabProps) {
  const hasExisting = existingComponents?.exists;

  return (
    <>
      {/* Info */}
      <div className="section">
        <div
          style={{
            padding: 12,
            background: 'var(--figma-color-bg-secondary)',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          <strong>mcellui Components generieren</strong>
          <br />
          Erstellt Figma Component Sets mit allen Variants basierend auf den mcellui React Native
          Components.
        </div>
      </div>

      {/* Warning: Tokens Required */}
      <div className="section">
        <div
          style={{
            padding: 12,
            background: 'var(--figma-color-bg-warning)',
            borderRadius: 8,
            fontSize: 11,
          }}
        >
          <strong>Hinweis:</strong> Zuerst müssen die mcellui Tokens importiert werden (Tokens Tab),
          damit die Components die korrekten Farben verwenden können.
        </div>
      </div>

      {/* Existing Components Warning */}
      {hasExisting && existingComponents && (
        <div className="section">
          <div
            style={{
              padding: 12,
              background: 'var(--figma-color-bg-tertiary)',
              borderRadius: 8,
              fontSize: 11,
            }}
          >
            <strong>Existierende Components:</strong>
            <br />
            {existingComponents.componentNames.map((name) => `• ${name}`).join('\n')}
          </div>
        </div>
      )}

      {/* Component Selection */}
      <div className="section">
        <div className="section-title">Components zum Generieren</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button className="btn btn-secondary" onClick={onSelectAll} style={{ fontSize: 10 }}>
            Alle auswählen
          </button>
          <button className="btn btn-secondary" onClick={onDeselectAll} style={{ fontSize: 10 }}>
            Keine auswählen
          </button>
        </div>
        <div className="checkbox-group">
          {availableComponents.map((name) => (
            <label key={name} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedComponents.has(name)}
                onChange={() => onToggleComponent(name)}
              />
              <span>{name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Buttons */}
      <div className="section">
        <button
          className="btn btn-primary"
          onClick={onGenerateAll}
          disabled={isLoading || availableComponents.length === 0}
          style={{ width: '100%', marginBottom: 8 }}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Generiere...
            </>
          ) : (
            `Alle ${availableComponents.length} Components generieren`
          )}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onGenerateSelected}
          disabled={isLoading || selectedComponents.size === 0}
          style={{ width: '100%' }}
        >
          {selectedComponents.size > 0
            ? `${selectedComponents.size} ausgewählte generieren`
            : 'Keine ausgewählt'}
        </button>
      </div>

      {/* Result */}
      {componentResult && componentResult.success && (
        <div className="section">
          <div
            style={{
              padding: 12,
              background: 'var(--figma-color-bg-success)',
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            <strong>Generation erfolgreich!</strong>
            <br />
            {componentResult.componentsCreated} Component Sets erstellt
            <br />
            {componentResult.variantsCreated} Variants generiert
          </div>
        </div>
      )}

      {/* Delete Button */}
      {hasExisting && (
        <div className="section">
          <button
            className="btn btn-secondary"
            onClick={onDelete}
            disabled={isLoading}
            style={{ width: '100%', fontSize: 11 }}
          >
            mcellui Components löschen
          </button>
        </div>
      )}
    </>
  );
}

// ============================================================================
// Export Tab Component
// ============================================================================

interface ExportTabProps {
  collections: CollectionInfo[];
  selectedCollection: string | null;
  setSelectedCollection: (id: string) => void;
  selectedCollectionInfo: CollectionInfo | undefined;
  options: ExtractOptions;
  setOptions: React.Dispatch<React.SetStateAction<ExtractOptions>>;
  generatedConfig: string | null;
  tokens: TokenCollection | null;
  isLoading: boolean;
  onExtract: () => void;
  onCopy: () => void;
}

function ExportTab({
  collections,
  selectedCollection,
  setSelectedCollection,
  selectedCollectionInfo,
  options,
  setOptions,
  generatedConfig,
  tokens,
  isLoading,
  onExtract,
  onCopy,
}: ExportTabProps) {
  return (
    <>
      {/* Collection Selector */}
      <div className="section">
        <div className="section-title">Variable Collection</div>
        {collections.length === 0 ? (
          <div style={{ color: 'var(--figma-color-text-secondary)', fontStyle: 'italic' }}>
            Keine Variable Collections gefunden.
            <br />
            <span style={{ fontSize: 10 }}>
              Erstelle eine Collection oder importiere mcellui Tokens.
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
              <span>Colors ({selectedCollectionInfo.tokenCounts.colors} tokens)</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={options.includeSpacing}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, includeSpacing: e.target.checked }))
                }
              />
              <span>Spacing ({selectedCollectionInfo.tokenCounts.spacing} tokens)</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={options.includeRadius}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, includeRadius: e.target.checked }))
                }
              />
              <span>Radius ({selectedCollectionInfo.tokenCounts.radius} tokens)</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={options.includeTypography}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, includeTypography: e.target.checked }))
                }
              />
              <span>Typography ({selectedCollectionInfo.tokenCounts.typography} tokens)</span>
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
            onClick={onExtract}
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
          <div className="code-preview" style={{ userSelect: 'text', cursor: 'text' }}>
            {generatedConfig}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={onCopy} style={{ flex: 1 }}>
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
            Kopiere den Code in deine <code>mcellui.config.ts</code> Datei.
          </div>
        </div>
      )}

      {/* Token Summary */}
      {tokens && (
        <div className="section">
          <div className="section-title">Extrahierte Tokens</div>
          <div style={{ fontSize: 11 }}>
            <div>
              <strong>Colors:</strong> {Object.keys(tokens.colors.light).length} light,{' '}
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
    </>
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
