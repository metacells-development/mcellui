/**
 * Component Generator - Code → Figma
 *
 * Generiert mcellui Components als Figma Component Sets mit Variants.
 * PIXEL-PERFEKTE Darstellung wie in der Demo App.
 */

import { ComponentDefinition, SizeTokens, VariantStyle, allComponents, componentsByName } from '../data/components';

// =============================================================================
// Types
// =============================================================================

export interface GenerateResult {
  success: boolean;
  componentsCreated: number;
  variantsCreated: number;
  errors: string[];
}

interface VariantCombination {
  size: string;
  variant: string;
  state: string;
  name: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Generiert alle Kombinationen von Size × Variant × State
 */
function generateVariantCombinations(
  definition: ComponentDefinition
): VariantCombination[] {
  var combinations: VariantCombination[] = [];

  for (var s = 0; s < definition.sizes.length; s++) {
    var size = definition.sizes[s];
    for (var v = 0; v < definition.variants.length; v++) {
      var variant = definition.variants[v];
      for (var st = 0; st < definition.states.length; st++) {
        var state = definition.states[st];

        var nameParts: string[] = [];
        if (definition.sizes.length > 1) {
          nameParts.push('size=' + size);
        }
        if (definition.variants.length > 1) {
          nameParts.push('variant=' + variant);
        }
        if (definition.states.length > 1) {
          nameParts.push('state=' + state);
        }

        combinations.push({
          size: size,
          variant: variant,
          state: state,
          name: nameParts.length > 0 ? nameParts.join(', ') : 'Default',
        });
      }
    }
  }

  return combinations;
}

/**
 * Findet eine Variable by Name im mcellui/colors Collection
 */
async function findColorVariable(variablePath: string): Promise<Variable | null> {
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  var colorCollection = collections.find(function(c) { return c.name === 'mcellui/colors'; });

  if (!colorCollection) {
    return null;
  }

  var variablePromises = colorCollection.variableIds.map(function(id) {
    return figma.variables.getVariableByIdAsync(id);
  });
  var variables = await Promise.all(variablePromises);

  var variable = variables.find(function(v) { return v && v.name === variablePath; });
  return variable || null;
}

/**
 * Wendet Fill mit Variable Binding an
 */
async function applyFillVariable(
  node: SceneNode & MinimalFillsMixin,
  variablePath: string
): Promise<void> {
  var variable = await findColorVariable(variablePath);

  if (variable) {
    var solidPaint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } } as SolidPaint;
    var boundPaint = figma.variables.setBoundVariableForPaint(solidPaint, 'color', variable);
    node.fills = [boundPaint];
  }
}

/**
 * Wendet Stroke mit Variable Binding an
 */
async function applyStrokeVariable(
  node: SceneNode & MinimalStrokesMixin,
  variablePath: string,
  strokeWidth: number
): Promise<void> {
  var variable = await findColorVariable(variablePath);

  if (variable) {
    var solidPaint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } } as SolidPaint;
    var boundPaint = figma.variables.setBoundVariableForPaint(solidPaint, 'color', variable);
    node.strokes = [boundPaint];
    node.strokeWeight = strokeWidth;
  }
}

// =============================================================================
// Specialized Component Creators
// =============================================================================

/**
 * Erstellt Checkmark Vector für Checkbox
 * SVG-Path "M4 12l5 5L20 6" mit strokeWidth=3
 */
async function createCheckmarkVector(iconSize: number): Promise<VectorNode> {
  var vector = figma.createVector();

  // Skalierung: iconSize ist die Zielgröße (12, 14, 18)
  var scale = iconSize / 24;

  // Checkmark: "M4 12l5 5L20 6" - skaliert
  var pathData = 'M ' + (4 * scale) + ' ' + (12 * scale) +
                 ' L ' + (9 * scale) + ' ' + (17 * scale) +
                 ' L ' + (20 * scale) + ' ' + (6 * scale);

  vector.vectorPaths = [{
    windingRule: 'NONZERO',
    data: pathData,
  }];

  vector.fills = [];
  // strokeWidth=3 aus der Demo-App, skaliert
  var strokeWidth = Math.max(2, Math.round(3 * scale));
  await applyStrokeVariable(vector, 'primary/primaryForeground', strokeWidth);
  vector.strokeCap = 'ROUND';
  vector.strokeJoin = 'ROUND';

  vector.resize(iconSize, iconSize);
  vector.name = 'Checkmark';

  return vector;
}

/**
 * Erstellt Indeterminate Line für Checkbox
 */
async function createIndeterminateLine(iconSize: number): Promise<VectorNode> {
  var vector = figma.createVector();

  var scale = iconSize / 24;
  var pathData = 'M ' + (5 * scale) + ' ' + (12 * scale) +
                 ' L ' + (19 * scale) + ' ' + (12 * scale);

  vector.vectorPaths = [{
    windingRule: 'NONZERO',
    data: pathData,
  }];

  vector.fills = [];
  var strokeWidth = Math.max(2, Math.round(3 * scale));
  await applyStrokeVariable(vector, 'primary/primaryForeground', strokeWidth);
  vector.strokeCap = 'ROUND';

  vector.resize(iconSize, iconSize);
  vector.name = 'Indeterminate';

  return vector;
}

/**
 * Erstellt Switch Thumb (der bewegliche Kreis)
 */
function createSwitchThumb(trackHeight: number, isOn: boolean, trackWidth: number): EllipseNode {
  var thumbSize = trackHeight - 4; // 2px padding auf jeder Seite
  var thumb = figma.createEllipse();
  thumb.name = 'Thumb';
  thumb.resize(thumbSize, thumbSize);

  // Weiß mit Schatten
  thumb.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  thumb.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.15 },
    offset: { x: 0, y: 1 },
    radius: 3,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];

  // Position: links (off) oder rechts (on)
  if (isOn) {
    thumb.x = trackWidth - thumbSize - 2;
  } else {
    thumb.x = 2;
  }
  thumb.y = 2;

  return thumb;
}

/**
 * Erstellt Progress Fill Bar
 */
async function createProgressFill(width: number, height: number): Promise<FrameNode> {
  var fill = figma.createFrame();
  fill.name = 'Fill';
  fill.resize(width * 0.6, height); // 60% filled
  fill.cornerRadius = height / 2;

  await applyFillVariable(fill, 'primary/primary');

  return fill;
}

/**
 * Erstellt Spinner Arc
 */
async function createSpinnerArc(size: number): Promise<EllipseNode> {
  var spinner = figma.createEllipse();
  spinner.name = 'SpinnerArc';
  spinner.resize(size, size);

  // Arc: nur 270° sichtbar
  spinner.arcData = {
    startingAngle: 0,
    endingAngle: 4.71, // 270 degrees in radians
    innerRadius: 0.7, // creates ring effect
  };

  await applyFillVariable(spinner, 'foreground/foreground');

  return spinner;
}

// =============================================================================
// Main Component Creation
// =============================================================================

/**
 * Erstellt einen einzelnen Component Variant Frame
 */
async function createVariantFrame(
  definition: ComponentDefinition,
  combination: VariantCombination
): Promise<ComponentNode> {
  var component = figma.createComponent();
  component.name = combination.name;

  // Size Token holen
  var sizeTokens = definition.sizeTokens[combination.size];
  if (!sizeTokens) {
    // Fallback auf ersten verfügbaren Size Token
    var firstSize = Object.keys(definition.sizeTokens)[0];
    sizeTokens = definition.sizeTokens[firstSize];
  }

  // Variant Style holen
  var variantStyle = definition.variantStyles[combination.variant] || {};

  // State Style holen
  var stateStyle: VariantStyle = {};
  if (definition.stateStyles && definition.stateStyles[combination.state]) {
    stateStyle = definition.stateStyles[combination.state];
  }

  // Basis-Setup
  var componentWidth = sizeTokens.width || sizeTokens.height * 3;
  var componentHeight = sizeTokens.height;

  component.resize(componentWidth, componentHeight);
  component.cornerRadius = sizeTokens.borderRadius;

  // ==========================================================================
  // FONTS LADEN
  // ==========================================================================
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });

  // ==========================================================================
  // COMPONENT-SPEZIFISCHE ERSTELLUNG
  // ==========================================================================

  var componentName = definition.name;
  var state = combination.state;
  var variant = combination.variant;

  // --- BUTTON ---
  if (componentName === 'Button') {
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisAlignItems = 'CENTER';
    component.counterAxisAlignItems = 'CENTER';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'FIXED';
    component.paddingLeft = sizeTokens.paddingHorizontal;
    component.paddingRight = sizeTokens.paddingHorizontal;
    component.paddingTop = sizeTokens.paddingVertical;
    component.paddingBottom = sizeTokens.paddingVertical;
    component.itemSpacing = sizeTokens.gap;

    // Fill basierend auf Variant
    if (variantStyle.fill) {
      await applyFillVariable(component, variantStyle.fill);
    } else if (variantStyle.stroke) {
      component.fills = [];
      await applyStrokeVariable(component, variantStyle.stroke, variantStyle.strokeWidth || 1);
    } else {
      // Ghost: kein Fill
      component.fills = [];
    }

    // Text
    var buttonText = figma.createText();
    buttonText.name = 'Label';
    buttonText.characters = 'Button';
    buttonText.fontSize = sizeTokens.fontSize;
    buttonText.fontName = { family: 'Inter', style: 'Semi Bold' };

    if (variantStyle.textColor) {
      var textVar = await findColorVariable(variantStyle.textColor);
      if (textVar) {
        var textPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
        var boundTextPaint = figma.variables.setBoundVariableForPaint(textPaint, 'color', textVar);
        buttonText.fills = [boundTextPaint];
      }
    }

    component.appendChild(buttonText);

    // Disabled State
    if (state === 'disabled') {
      component.opacity = 0.5;
    }
  }

  // --- CHECKBOX ---
  else if (componentName === 'Checkbox') {
    // WICHTIG: FIXED sizing für quadratische Form
    component.layoutMode = 'NONE';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';
    component.resize(sizeTokens.height, sizeTokens.height);

    if (state === 'unchecked') {
      // Transparenter Hintergrund mit Border
      component.fills = [];
      await applyStrokeVariable(component, 'border/border', sizeTokens.borderWidth || 2);
    } else if (state === 'checked') {
      // Primary Fill
      await applyFillVariable(component, 'primary/primary');

      // Checkmark
      var checkmark = await createCheckmarkVector(sizeTokens.iconSize || 14);
      component.appendChild(checkmark);

      // Checkmark zentrieren
      checkmark.x = (sizeTokens.height - checkmark.width) / 2;
      checkmark.y = (sizeTokens.height - checkmark.height) / 2;

      // Shadow
      component.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0.231, g: 0.51, b: 0.965, a: 0.25 },
        offset: { x: 0, y: 2 },
        radius: 4,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      }];
    } else if (state === 'indeterminate') {
      // Primary Fill
      await applyFillVariable(component, 'primary/primary');

      // Indeterminate Line
      var indeterminateLine = await createIndeterminateLine(sizeTokens.iconSize || 14);
      component.appendChild(indeterminateLine);
      indeterminateLine.x = (sizeTokens.height - indeterminateLine.width) / 2;
      indeterminateLine.y = (sizeTokens.height - indeterminateLine.height) / 2;
    } else if (state === 'disabled') {
      component.fills = [];
      await applyStrokeVariable(component, 'border/border', sizeTokens.borderWidth || 2);
      component.opacity = 0.5;
    }
  }

  // --- SWITCH ---
  else if (componentName === 'Switch') {
    // WICHTIG: FIXED sizing
    component.layoutMode = 'NONE';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';

    var trackWidth = sizeTokens.width || 50;
    var trackHeight = sizeTokens.height;
    component.resize(trackWidth, trackHeight);

    var isOn = state === 'on';

    if (isOn) {
      await applyFillVariable(component, 'primary/primary');
      component.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0.231, g: 0.51, b: 0.965, a: 0.2 },
        offset: { x: 0, y: 1 },
        radius: 3,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      }];
    } else {
      await applyFillVariable(component, 'background/backgroundMuted');
    }

    // Thumb
    var thumb = createSwitchThumb(trackHeight, isOn, trackWidth);
    component.appendChild(thumb);

    if (state === 'disabled') {
      component.opacity = 0.5;
    }
  }

  // --- BADGE ---
  else if (componentName === 'Badge') {
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisAlignItems = 'CENTER';
    component.counterAxisAlignItems = 'CENTER';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'FIXED';
    component.paddingLeft = sizeTokens.paddingHorizontal;
    component.paddingRight = sizeTokens.paddingHorizontal;
    component.paddingTop = sizeTokens.paddingVertical;
    component.paddingBottom = sizeTokens.paddingVertical;

    // Fill basierend auf Variant
    if (variantStyle.fill) {
      await applyFillVariable(component, variantStyle.fill);
    } else if (variantStyle.stroke) {
      component.fills = [];
      await applyStrokeVariable(component, variantStyle.stroke, variantStyle.strokeWidth || 1);
    }

    // Text
    var badgeText = figma.createText();
    badgeText.name = 'Label';
    badgeText.characters = 'Badge';
    badgeText.fontSize = sizeTokens.fontSize;
    badgeText.fontName = { family: 'Inter', style: 'Medium' };

    if (variantStyle.textColor) {
      var badgeTextVar = await findColorVariable(variantStyle.textColor);
      if (badgeTextVar) {
        var badgeTextPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
        var boundBadgeTextPaint = figma.variables.setBoundVariableForPaint(badgeTextPaint, 'color', badgeTextVar);
        badgeText.fills = [boundBadgeTextPaint];
      }
    }

    component.appendChild(badgeText);
  }

  // --- AVATAR ---
  else if (componentName === 'Avatar') {
    // WICHTIG: FIXED sizing für runde Form
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisAlignItems = 'CENTER';
    component.counterAxisAlignItems = 'CENTER';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';
    component.resize(sizeTokens.height, sizeTokens.height);

    // Fill
    await applyFillVariable(component, 'secondary/secondary');

    // Initials
    var avatarText = figma.createText();
    avatarText.name = 'Initials';
    avatarText.characters = 'JD';
    avatarText.fontSize = sizeTokens.fontSize;
    avatarText.fontName = { family: 'Inter', style: 'Semi Bold' };

    var avatarTextVar = await findColorVariable('secondary/secondaryForeground');
    if (avatarTextVar) {
      var avatarTextPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
      var boundAvatarTextPaint = figma.variables.setBoundVariableForPaint(avatarTextPaint, 'color', avatarTextVar);
      avatarText.fills = [boundAvatarTextPaint];
    }

    component.appendChild(avatarText);
  }

  // --- INPUT ---
  else if (componentName === 'Input') {
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisAlignItems = 'MIN';
    component.counterAxisAlignItems = 'CENTER';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';
    component.resize(240, sizeTokens.height);
    component.paddingLeft = sizeTokens.paddingHorizontal;
    component.paddingRight = sizeTokens.paddingHorizontal;
    component.itemSpacing = sizeTokens.gap;

    // Fill und Stroke
    await applyFillVariable(component, 'input/input');

    if (state === 'focused') {
      await applyStrokeVariable(component, 'primary/primary', 2);
    } else if (state === 'error') {
      await applyStrokeVariable(component, 'error/error', 1);
    } else {
      await applyStrokeVariable(component, 'input/inputBorder', sizeTokens.borderWidth || 1);
    }

    // Placeholder Text
    var inputText = figma.createText();
    inputText.name = 'Placeholder';
    inputText.characters = 'Enter text...';
    inputText.fontSize = sizeTokens.fontSize;
    inputText.fontName = { family: 'Inter', style: 'Regular' };

    var inputTextVar = await findColorVariable('foreground/foregroundMuted');
    if (inputTextVar) {
      var inputTextPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
      var boundInputTextPaint = figma.variables.setBoundVariableForPaint(inputTextPaint, 'color', inputTextVar);
      inputText.fills = [boundInputTextPaint];
    }

    component.appendChild(inputText);

    if (state === 'disabled') {
      component.opacity = 0.5;
    }
  }

  // --- CARD ---
  else if (componentName === 'Card') {
    component.layoutMode = 'VERTICAL';
    component.primaryAxisAlignItems = 'MIN';
    component.counterAxisAlignItems = 'MIN';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'FIXED';
    component.resize(sizeTokens.width || 320, 120);
    component.paddingLeft = sizeTokens.paddingHorizontal;
    component.paddingRight = sizeTokens.paddingHorizontal;
    component.paddingTop = sizeTokens.paddingVertical;
    component.paddingBottom = sizeTokens.paddingVertical;
    component.itemSpacing = sizeTokens.gap;

    // Fill und Stroke
    await applyFillVariable(component, 'card/card');
    await applyStrokeVariable(component, 'border/border', 1);

    // Shadow
    component.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 2 },
      radius: 8,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    }];

    // Title
    var cardTitle = figma.createText();
    cardTitle.name = 'Title';
    cardTitle.characters = 'Card Title';
    cardTitle.fontSize = 18;
    cardTitle.fontName = { family: 'Inter', style: 'Semi Bold' };

    var cardTitleVar = await findColorVariable('card/cardForeground');
    if (cardTitleVar) {
      var cardTitlePaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
      var boundCardTitlePaint = figma.variables.setBoundVariableForPaint(cardTitlePaint, 'color', cardTitleVar);
      cardTitle.fills = [boundCardTitlePaint];
    }

    // Description
    var cardDesc = figma.createText();
    cardDesc.name = 'Description';
    cardDesc.characters = 'Card description text';
    cardDesc.fontSize = 14;
    cardDesc.fontName = { family: 'Inter', style: 'Regular' };

    var cardDescVar = await findColorVariable('foreground/foregroundMuted');
    if (cardDescVar) {
      var cardDescPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
      var boundCardDescPaint = figma.variables.setBoundVariableForPaint(cardDescPaint, 'color', cardDescVar);
      cardDesc.fills = [boundCardDescPaint];
    }

    component.appendChild(cardTitle);
    component.appendChild(cardDesc);
  }

  // --- PROGRESS ---
  else if (componentName === 'Progress') {
    component.layoutMode = 'NONE';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';
    component.resize(sizeTokens.width || 200, sizeTokens.height);
    component.cornerRadius = sizeTokens.borderRadius;

    await applyFillVariable(component, 'background/backgroundMuted');

    // Progress Fill
    var progressFill = await createProgressFill(sizeTokens.width || 200, sizeTokens.height);
    component.appendChild(progressFill);
    progressFill.x = 0;
    progressFill.y = 0;
  }

  // --- SPINNER ---
  else if (componentName === 'Spinner') {
    component.layoutMode = 'NONE';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';
    component.resize(sizeTokens.height, sizeTokens.height);
    component.fills = [];

    var spinnerArc = await createSpinnerArc(sizeTokens.height);
    component.appendChild(spinnerArc);
    spinnerArc.x = 0;
    spinnerArc.y = 0;
  }

  // --- SEPARATOR ---
  else if (componentName === 'Separator') {
    component.layoutMode = 'NONE';
    component.primaryAxisSizingMode = 'FIXED';
    component.counterAxisSizingMode = 'FIXED';

    if (variant === 'horizontal') {
      component.resize(200, 1);
    } else {
      component.resize(1, 24);
    }

    await applyFillVariable(component, 'border/border');
  }

  // --- LABEL ---
  else if (componentName === 'Label') {
    component.layoutMode = 'HORIZONTAL';
    component.primaryAxisSizingMode = 'AUTO';
    component.counterAxisSizingMode = 'AUTO';
    component.fills = [];

    var labelText = figma.createText();
    labelText.name = 'Text';
    labelText.characters = 'Label';
    labelText.fontSize = sizeTokens.fontSize;
    labelText.fontName = { family: 'Inter', style: 'Medium' };

    var labelColor = 'foreground/foreground';
    if (stateStyle.textColor) {
      labelColor = stateStyle.textColor;
    } else if (variantStyle.textColor) {
      labelColor = variantStyle.textColor;
    }

    var labelTextVar = await findColorVariable(labelColor);
    if (labelTextVar) {
      var labelTextPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } } as SolidPaint;
      var boundLabelTextPaint = figma.variables.setBoundVariableForPaint(labelTextPaint, 'color', labelTextVar);
      labelText.fills = [boundLabelTextPaint];
    }

    component.appendChild(labelText);

    if (state === 'disabled') {
      component.opacity = 0.5;
    }
  }

  return component;
}

/**
 * Erstellt ein Component Set mit allen Variants
 */
async function createComponentSet(
  definition: ComponentDefinition
): Promise<{ componentSet: ComponentSetNode; variantCount: number }> {
  var combinations = generateVariantCombinations(definition);

  var variants: ComponentNode[] = [];

  for (var i = 0; i < combinations.length; i++) {
    var variant = await createVariantFrame(definition, combinations[i]);
    variants.push(variant);
  }

  var componentSet = figma.combineAsVariants(variants, figma.currentPage);
  componentSet.name = definition.name;
  componentSet.description = definition.description;

  componentSet.layoutMode = 'HORIZONTAL';
  componentSet.layoutWrap = 'WRAP';
  componentSet.itemSpacing = 20;
  componentSet.counterAxisSpacing = 20;
  componentSet.paddingLeft = 20;
  componentSet.paddingRight = 20;
  componentSet.paddingTop = 20;
  componentSet.paddingBottom = 20;
  componentSet.primaryAxisSizingMode = 'AUTO';
  componentSet.counterAxisSizingMode = 'AUTO';

  return { componentSet: componentSet, variantCount: variants.length };
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Generiert alle mcellui Components in Figma
 */
export async function generateAllComponents(): Promise<GenerateResult> {
  var errors: string[] = [];
  var componentsCreated = 0;
  var variantsCreated = 0;

  var xOffset = 0;
  var yOffset = 0;
  var spacing = 100;

  for (var i = 0; i < allComponents.length; i++) {
    var definition = allComponents[i];
    try {
      var result = await createComponentSet(definition);

      result.componentSet.x = xOffset;
      result.componentSet.y = yOffset;
      xOffset += result.componentSet.width + spacing;

      componentsCreated++;
      variantsCreated += result.variantCount;
    } catch (error) {
      var message = error instanceof Error ? error.message : 'Fehler bei ' + definition.name;
      errors.push(message);
      console.error('Error creating ' + definition.name + ':', error);
    }
  }

  return {
    success: errors.length === 0,
    componentsCreated: componentsCreated,
    variantsCreated: variantsCreated,
    errors: errors,
  };
}

/**
 * Generiert einen einzelnen Component
 */
export async function generateComponent(
  componentName: string
): Promise<GenerateResult> {
  var definition = componentsByName[componentName];

  if (!definition) {
    return {
      success: false,
      componentsCreated: 0,
      variantsCreated: 0,
      errors: ['Component "' + componentName + '" nicht gefunden'],
    };
  }

  try {
    var result = await createComponentSet(definition);

    var center = figma.viewport.center;
    result.componentSet.x = center.x - result.componentSet.width / 2;
    result.componentSet.y = center.y - result.componentSet.height / 2;

    return {
      success: true,
      componentsCreated: 1,
      variantsCreated: result.variantCount,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      componentsCreated: 0,
      variantsCreated: 0,
      errors: [error instanceof Error ? error.message : 'Unbekannter Fehler'],
    };
  }
}

/**
 * Prüft ob mcellui Components bereits existieren
 */
export async function checkExistingComponents(): Promise<{
  exists: boolean;
  componentNames: string[];
}> {
  var existingNames: string[] = [];

  for (var i = 0; i < allComponents.length; i++) {
    var definition = allComponents[i];
    var existing = figma.currentPage.findOne(
      function(node) { return node.type === 'COMPONENT_SET' && node.name === definition.name; }
    );

    if (existing) {
      existingNames.push(definition.name);
    }
  }

  return {
    exists: existingNames.length > 0,
    componentNames: existingNames,
  };
}

/**
 * Löscht alle mcellui Components
 */
export async function deleteExistingComponents(): Promise<void> {
  for (var i = 0; i < allComponents.length; i++) {
    var definition = allComponents[i];
    var existing = figma.currentPage.findOne(
      function(node) { return node.type === 'COMPONENT_SET' && node.name === definition.name; }
    );

    if (existing) {
      existing.remove();
    }
  }
}

/**
 * Gibt Liste aller verfügbaren Components zurück
 */
export function getAvailableComponents(): string[] {
  return allComponents.map(function(c) { return c.name; });
}
