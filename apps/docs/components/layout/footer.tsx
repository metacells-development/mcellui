import Link from 'next/link';
import { Github } from 'lucide-react';

const footerLinks = {
  docs: [
    { href: '/docs', label: 'Getting Started' },
    { href: '/docs/installation', label: 'Installation' },
    { href: '/docs/theming', label: 'Theming' },
    { href: '/docs/cli', label: 'CLI' },
  ],
  components: [
    { href: '/docs/components/button', label: 'Button' },
    { href: '/docs/components/card', label: 'Card' },
    { href: '/docs/components/input', label: 'Input' },
    { href: '/docs/components/dialog', label: 'Dialog' },
  ],
  community: [
    { href: 'https://github.com/metacells/mcellui', label: 'GitHub' },
    {
      href: 'https://github.com/metacells/mcellui/issues',
      label: 'Issues',
    },
    {
      href: 'https://github.com/metacells/mcellui/discussions',
      label: 'Discussions',
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container max-w-screen-2xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">mcellui</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Beautiful UI components for Expo & React Native. Copy-paste. You
              own the code.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <Link
                href="https://github.com/metacells/mcellui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Docs */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Documentation</h3>
            <ul className="space-y-3">
              {footerLinks.docs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Components */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Components</h3>
            <ul className="space-y-3">
              {footerLinks.components.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            Built by{' '}
            <Link
              href="https://www.metacells.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              metacells
            </Link>
            . The source code is available on{' '}
            <Link
              href="https://github.com/metacells/mcellui"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
