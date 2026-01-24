/**
 * mcellui Figma Plugin - Main Entry (Figma Sandbox)
 *
 * Dieser Code läuft in der Figma Sandbox und hat Zugriff auf die Figma API.
 * Kommunikation mit dem UI erfolgt über postMessage.
 */

import { extractTokensFromCollection, getCollectionInfo } from './lib/tokens/extractor';
import { transformToNativeUIConfig } from './lib/tokens/transformer';
import { generateConfigFile } from './lib/tokens/emitter';
import {
  importAllTokens,
  importColorTokens,
  importSpacingTokens,
  importRadiusTokens,
  checkExistingCollections,
  deleteExistingCollections,
} from './lib/tokens/importer';
import {
  generateAllComponents,
  generateComponent,
  checkExistingComponents,
  deleteExistingComponents,
  getAvailableComponents,
} from './lib/components/generator';
import type { PluginMessage, UIMessage, ExtractOptions, ImportOptions } from './lib/types';

// Plugin-Größe
figma.showUI(__html__, {
  width: 380,
  height: 560,
  themeColors: true,
  title: 'mcellui',
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

      // Import (Code → Figma)
      case 'check-existing-collections':
        await handleCheckExisting();
        break;

      case 'import-tokens':
        await handleImportTokens(msg.options);
        break;

      case 'delete-collections':
        await handleDeleteCollections();
        break;

      // Component Generation (Code → Figma)
      case 'get-available-components':
        handleGetAvailableComponents();
        break;

      case 'check-existing-components':
        await handleCheckExistingComponents();
        break;

      case 'generate-all-components':
        await handleGenerateAllComponents();
        break;

      case 'generate-components':
        await handleGenerateComponents(msg.componentNames);
        break;

      case 'delete-components':
        await handleDeleteComponents();
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
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  const collectionInfos = await Promise.all(
    collections.map((collection) => getCollectionInfo(collection))
  );

  sendToUI({
    type: 'collections',
    collections: collectionInfos,
  });
}

async function handleExtractTokens(
  collectionId: string,
  options: ExtractOptions
): Promise<void> {
  // Collection finden
  const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);

  if (!collection) {
    throw new Error('Collection mit ID "' + collectionId + '" nicht gefunden');
  }

  // Tokens extrahieren
  const tokens = await extractTokensFromCollection(collection, options);

  // Zu mcellui Config transformieren
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
// Import Handler Functions (Code → Figma)
// ============================================================================

async function handleCheckExisting(): Promise<void> {
  const existing = await checkExistingCollections();
  sendToUI({ type: 'existing-collections', existing });
}

async function handleImportTokens(options: ImportOptions): Promise<void> {
  // Wenn überschreiben aktiviert, erst löschen
  if (options.overwrite) {
    await deleteExistingCollections();
  }

  let collectionsCreated = 0;
  let variablesCreated = 0;
  const errors: string[] = [];

  try {
    // Colors importieren
    if (options.includeColors) {
      const colorResult = await importColorTokens();
      collectionsCreated++;
      variablesCreated += colorResult.variables.length;
    }

    // Spacing importieren
    if (options.includeSpacing) {
      const spacingResult = await importSpacingTokens();
      collectionsCreated++;
      variablesCreated += spacingResult.variables.length;
    }

    // Radius importieren
    if (options.includeRadius) {
      const radiusResult = await importRadiusTokens();
      collectionsCreated++;
      variablesCreated += radiusResult.variables.length;
    }

    sendToUI({
      type: 'import-complete',
      result: {
        success: true,
        collectionsCreated,
        variablesCreated,
        errors,
      },
    });

    figma.notify(variablesCreated + ' Variables in ' + collectionsCreated + ' Collections importiert!');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import fehlgeschlagen';
    errors.push(message);
    sendToUI({
      type: 'import-complete',
      result: {
        success: false,
        collectionsCreated,
        variablesCreated,
        errors,
      },
    });
  }
}

async function handleDeleteCollections(): Promise<void> {
  await deleteExistingCollections();
  sendToUI({ type: 'success', message: 'mcellui Collections gelöscht' });
  figma.notify('mcellui Collections gelöscht');

  // Collections-Liste aktualisieren
  await handleGetCollections();
}

// ============================================================================
// Component Generation Handler Functions (Code → Figma)
// ============================================================================

function handleGetAvailableComponents(): void {
  const components = getAvailableComponents();
  sendToUI({ type: 'available-components', components });
}

async function handleCheckExistingComponents(): Promise<void> {
  const existing = await checkExistingComponents();
  sendToUI({ type: 'existing-components', existing });
}

async function handleGenerateAllComponents(): Promise<void> {
  const result = await generateAllComponents();

  sendToUI({ type: 'components-generated', result });

  if (result.success) {
    figma.notify(
      result.componentsCreated + ' Components mit ' + result.variantsCreated + ' Variants erstellt!'
    );
  } else {
    figma.notify('Fehler: ' + result.errors.join(', '), { error: true });
  }
}

async function handleGenerateComponents(componentNames: string[]): Promise<void> {
  let totalComponents = 0;
  let totalVariants = 0;
  const errors: string[] = [];

  for (const name of componentNames) {
    const result = await generateComponent(name);
    totalComponents += result.componentsCreated;
    totalVariants += result.variantsCreated;
    for (const err of result.errors) {
      errors.push(err);
    }
  }

  sendToUI({
    type: 'components-generated',
    result: {
      success: errors.length === 0,
      componentsCreated: totalComponents,
      variantsCreated: totalVariants,
      errors,
    },
  });

  if (errors.length === 0) {
    figma.notify(totalComponents + ' Components mit ' + totalVariants + ' Variants erstellt!');
  }
}

async function handleDeleteComponents(): Promise<void> {
  await deleteExistingComponents();
  sendToUI({ type: 'success', message: 'mcellui Components gelöscht' });
  figma.notify('mcellui Components gelöscht');
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

// Warte kurz bis UI bereit ist, dann lade Collections
setTimeout(async () => {
  try {
    await handleGetCollections();
  } catch (error) {
    console.error('[mcellui] Fehler beim Laden der Collections:', error);
  }
}, 100);
