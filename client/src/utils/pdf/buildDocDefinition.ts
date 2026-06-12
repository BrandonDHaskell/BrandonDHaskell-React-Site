import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { ResumeView } from '../../types/resume';

/** "2023-01" -> "Jan 2023"; null -> "Present" */
const fmtDate = (iso: string | null): string => {
  if (iso === null) return 'Present';
  const [year, month] = iso.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = Number(month) - 1;
  return `${names[idx] ?? ''} ${year}`.trim();
};

/**
 * Pure function: ResumeView -> pdfmake document definition.
 *
 * Deliberately conservative layout: single column, real text, standard
 * fonts. ATS parsers reward boring. Keep the premium design on the web view.
 */
export const buildDocDefinition = (view: ResumeView): TDocumentDefinitions => {
  const { profile } = view;

  const contactLine = [profile.email, profile.location, profile.website, profile.github]
    .filter(Boolean)
    .join('  |  ');

  const sectionHeader = (text: string): Content => ({
    text: text.toUpperCase(),
    style: 'sectionHeader',
  });

  const experience: Content[] = view.experience.flatMap((entry) => [
    {
      columns: [
        { text: `${entry.title} — ${entry.company}`, style: 'entryTitle' },
        {
          text: `${fmtDate(entry.start)} – ${fmtDate(entry.end)}`,
          style: 'entryDates',
          alignment: 'right' as const,
        },
      ],
      margin: [0, 8, 0, 2] as [number, number, number, number],
    },
    {
      ul: entry.bullets.map((b) => b.text),
      style: 'bullets',
    },
  ]);

  const projects: Content[] = view.projects.flatMap((p) => [
    {
      text: [
        { text: p.name, style: 'entryTitle' },
        { text: `   ${p.stack.join(' · ')}`, style: 'stack' },
      ],
      margin: [0, 8, 0, 2] as [number, number, number, number],
    },
    { text: p.description, style: 'body' },
    ...(p.highlights.length > 0
      ? [{ ul: p.highlights.map((h) => h.text), style: 'bullets' } as Content]
      : []),
  ]);

  const skills: Content = {
    stack: view.skills.map((group) => ({
      text: [
        { text: `${group.category}:  `, bold: true },
        { text: group.items.join(', ') },
      ],
      style: 'body',
      margin: [0, 2, 0, 0] as [number, number, number, number],
    })),
  };

  const education: Content[] = view.education.map((e) => ({
    columns: [
      { text: `${e.credential} — ${e.institution}`, style: 'body' },
      { text: e.year ?? '', style: 'entryDates', alignment: 'right' as const },
    ],
    margin: [0, 2, 0, 0] as [number, number, number, number],
  }));

  return {
    pageSize: 'LETTER',
    pageMargins: [48, 48, 48, 48],
    info: {
      title: `${profile.name} — ${view.roleLabel} Resume`,
      author: profile.name,
    },
    content: [
      { text: profile.name, style: 'name' },
      { text: view.headline, style: 'headline' },
      { text: contactLine, style: 'contact' },
      sectionHeader('Summary'),
      { text: view.summary, style: 'body' },
      sectionHeader('Experience'),
      ...experience,
      sectionHeader('Projects'),
      ...projects,
      sectionHeader('Skills'),
      skills,
      sectionHeader('Education'),
      ...education,
    ],
    styles: {
      name: { fontSize: 22, bold: true },
      headline: { fontSize: 11, color: '#444444', margin: [0, 2, 0, 0] },
      contact: { fontSize: 9, color: '#666666', margin: [0, 4, 0, 0] },
      sectionHeader: {
        fontSize: 10,
        bold: true,
        color: '#222222',
        margin: [0, 14, 0, 4],
        decoration: 'underline',
        decorationColor: '#dddddd',
      },
      entryTitle: { fontSize: 10.5, bold: true },
      entryDates: { fontSize: 9, color: '#666666' },
      stack: { fontSize: 8.5, color: '#888888' },
      body: { fontSize: 9.5, lineHeight: 1.25 },
      bullets: { fontSize: 9.5, lineHeight: 1.25, margin: [0, 2, 0, 0] },
    },
    defaultStyle: { fontSize: 9.5 },
  };
};
