'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

const Header = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: newLocale });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '#about', label: t('about') },
    { href: '#projects', label: t('projects') },
    { href: '#studies', label: t('studies') },
    { href: '#contact', label: t('contact') },
    { href: '#education', label: t('education') },
  ];

  const socialLinks = [
    {
      href: 'https://github.com/gastonvar',
      label: 'GitHub',
      icon: (
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/in/gaston-varela-78a299357/',
      label: 'LinkedIn',
      icon: (
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8 relative">
        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </a>
          ))}

          {/* CV and Escolaridad Links */}
          <div className="ml-4 flex items-center gap-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
            <a
              href={locale === 'es' ? '/Curriculum/CV_PFP_ES.pdf' : '/Curriculum/CV_EN.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              {t('cv')}
            </a>
            <a
              href="/Escolaridad/Escolaridad.png"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              {t('education')}
            </a>
          </div>

          {/* Social Links */}
          <div className="ml-4 flex items-center gap-4 border-l border-zinc-200 pl-4 dark:border-zinc-800">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Language Toggle */}
          <button
            onClick={handleLanguageToggle}
            className="ml-4 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            aria-label="Toggle language"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
        </div>

        {/* Mobile Menu Button - Right aligned */}
        <div className="flex items-center gap-4 md:hidden absolute right-4">
          {/* Language Toggle - Mobile */}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            aria-label="Toggle language"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          <button
            onClick={handleToggleMenu}
            className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black md:hidden">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {link.label}
              </a>
            ))}

            {/* CV and Escolaridad Links - Mobile */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <a
                href={locale === 'es' ? '/Curriculum/CV_PFP_ES.pdf' : '/Curriculum/CV_EN.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseMenu}
                className="block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {t('cv')}
              </a>
              <a
                href="/Escolaridad/Escolaridad.png"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseMenu}
                className="block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {t('education')}
              </a>
            </div>

            {/* Social Links - Mobile */}
            <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
