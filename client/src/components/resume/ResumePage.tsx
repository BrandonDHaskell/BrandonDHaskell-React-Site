import React, { useCallback, useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import masterData from '../../data/resume.master.json';
import { useRoleSelection } from '../../hooks/useRoleSelection';
import { useResumeView } from '../../hooks/useResumeView';
import { ResumeData, RoleSelection } from '../../types/resume';
import { downloadResumePdf } from '../../utils/pdf/downloadPdf';

import { HeaderSection } from './sections/HeaderSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import {
  EducationSection,
  SkillsSection,
} from './sections/SkillsEducationSections';

// JSON import is typed via assertion; tsconfig needs "resolveJsonModule": true.
const resumeData = masterData as ResumeData;

interface ResumeBodyProps {
  selection: RoleSelection;
}

/** The full resume, rendered once a selection exists. */
const ResumeBody: React.FC<ResumeBodyProps> = ({ selection }) => {
  const view = useResumeView(resumeData, selection);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Gentle fade-in when transitioning from the gate (or on first paint).
  // motion-reduce: users who prefer reduced motion see content instantly.
  const [entered, setEntered] = useState<boolean>(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      await downloadResumePdf(view);
    } finally {
      setIsGenerating(false);
    }
  }, [view]);

  return (
    <main
      className={`mx-auto max-w-3xl px-4 py-10 transition-opacity duration-500
        motion-reduce:transition-none sm:px-6 sm:py-16
        print:max-w-none print:px-0 print:py-0
        ${entered ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Controls: actions only (never printed) */}
      <div className="mb-10 flex justify-end print:hidden">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-lg
            bg-zinc-900 dark:bg-zinc-100
            px-4 py-2 text-sm font-medium
            text-white dark:text-zinc-900
            transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300
            disabled:opacity-60
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {isGenerating ? 'Generating…' : 'Download PDF'}
        </button>
      </div>

      {/* The resume itself */}
      <div className="space-y-12 print:space-y-7">
        <HeaderSection view={view} />
        <ExperienceSection entries={view.experience} />
        <ProjectsSection projects={view.projects} />
        <SkillsSection groups={view.skills} />
        <EducationSection entries={view.education} />
      </div>
    </main>
  );
};

/**
 * Entry point. Routing logic:
 * - ?role= in URL or a remembered choice -> straight to the resume.
 * - Otherwise -> RoleGate ("What are you hiring for?").
 */
export const ResumePage: React.FC = () => {
  const { selection } = useRoleSelection();

  if (selection === null) {
    window.location.replace('/');
    return null;
  }

  return <ResumeBody selection={selection} />;
};