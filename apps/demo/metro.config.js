const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Import the mcellui metro plugin for auto-config discovery
const { withMcellUI } = require('@metacells/mcellui-metro-plugin');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const registryPath = path.resolve(monorepoRoot, 'packages/registry');

const config = getDefaultConfig(projectRoot);

// Only watch the monorepo, not parent directories
config.watchFolders = [monorepoRoot];

// Ensure we resolve from the correct node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Resolve @/components/* paths to packages/registry/*
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@/components/ui': path.resolve(registryPath, 'ui'),
  '@/components/blocks': path.resolve(registryPath, 'blocks'),
  '@/components/screens': path.resolve(registryPath, 'screens'),
};

// Wrap with mcellui for auto-config discovery
module.exports = withMcellUI(config);
