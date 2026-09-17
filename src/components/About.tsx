'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import { SectionTitle } from './ui/SectionTitle';
import { SECTION_GRADIENT_NAVY_TO_BLACK, SECTION_INNER_CLASS } from '@/constants/sectionLayout';

const techGroups = [
  { key: 'frontend' as const, accent: 'primary' as const },
  { key: 'backend' as const, accent: 'secondary' as const },
  { key: 'devops' as const, accent: 'mixed' as const },
];

const About = () => {
  const t = useTranslations('about');
  const locale = useLocale();
  const { primaryColor } = useColors();

  const cvHref = locale === 'es' ? '/Curriculum/CV_PFP_ES.pdf' : '/Curriculum/CV_EN.pdf';

  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden border-t border-zinc-800/70 py-16 sm:py-20"
      style={{
        background: SECTION_GRADIENT_NAVY_TO_BLACK,
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className={SECTION_INNER_CLASS}>
          <SectionTitle title={t('title')} index="03" className="mb-12" />

          <div className="grid gap-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-16 lg:gap-20">
            <div className="space-y-5 text-[17px] leading-8 text-zinc-300">
              <p>{t('p1')}</p>
              <p>{t('p2')}</p>
              <p>{t('p3')}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm">
                <a
                  href={cvHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition-colors hover:decoration-current"
                  style={{ textDecorationColor: primaryColor }}
                >
                  {t('cvTitle')} ↗
                </a>
                <a
                  href="/Escolaridad/Escolaridad.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition-colors hover:decoration-current"
                >
                  {t('escolaridadTitle')} ↗
                </a>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  {t('languages.title')}
                </h3>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li>{t('languages.spanish')}</li>
                  <li>
                    <a
                      href="https://cert.efset.org/6upzXT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-zinc-50"
                    >
                      {t('languages.english')} ↗
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  {t('technologies.title')}
                </h3>
                <div className="space-y-5">
                  {techGroups.map((group) => (
                    <div key={group.key}>
                      <p className="mb-1.5 text-sm text-zinc-200">
                        {t(`technologies.${group.key}.title`)}
                      </p>
                      <p className="text-[13px] leading-6 text-zinc-500">
                        {t(`technologies.${group.key}.list`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
