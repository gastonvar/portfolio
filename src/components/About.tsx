'use client';

import { useTranslations } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import HoverableText from './HoverableText';

const About = () => {
  const t = useTranslations('about');
  const { primaryColor } = useColors();

  return (
    <section id="about" className="relative py-20 bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {t('title')}
          </h2>
          
          <div className="space-y-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              {t('greeting')}{' '}
              <HoverableText
                primaryColor={primaryColor}
                secondaryColor={primaryColor}
                defaultColor="rgb(37, 99, 235)"
                className="font-semibold"
              >
                {t('name')}
              </HoverableText>
              .
            </p>
            
            <p>
              {t('currentStatus')}
            </p>
            
            <p>
              {t('description')}
            </p>
          </div>

          <div className="pt-4">
            <a
              href="/Curriculum/Gaston-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: primaryColor,
                color: 'white',
              }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t('downloadCV')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
