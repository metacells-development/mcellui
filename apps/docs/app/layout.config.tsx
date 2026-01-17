import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: 'mcellui',
  },
  links: [
    {
      text: 'Docs',
      url: '/docs',
    },
    {
      text: 'Components',
      url: '/docs/components',
    },
    {
      text: 'Blocks',
      url: '/blocks',
    },
  ],
  githubUrl: 'https://github.com/metacells/mcellui',
};
