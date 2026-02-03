'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import HoverableText from './HoverableText';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StarsBackground from './StarsBackground';
import { SectionTitle } from './ui/SectionTitle';
import { ScrollButton } from './ui/ScrollButton';
import { ScrollIndicator } from './ui/ScrollIndicator';

// Technology icon mapping
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase().trim();
  
  const iconMap: Record<string, React.ReactElement> = {
    html: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18l-8.5 2.5L2.5 2.5L21.5 2.5L20.5 20.5L12 18z" fill="#E34F26"/>
        <path d="M12 4.5L4.5 4.5L5 16.5L12 18L19 16.5L19.5 4.5L12 4.5z" fill="#EF652A"/>
        <path d="M7 7.5L7.5 13.5L12 14.5L16.5 13.5L17 7.5L7 7.5z" fill="#FFFFFF"/>
      </svg>
    ),
    css: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18l-8.5 2.5L2.5 2.5L21.5 2.5L20.5 20.5L12 18z" fill="#1572B6"/>
        <path d="M12 4.5L4.5 4.5L5 16.5L12 18L19 16.5L19.5 4.5L12 4.5z" fill="#33A9DC"/>
        <path d="M7 7.5L7.5 13.5L12 14.5L16.5 13.5L17 7.5L7 7.5z" fill="#FFFFFF"/>
      </svg>
    ),
    javascript: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
        <path d="M8 18H6V6h2v12zm4-6h-2v6h2v-6zm4 0h-2v6h2v-6z" fill="#000"/>
      </svg>
    ),
    react: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="11" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(-60 12 12)"/>
      </svg>
    ),
    nextjs: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7L2 17L12 22L22 17L22 7L12 2Z" fill="#000"/>
        <path d="M12 2L2 7L2 17L12 22L22 17L22 7L12 2Z" fill="#FFF"/>
      </svg>
    ),
    tailwind: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6C9.33 6 7.67 7.33 7 10C7.67 8.67 8.5 8.17 9.5 8.5C10.26 8.69 10.81 9.25 11.41 9.85C12.39 10.85 13.5 12 16 12C18.67 12 20.33 10.67 21 8C20.33 9.33 19.5 9.83 18.5 9.5C17.74 9.31 17.19 8.75 16.59 8.15C15.61 7.15 14.5 6 12 6ZM7 12C4.33 12 2.67 13.33 2 16C2.67 14.67 3.5 14.17 4.5 14.5C5.26 14.69 5.81 15.25 6.41 15.85C7.39 16.85 8.5 18 11 18C13.67 18 15.33 16.67 16 14C15.33 15.33 14.5 15.83 13.5 15.5C12.74 15.31 12.19 14.75 11.59 14.15C10.61 13.15 9.5 12 7 12Z" fill="#38BDF8"/>
      </svg>
    ),
    bootstrap: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#7952B3"/>
        <path d="M8 8h8v8H8V8z" fill="#7952B3"/>
      </svg>
    ),
    'c#': (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#239120"/>
        <path d="M12 4.5L4.5 8v8L12 19.5l7.5-3.5V8L12 4.5z" fill="#68217A"/>
      </svg>
    ),
    java: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.851 18.56s-.817.537.596.786c1.414.25 2.045.228 3.675.12 1.63-.108 3.003-.12 4.504-.24 1.501-.12 2.593-.537 2.593-.537v-1.367s-1.006.537-2.236.716c-1.23.18-2.236.18-3.675.18-1.44 0-2.593-.18-3.863-.537-.637-.18-1.006-.18-1.594-.12zm-.12-2.593s-.955.716.537.955c1.492.24 2.593.24 4.264.24 1.67 0 3.003-.12 4.264-.24 1.26-.12 2.236-.537 2.236-.537v-1.367s-1.006.537-2.236.716c-1.23.18-2.236.18-3.675.18-1.44 0-2.593-.18-3.863-.537-.637-.18-1.006-.18-1.594-.12zm1.006-2.593s-1.006.716.358.955c1.365.24 2.593.24 4.264.24 1.67 0 3.003-.12 4.264-.24 1.26-.12 2.236-.537 2.236-.537v-1.367s-1.006.537-2.236.716c-1.23.18-2.236.18-3.675.18-1.44 0-2.593-.18-3.863-.537-.637-.18-1.006-.18-1.594-.12z" fill="#ED8B00"/>
      </svg>
    ),
    sql: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#336791"/>
        <path d="M12 4.5L4.5 8v8L12 19.5l7.5-3.5V8L12 4.5z" fill="#000"/>
      </svg>
    ),
    mongodb: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#47A248"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#47A248"/>
      </svg>
    ),
    nodejs: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#339933"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#339933"/>
      </svg>
    ),
    docker: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#2496ED"/>
      </svg>
    ),
    aws: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#FF9900"/>
      </svg>
    ),
    azure: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#0078D4"/>
      </svg>
    ),
    github: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.578 9.578 0 0112 6.04c.85.004 1.705.115 2.504.337 1.909-1.29 2.747-1.02 2.747-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z" fill="#181717"/>
      </svg>
    ),
  };

  // Try exact match first
  if (iconMap[techLower]) {
    return iconMap[techLower];
  }

  // Try partial matches
  if (techLower.includes('html')) return iconMap.html;
  if (techLower.includes('css')) return iconMap.css;
  if (techLower.includes('javascript') || techLower.includes('js')) return iconMap.javascript;
  if (techLower.includes('react')) return iconMap.react;
  if (techLower.includes('next')) return iconMap.nextjs;
  if (techLower.includes('tailwind')) return iconMap.tailwind;
  if (techLower.includes('bootstrap')) return iconMap.bootstrap;
  if (techLower.includes('c#') || techLower.includes('csharp')) return iconMap['c#'];
  if (techLower.includes('java') && !techLower.includes('javascript')) return iconMap.java;
  if (techLower.includes('sql')) return iconMap.sql;
  if (techLower.includes('mongo')) return iconMap.mongodb;
  if (techLower.includes('node')) return iconMap.nodejs;
  if (techLower.includes('docker')) return iconMap.docker;
  if (techLower.includes('aws')) return iconMap.aws;
  if (techLower.includes('azure')) return iconMap.azure;
  if (techLower.includes('github')) return iconMap.github;

  // Default icon
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 22V12"/>
      <path d="M2 7l10 5 10-5"/>
    </svg>
  );
};

const About = () => {
  const t = useTranslations('about');
  const locale = useLocale();
  const { primaryColor, secondaryColor } = useColors();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section id="about" className="relative block flex min-h-screen items-center overflow-hidden py-20" style={{
      background: 'linear-gradient(to bottom, #000000, #0a0a1a, #050510)',
    }}>
      {/* Stars Background */}
      <StarsBackground starCount={150} showComets={true} />
      
      {/* Fade transition from Projects section */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.6), transparent)',
        }}
      />
      
      {/* Fade transition to next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgba(5, 5, 16, 0.8), transparent)',
        }}
      />
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header Section - Enhanced */}
          <SectionTitle
            title={t('title')}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            className="mb-6"
          />
          
          {/* Introduction Card - Inspired by Projects cards */}
          <Card className="group relative mb-6 overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <CardContent className="relative z-10 p-8 sm:p-10">
              <div className="space-y-6 text-lg leading-relaxed text-zinc-300">
                <p className="text-2xl font-medium sm:text-3xl">
                  {t('greeting')}{' '}
                  <HoverableText
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    defaultColor="rgb(98, 250, 215)"
                    className="font-bold"
                  >
                    {t('name')}
                  </HoverableText>
                  .
                </p>
                <p className="text-base leading-8 sm:text-lg">{t('description')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Languages & Technologies Grid */}
          <div className="mb-6 grid gap-8 md:grid-cols-2">
            {/* Languages Card */}
            <Card className="group relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-lg transition-all duration-500 hover:shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}30, ${secondaryColor}30)`,
                    }}
                  >
                    <svg
                      className="h-6 w-6 text-zinc-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-50">
                    {t('languages.title')}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3 transition-colors duration-300 hover:bg-zinc-800">
                    <div 
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-base font-medium text-zinc-300">
                      {t('languages.spanish')}
                    </span>
                  </div>
                  <a
                    href="https://cert.efset.org/6upzXT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-800 hover:shadow-md"
                  >
                    <div 
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <span 
                      className="text-base font-medium transition-colors"
                      style={{ color: primaryColor }}
                    >
                      {t('languages.english')}
                    </span>
                    <svg
                      className="ml-auto h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Download CV and Escolaridad Card */}
            <Card className="group relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-lg transition-all duration-500 hover:shadow-xl">
              <CardContent className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                  {/* CV Link */}
                  <a
                    href={locale === 'es' ? '/Curriculum/CV_PFP_ES.pdf' : '/Curriculum/CV_EN.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/icon flex flex-col items-center gap-4 transition-all duration-300 hover:scale-110"
                  >
                    <div 
                      className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    >
                      <svg
                        className="h-10 w-10 text-white transition-transform duration-200 group-hover/icon:translate-y-1"
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
                    </div>
                    <h3 className="text-xl font-bold text-zinc-50">
                      {t('cvTitle')}
                    </h3>
                  </a>

                  {/* Escolaridad Link */}
                  <a
                    href="/Escolaridad/Escolaridad.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/icon flex flex-col items-center gap-4 transition-all duration-300 hover:scale-110"
                  >
                    <div 
                      className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                      }}
                    >
                      <svg
                        className="h-10 w-10 text-white transition-transform duration-200 group-hover/icon:translate-y-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-50">
                      {t('escolaridadTitle')}
                    </h3>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technologies Section - Enhanced with hover states */}
          <Card className="relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-xl transition-all duration-500 hover:shadow-2xl">
            <CardContent className="p-8 sm:p-10">
              <div className="mb-2 text-center">
                <h3 className="mb-2 text-3xl font-bold text-zinc-50">
                  {t('technologies.title')}
                </h3>
                <div 
                  className="mx-auto h-1 w-16 rounded-full transition-all duration-300"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>

              <div className="">
                {/* Frontend */}
                <div 
                  className="group/category rounded-xl p-6 transition-all duration-300"
                  onMouseEnter={() => setHoveredCategory('frontend')}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    backgroundColor: hoveredCategory === 'frontend' ? `${primaryColor}05` : 'transparent',
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div 
                      className="h-1 w-8 rounded-full transition-all duration-300 group-hover/category:w-12"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <h4 className="text-xl font-bold text-zinc-200">
                      {t('technologies.frontend.title')}
                    </h4>
                    <div 
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {t('technologies.frontend.list').split(', ').map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="inline-flex items-center gap-2 border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        style={{
                          borderColor: `${primaryColor}40`,
                        }}
                      >
                        <span className="transition-transform duration-300 hover:rotate-12">
                          {getTechIcon(tech)}
                        </span>
                        <span>{tech}</span>
                      </Badge>
                    ))}
                  </div>
                  
                </div>

                {/* Backend */}
                <div 
                  className="group/category rounded-xl p-6 transition-all duration-300"
                  onMouseEnter={() => setHoveredCategory('backend')}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    backgroundColor: hoveredCategory === 'backend' ? `${secondaryColor}05` : 'transparent',
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div 
                      className="h-1 w-8 rounded-full transition-all duration-300 group-hover/category:w-12"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <h4 className="text-xl font-bold text-zinc-200">
                      {t('technologies.backend.title')}
                    </h4>
                    <div 
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: secondaryColor }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {t('technologies.backend.list').split(', ').map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="inline-flex items-center gap-2 border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        style={{
                          borderColor: `${secondaryColor}40`,
                        }}
                      >
                        <span className="transition-transform duration-300 hover:rotate-12">
                          {getTechIcon(tech)}
                        </span>
                        <span>{tech}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* DevOps & Tools */}
                <div 
                  className="group/category rounded-xl p-6 transition-all duration-300"
                  onMouseEnter={() => setHoveredCategory('devops')}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    backgroundColor: hoveredCategory === 'devops' ? `${primaryColor}05` : 'transparent',
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div 
                      className="h-1 w-8 rounded-full transition-all duration-300 group-hover/category:w-12"
                      style={{ 
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    />
                    <h4 className="text-xl font-bold text-zinc-200">
                      {t('technologies.devops.title')}
                    </h4>
                    <div 
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ 
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {t('technologies.devops.list').split(', ').map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="inline-flex items-center gap-2 border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        style={{
                          borderColor: `${primaryColor}40`,
                        }}
                      >
                        <span className="transition-transform duration-300 hover:rotate-12">
                          {getTechIcon(tech)}
                        </span>
                        <span>{tech}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scroll to Education Section Button */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <ScrollButton
            targetId="education"
            label={t('scrollToEducation')}
            primaryColor={primaryColor}
            ariaLabel={t('scrollToEducation')}
          />
          
          {/* Scroll indicator */}
          <ScrollIndicator primaryColor={primaryColor} />
        </div>
      </div>
    </section>
  );
};

export default About;
