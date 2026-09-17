'use client';

import { useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { SectionTitle } from './ui/SectionTitle';
import { SECTION_GRADIENT_BLACK_TO_NAVY, SECTION_INNER_CLASS } from '@/constants/sectionLayout';

const Education = () => {
  const t = useTranslations('education');
  const [isOrtOpen, setIsOrtOpen] = useState(false);

  const handleToggleOrt = () => {
    setIsOrtOpen((prev) => !prev);
  };

  const handleOrtKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleOrt();
    }
  };

  const ortEntries = [
    {
      id: 'analista',
      period: t('analista.period'),
      title: t('analista.title'),
    },
    {
      id: 'devops',
      period: t('devops.period'),
      title: t('devops.title'),
    },
    {
      id: 'programador',
      period: t('programador.period'),
      title: t('programador.title'),
    },
    {
      id: 'web',
      period: t('web.period'),
      title: t('web.title'),
    },
  ];

  const otherEntries = [
    {
      id: 'ingenieria',
      period: t('ingenieria.period'),
      title: t('ingenieria.title'),
      institution: t('ingenieria.institution'),
      location: t('ingenieria.location'),
    },
    {
      id: 'bachillerato',
      period: t('bachillerato.period'),
      title: t('bachillerato.title'),
      institution: t('bachillerato.institution'),
      location: t('bachillerato.location'),
    },
  ];

  return (
    <section
      id="education"
      className="relative scroll-mt-20 overflow-hidden border-t border-zinc-800/70 py-16 sm:py-20"
      style={{
        background: SECTION_GRADIENT_BLACK_TO_NAVY,
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className={SECTION_INNER_CLASS}>
          <SectionTitle title={t('title')} index="04" className="mb-12" />

          <div className="relative border-l border-zinc-800 pl-8">
            <div className="pb-10">
              <button
                type="button"
                onClick={handleToggleOrt}
                onKeyDown={handleOrtKeyDown}
                aria-expanded={isOrtOpen}
                aria-label={t('ort.institution')}
                className="group w-full text-left"
              >
                <p className="font-mono text-xs text-zinc-500">{t('ort.period')}</p>
                <p className="mt-2 text-lg text-zinc-100">
                  {t('ort.institution')}
                  <span className="ml-2 text-sm text-zinc-500">
                    {t('ort.location')}
                  </span>
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-500 group-hover:text-zinc-400">
                  {isOrtOpen ? '–' : '+'}
                </p>
              </button>

              {isOrtOpen && (
                <ul className="mt-4 space-y-3 border-t border-zinc-800/80 pt-4">
                  {ortEntries.map((entry) => (
                    <li key={entry.id} className="text-sm leading-relaxed text-zinc-400">
                      <span className="font-mono text-xs text-zinc-500">{entry.period}</span>
                      <span className="mt-0.5 block text-zinc-300">{entry.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {otherEntries.map((entry) => (
              <div key={entry.id} className="pb-10 last:pb-0">
                <p className="font-mono text-xs text-zinc-500">{entry.period}</p>
                <p className="mt-2 text-lg text-zinc-100">{entry.title}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {entry.institution}
                  {entry.location ? ` · ${entry.location}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
