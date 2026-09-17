'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import { Button } from '@/components/ui/button';
import emailjs from '@emailjs/browser';
import { SectionTitle } from './ui/SectionTitle';
import { FormField } from './ui/FormField';
import { SECTION_GRADIENT_NAVY_TO_BLACK, SECTION_INNER_CLASS } from '@/constants/sectionLayout';

const Contact = () => {
  const t = useTranslations('contact');
  const { primaryColor } = useColors();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'configError'>('idle');

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!publicKey) {
      setSubmitStatus('configError');
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    try {
      const result = await emailjs.send(
        'service_5xe9weg',
        'template_ktuglou',
        {
          asunto: formData.asunto,
          email: formData.email,
          nombre: formData.nombre,
          mensaje: formData.mensaje,
        }
      );

      if (result.text === 'OK') {
        setSubmitStatus('success');
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-zinc-800/70 py-16 sm:py-20"
      style={{
        background: SECTION_GRADIENT_NAVY_TO_BLACK,
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className={SECTION_INNER_CLASS}>
          <div className="grid gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 lg:gap-20">
            <div>
              <SectionTitle
                title={t('title')}
                subtitle={t('subtitle')}
                index="05"
                className="mb-8"
              />
              <a
                href="mailto:varelagaston58@gmail.com"
                className="font-mono text-sm text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-200"
              >
                {t('emailDirect')}
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  label={t('name')}
                  placeholder={t('namePlaceholder')}
                  primaryColor={primaryColor}
                />

                <FormField
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  label={t('email')}
                  placeholder={t('emailPlaceholder')}
                  primaryColor={primaryColor}
                />
              </div>

              <FormField
                id="asunto"
                name="asunto"
                type="text"
                value={formData.asunto}
                onChange={handleChange}
                required
                label={t('subject')}
                placeholder={t('subjectPlaceholder')}
                primaryColor={primaryColor}
              />

              <FormField
                id="mensaje"
                name="mensaje"
                type="textarea"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows={3}
                label={t('message')}
                placeholder={t('messagePlaceholder')}
                primaryColor={primaryColor}
              />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-none px-5"
                  style={{
                    backgroundColor: primaryColor,
                    color: '#111',
                  }}
                >
                  {isSubmitting ? t('sending') : t('send')}
                </Button>
                <a
                  href="mailto:varelagaston58@gmail.com"
                  className="text-sm text-zinc-500 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-300"
                >
                  {t('orDirectEmail')}
                </a>
              </div>

              {submitStatus === 'success' && (
                <p className="text-sm" style={{ color: primaryColor }}>
                  {t('success')}
                </p>
              )}

              {submitStatus === 'error' && (
                <p className="text-sm text-red-400">{t('error')}</p>
              )}

              {submitStatus === 'configError' && (
                <p className="text-sm text-amber-400">{t('configError')}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
