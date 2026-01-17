import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import rehypePrettyCode from 'rehype-pretty-code';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
          keepBackground: false,
        },
      ],
    ],
  },
});
