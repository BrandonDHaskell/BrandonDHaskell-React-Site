import React from 'react';
import { Globe, Link2, Mail, MapPin } from 'lucide-react';
import { ResumeView } from '../../../types/resume';

interface HeaderSectionProps {
  view: ResumeView;
}

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  /** When set, print.css appends this after the label on paper. */
  printHref?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = React.memo(
  ({ view }) => {
    const { profile } = view;

    const contacts: ContactItem[] = [
      {
        icon: <Mail className="h-4 w-4" aria-hidden="true" />,
        label: profile.email,
        href: `mailto:${profile.email}`,
      },
      {
        icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
        label: profile.location,
      },
      {
        icon: <Globe className="h-4 w-4" aria-hidden="true" />,
        label: profile.website.replace(/^https?:\/\//, ''),
        href: profile.website,
      },
      {
        icon: <Link2 className="h-4 w-4" aria-hidden="true" />,
        label: 'GitHub',
        href: profile.github,
        printHref: profile.github.replace(/^https?:\/\//, ''),
      },
      {
        icon: <Link2 className="h-4 w-4" aria-hidden="true" />,
        label: 'LinkedIn',
        href: profile.linkedin,
        printHref: profile.linkedin.replace(/^https?:\/\//, ''),
      },
    ];

    return (
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {profile.name}
        </h1>
        <p className="mt-1 text-lg text-zinc-600">{view.headline}</p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
          {contacts.map((c) => (
            <li key={c.label} className="flex items-center gap-1.5">
              {c.icon}
              {c.href ? (
                <a
                  href={c.href}
                  data-print-href={c.printHref}
                  className="hover:text-zinc-900 hover:underline"
                  target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                >
                  {c.label}
                </a>
              ) : (
                <span>{c.label}</span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-zinc-700">{view.summary}</p>
      </header>
    );
  },
);

HeaderSection.displayName = 'HeaderSection';