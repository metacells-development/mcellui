/**
 * nativeui Figma Plugin - Main Entry (Figma Sandbox)
 *
 * Dieser Code läuft in der Figma Sandbox und hat Zugriff auf die Figma API.
 * Kommunikation mit dem UI erfolgt über postMessage.
 */

import { extractTokensFromCollection, getCollectionInfo } from './lib/tokens/extractor';
import { transformToNativeUIConfig } from './lib/tokens/transformer';
import { generateConfigFile } from './lib/tokens/emitter';
import type { PluginMessage, UIMessage, ExtractOptions } from './lib/types';

// Plugin-Größe
figma.showUI(__html__, {
  width: 380,
  height: 560,
  themeColors: true,
  title: 'nativeui',
});

// ============================================================================
// Message Handler
// ============================================================================

figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    switch (msg.type) {
      case 'init':
      case 'get-collections':
        await handleGetCollections();
        break;

      case 'extract-tokens':
        await handleExtractTokens(msg.collectionId, msg.options);
        break;

      case 'notify':
        figma.notify(msg.message, { error: msg.error });
        break;

      default:
        console.warn('Unknown message type:', msg);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten';
    sendToUI({ type: 'error', message });
    figma.notify(message, { error: true });
  }
};

// ============================================================================
// Handler Functions
// ============================================================================

async function handleGetCollections(): Promise<void> {
  console.log('[nativeui] handleGetCollections aufgerufen');
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  console.log('[nativeui] Collections von API:', collections.length);

  const collectionInfos = await Promise.all(
    collections.map((collection) => getCollectionInfo(collection))
  );
  console.log('[nativeui] CollectionInfos:', collectionInfos);

  sendToUI({
    type: 'collections',
    collections: collectionInfos,
  });
  console.log('[nativeui] Nachricht an UI gesendet');
}

async function handleExtractTokens(
  collectionId: string,
  options: ExtractOptions
): Promise<void> {
  // Collection finden
  const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);

  if (!collection) {
    throw new Error(`Collection mit ID "${collectionId}" nicht gefunden`);
  }

  // Tokens extrahieren
  const tokens = await extractTokensFromCollection(collection, options);

  // Zu nativeui Config transformieren
  const config = transformToNativeUIConfig(tokens);

  // Config-Datei generieren
  const configFile = generateConfigFile(config);

  sendToUI({
    type: 'tokens-extracted',
    tokens,
    config: configFile,
  });

  figma.notify('Tokens erfolgreich extrahiert!');
}

// ============================================================================
// Utility Functions
// ============================================================================

function sendToUI(message: UIMessage): void {
  figma.ui.postMessage(message);
}

// ============================================================================
// Plugin Initialization
// ============================================================================

// Debug: Log beim Start
console.log('[nativeui] Plugin gestartet');

// Warte kurz bis UI bereit ist, dann lade Collections
setTimeout(async () => {
  try {
    console.log('[nativeui] Lade Collections...');
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    console.log('[nativeui] Gefundene Collections:', collections.length, collections);
    await handleGetCollections();
  } catch (error) {
    console.error('[nativeui] Fehler beim Laden der Collections:', error);
  }
}, 100);
