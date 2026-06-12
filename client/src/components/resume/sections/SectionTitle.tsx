import React from 'react';

interface SectionTitleProps {
  id: string;
  children: React.ReactNode;
}

/** Consistent section heading: small caps label over a hairline rule. */
export const SectionTitle: React.FC<SectionTitleProps> = ({ id, children }) => (
  <h2
    id={id}
    className="mb-4 border-b border-zinc-200 pb-2 text-xs font-semibold
      uppercase tracking-[0.15em] text-zinc-500"
  >
    {children}
  </h2>
);