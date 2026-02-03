'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import HoverableText from './HoverableText';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const t = useTranslations('contact');
  const { primaryColor, secondaryColor } = useColors();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'configError'>('idle');

  // Initialize EmailJS when component mounts
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    console.log('EmailJS Public Key check:', {
      exists: !!publicKey,
      length: publicKey?.length || 0,
      firstChars: publicKey?.substring(0, 10) || 'N/A'
    });
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      console.warn('EmailJS public key not found in environment variables');
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
    
    // Debug logging
    console.log('Environment check:', {
      publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : 'undefined',
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('EMAILJS')),
      hasPublicKey: !!publicKey
    });
    
    if (!publicKey) {
      console.error('EmailJS error: Public key is not configured. Please add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to your environment variables.');
      setSubmitStatus('error');
      setTimeout(() => {
        setIsSubmitting(false);
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }, 2000);
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
        // Wait for envelope to reach the end, then show success
        setTimeout(() => {
          setSubmitStatus('success');
          setIsSubmitting(false);
          setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
          // Reset status after 5 seconds
          setTimeout(() => setSubmitStatus('idle'), 5000);
        }, 2000);
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      // Stop envelope animation and show error
      setSubmitStatus('error');
      setTimeout(() => {
        setIsSubmitting(false);
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }, 2000);
    }
  };

  return (
    <section
      id="contact"
      className="relative block flex min-h-screen items-center bg-gradient-to-b from-black to-zinc-950 py-20 overflow-hidden"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
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
            <p className="mt-6 text-lg text-zinc-400">
              {t('subtitle')}
            </p>
          </div>

          {/* Contact Form */}
          <Card className="border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-lg transition-all duration-500 hover:shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Inputs - Side by Side */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="nombre"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      {t('name')}
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        '--tw-ring-color': primaryColor,
                        borderColor: 'inherit',
                      } as React.CSSProperties & { '--tw-ring-color': string }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                      }}
                      placeholder={t('namePlaceholder')}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        '--tw-ring-color': primaryColor,
                        borderColor: 'inherit',
                      } as React.CSSProperties & { '--tw-ring-color': string }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                      }}
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label
                    htmlFor="asunto"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    {t('subject')}
                  </label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      '--tw-ring-color': primaryColor,
                      borderColor: 'inherit',
                    } as React.CSSProperties & { '--tw-ring-color': string }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = primaryColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '';
                    }}
                    placeholder={t('subjectPlaceholder')}
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="mensaje"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    {t('message')}
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      '--tw-ring-color': primaryColor,
                      borderColor: 'inherit',
                    } as React.CSSProperties & { '--tw-ring-color': string }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = primaryColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '';
                    }}
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                {/* Submit Button / Envelope Animation */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {!isSubmitting && submitStatus === 'idle' ? (
                    <>
                      <Button
                        type="submit"
                        className="min-w-[120px] transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: primaryColor,
                          color: 'black',
                        }}
                      >
                        {t('send')}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => window.location.href = 'mailto:varelagaston58@gmail.com'}
                        className="min-w-[120px] transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: primaryColor,
                          color: 'black',
                        }}
                      >
                        {t('orDirectEmail')}
                      </Button>
                    </>
                  ) : isSubmitting ? (
                    <div className="relative w-full max-w-md overflow-hidden rounded-lg border-2 p-3" style={{
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    }}>
                      {/* Envelope Animation Container */}
                      <div className="relative h-16 w-full">
                        {/* Sending text with animated dots */}
                        <div className="absolute left-1/2 top-2 -translate-x-1/2 z-20">
                        </div>

                        {/* Envelope Track with dashed line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center" style={{ 
                          borderTop: `2px dashed ${primaryColor}30`,
                        }} />
                        
                        {/* Animated particles/sparkles behind envelope */}
                        {!submitStatus.includes('error') && [0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="absolute top-1/2"
                            style={{
                              animation: `particleFloat 2s ease-in-out infinite`,
                              animationDelay: `${i * 0.3}s`,
                              opacity: 0,
                            }}
                          >
                            <div
                              className="w-1 h-1 rounded-full"
                              style={{
                                backgroundColor: primaryColor,
                                boxShadow: `0 0 4px ${primaryColor}`,
                              }}
                            />
                          </div>
                        ))}

                        {/* Speed lines */}
                        {!submitStatus.includes('error') && (
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="absolute h-px"
                                style={{
                                  top: `${i * 8}px`,
                                  left: 0,
                                  width: '40px',
                                  background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)`,
                                  animation: 'speedLine 1.5s ease-in-out infinite',
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* Animated Envelope/Paper Plane */}
                        <div
                          className="absolute top-1/2 z-10"
                          style={{
                            left: submitStatus === 'error' ? '50%' : undefined,
                            transform: submitStatus === 'error' 
                              ? 'translate(-50%, -50%) rotate(45deg) scale(1.2)' 
                              : undefined,
                            animation: submitStatus === 'error' 
                              ? 'envelopeShake 0.6s ease-in-out infinite' 
                              : 'envelopeMove 2.5s ease-in-out infinite',
                            filter: submitStatus === 'error' ? 'none' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                          }}
                        >
                          {/* Paper plane with envelope hybrid */}
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="transition-all duration-300"
                            style={{
                              filter: submitStatus === 'error' ? 'none' : `drop-shadow(0 0 8px ${primaryColor}60)`,
                            }}
                          >
                            {/* Envelope body */}
                            <path
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              stroke={submitStatus === 'error' ? '#ef4444' : primaryColor}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill={submitStatus === 'error' ? '#fee2e2' : `${primaryColor}15`}
                            />
                            
                            {/* Envelope flap animation */}
                            <path
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
                              stroke={submitStatus === 'error' ? '#ef4444' : primaryColor}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                animation: submitStatus === 'error' ? 'none' : 'envelopeFlap 1s ease-in-out infinite',
                              }}
                            />
                            
                            {/* Motion lines when moving */}
                            {!submitStatus.includes('error') && (
                              <>
                                <line
                                  x1="-2"
                                  y1="10"
                                  x2="1"
                                  y2="10"
                                  stroke={primaryColor}
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  opacity="0.5"
                                  style={{
                                    animation: 'motionLine 0.8s ease-in-out infinite',
                                  }}
                                />
                                <line
                                  x1="-2"
                                  y1="14"
                                  x2="1"
                                  y2="14"
                                  stroke={primaryColor}
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  opacity="0.3"
                                  style={{
                                    animation: 'motionLine 0.8s ease-in-out infinite',
                                    animationDelay: '0.1s',
                                  }}
                                />
                              </>
                            )}
                          </svg>
                          
                          {/* Glow effect behind envelope */}
                          {!submitStatus.includes('error') && (
                            <div
                              className="absolute inset-0 -z-10 rounded-full blur-xl"
                              style={{
                                background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
                                animation: 'pulse 2s ease-in-out infinite',
                              }}
                            />
                          )}
                        </div>

                        {/* Error X mark overlay */}
                        {submitStatus === 'error' && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              className="animate-in zoom-in"
                            >
                              <circle cx="12" cy="12" r="11" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                              <path
                                d="M8 8l8 8M16 8l-8 8"
                                stroke="#ef4444"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div
                    className="relative overflow-hidden rounded-xl border-2 p-4 text-center shadow-lg transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                    style={{
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                      color: primaryColor,
                      boxShadow: `0 10px 40px -10px ${primaryColor}40, 0 0 20px ${primaryColor}20`,
                    }}
                  >
                    {/* Animated background gradient */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}00 0%, ${primaryColor}30 50%, ${primaryColor}00 100%)`,
                        animation: 'shimmer 3s ease-in-out infinite',
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-3">
                      {/* Success icon */}
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 animate-in zoom-in"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          animationDelay: '100ms',
                        }}
                      >
                        <svg
                          className="h-6 w-6 transition-all duration-500"
                          style={{ color: primaryColor }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                            style={{
                              strokeDasharray: 24,
                              strokeDashoffset: 24,
                              animation: 'drawCheck 0.6s ease-out forwards',
                              animationDelay: '200ms',
                            }}
                          />
                        </svg>
                      </div>
                      
                      {/* Success message */}
                      <div className="space-y-0.5 text-left flex-1">
                        <p
                          className="text-base font-semibold transition-all duration-500 animate-in fade-in"
                          style={{
                            animationDelay: '300ms',
                          }}
                        >
                          {t('success')}
                        </p>
                        <p
                          className="text-xs opacity-80 transition-all duration-500 animate-in fade-in"
                          style={{
                            animationDelay: '400ms',
                          }}
                        >
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-lg border-2 border-red-500 bg-red-950 p-4 text-center text-sm font-medium text-red-400">
                    {t('error')}
                  </div>
                )}

                {submitStatus === 'configError' && (
                  <div className="rounded-lg border-2 border-yellow-500 bg-yellow-950 p-4 text-center text-sm font-medium text-yellow-400">
                    {t('configError')}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
