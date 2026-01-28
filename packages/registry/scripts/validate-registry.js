#!/usr/bin/env node

/**
 * Registry Validation Script
 *
 * Validates the mcellui registry.json against the JSON Schema and performs
 * additional checks for consistency and file existence.
 *
 * Usage: node scripts/validate-registry.js
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../registry.json');
const schemaPath = path.join(__dirname, '../registry.schema.json');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`Error loading ${filePath}: ${error.message}`, 'red');
    process.exit(1);
  }
}

function validateSchema(registry, schema) {
  const ajv = new Ajv({ allErrors: true, strictSchema: false });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(registry);

  if (!valid) {
    log('\nSchema Validation Errors:', 'red');
    validate.errors.forEach(error => {
      const instancePath = error.instancePath || '/';
      log(`  - ${instancePath}: ${error.message}`, 'red');
      if (error.params) {
        log(`    Details: ${JSON.stringify(error.params)}`, 'yellow');
      }
    });
    return false;
  }

  log('✓ Schema validation passed', 'green');
  return true;
}

function checkDuplicateNames(components) {
  const names = new Set();
  const duplicates = [];

  components.forEach(component => {
    if (names.has(component.name)) {
      duplicates.push(component.name);
    } else {
      names.add(component.name);
    }
  });

  if (duplicates.length > 0) {
    log('\nDuplicate Component Names:', 'red');
    duplicates.forEach(name => {
      log(`  - ${name}`, 'red');
    });
    return false;
  }

  log('✓ No duplicate component names', 'green');
  return true;
}

function checkRegistryDependencies(components) {
  const componentNames = new Set(components.map(c => c.name));
  const errors = [];

  components.forEach(component => {
    if (component.registryDependencies && component.registryDependencies.length > 0) {
      component.registryDependencies.forEach(dep => {
        if (!componentNames.has(dep)) {
          errors.push(`${component.name} references non-existent registry dependency: ${dep}`);
        }
      });
    }
  });

  if (errors.length > 0) {
    log('\nInvalid Registry Dependencies:', 'red');
    errors.forEach(error => {
      log(`  - ${error}`, 'red');
    });
    return false;
  }

  log('✓ All registry dependencies are valid', 'green');
  return true;
}

function checkFilesExist(components) {
  const errors = [];
  const registryDir = path.join(__dirname, '..');

  components.forEach(component => {
    component.files.forEach(file => {
      const filePath = path.join(registryDir, file);
      if (!fs.existsSync(filePath)) {
        errors.push(`${component.name}: File not found - ${file}`);
      }
    });
  });

  if (errors.length > 0) {
    log('\nMissing Files:', 'red');
    errors.forEach(error => {
      log(`  - ${error}`, 'red');
    });
    return false;
  }

  log('✓ All component files exist', 'green');
  return true;
}

function checkNamingConventions(components) {
  const errors = [];

  components.forEach(component => {
    // Check block suffix
    if (component.type === 'block' && !component.name.endsWith('-block')) {
      errors.push(`${component.name}: Block components must end with -block`);
    }

    // Check screen suffix
    if (component.type === 'screen' && !component.name.endsWith('-screen')) {
      errors.push(`${component.name}: Screen components must end with -screen`);
    }

    // Check kebab-case
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(component.name)) {
      errors.push(`${component.name}: Name must be in kebab-case`);
    }
  });

  if (errors.length > 0) {
    log('\nNaming Convention Errors:', 'red');
    errors.forEach(error => {
      log(`  - ${error}`, 'red');
    });
    return false;
  }

  log('✓ All naming conventions followed', 'green');
  return true;
}

function main() {
  log('\n=== mcellui Registry Validation ===\n', 'blue');

  // Load files
  log('Loading registry and schema...', 'blue');
  const registry = loadJSON(registryPath);
  const schema = loadJSON(schemaPath);

  log(`Found ${registry.components.length} components\n`, 'blue');

  // Run validations
  const results = [
    validateSchema(registry, schema),
    checkDuplicateNames(registry.components),
    checkNamingConventions(registry.components),
    checkRegistryDependencies(registry.components),
    checkFilesExist(registry.components),
  ];

  const allPassed = results.every(result => result === true);

  if (allPassed) {
    log('\n✓ All validations passed!', 'green');
    process.exit(0);
  } else {
    log('\n✗ Validation failed', 'red');
    process.exit(1);
  }
}

main();
