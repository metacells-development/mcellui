import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createMDXSource, resolveFiles } from 'fumadocs-mdx';

// Resolve files from the fumadocs-mdx generated source
const files = resolveFiles({ docs: docs.docs, meta: docs.meta });

export const source = loader({
  baseUrl: '/docs',
  source: { files },
});
