'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import HoverableText from './HoverableText';
import { Card, CardContent } from '@/components/ui/card';

const Education = () => {
  const t = useTranslations('education');
  const { primaryColor, secondaryColor } = useColors();
  const [isOrtOpen, setIsOrtOpen] = useState(false);

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
      color: '#3B82F6', // Blue - UDELAR
    },
    {
      id: 'bachillerato',
      period: t('bachillerato.period'),
      title: t('bachillerato.title'),
      institution: t('bachillerato.institution'),
      location: t('bachillerato.location'),
      color: '#F97316', // Orange - Liceo
    },
  ];

  return (
    <section
      id="education"
      className="relative block flex min-h-screen items-center bg-gradient-to-b from-white to-zinc-50 py-20 dark:from-black dark:to-zinc-950"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <HoverableText
              as="h2"
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              defaultColor="rgb(98, 250, 215)"
              className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
            >
              {t('title')}
            </HoverableText>
            <div
              className="mx-auto h-1 w-24 rounded-full transition-all duration-300"
              style={{
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              }}
            />
          </div>

          {/* Education Timeline */}
          <div className="space-y-6">
            {/* ORT Uruguay - Dropdown */}
            <Card className="group relative overflow-hidden border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-white shadow-lg transition-all duration-500 hover:shadow-xl dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
              <CardContent className="p-6 sm:p-8">
                <button
                  onClick={() => setIsOrtOpen(!isOrtOpen)}
                  className="w-full text-left"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                    {/* Period - Show range from first to last */}
                    <div className="shrink-0">
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50 sm:text-xl">
                        {t('ort.period')}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex items-start justify-between gap-4">
                      <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-lg">
                        <span
                          className="font-semibold"
                          style={{ color: '#EF4444' }}
                        >
                          {t('ort.institution')}
                        </span>
                        {' - '}
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {t('ort.location')}
                        </span>
                      </p>
                      {/* Chevron Icon */}
                      <svg
                        className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 dark:text-zinc-400 ${
                          isOrtOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Dropdown Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOrtOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    {ortEntries.map((entry) => (
                      <div key={entry.id} className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:text-base">
                          {entry.period}:
                        </span>
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 sm:text-base">
                          {entry.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arrow after ORT */}
            <div className="flex justify-center py-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: primaryColor,
                }}
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300"
                  style={{ color: primaryColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Other Education Entries */}
            {otherEntries.map((entry, index) => (
              <div key={entry.id}>
                <Card className="group relative overflow-hidden border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-white shadow-lg transition-all duration-500 hover:shadow-xl dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                      {/* Period */}
                      <div className="shrink-0">
                        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50 sm:text-xl">
                          {entry.period}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-lg">
                          <span className="text-zinc-900 dark:text-zinc-50">{entry.title}</span>
                          {' - '}
                          <span
                            className="font-semibold"
                            style={{ color: entry.color }}
                          >
                            {entry.institution}
                          </span>
                          {entry.location && (
                            <>
                              {' - '}
                              <span className="text-zinc-600 dark:text-zinc-400">
                                {entry.location}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow between entries (not after the last one) */}
                {index < otherEntries.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300"
                      style={{
                        borderColor: primaryColor,
                      }}
                    >
                      <svg
                        className="h-5 w-5 transition-transform duration-300"
                        style={{ color: primaryColor }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
