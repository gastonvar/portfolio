'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useColors } from '@/contexts/ColorContext';
import StarsBackground from './ui/StarsBackground';
import { SectionTitle } from './ui/SectionTitle';
import { ScrollButton } from './ui/ScrollButton';
import { ScrollIndicator } from './ui/ScrollIndicator';

const ImageGallery = ({ images, title, primaryColor }: { images: string[]; title: string; primaryColor: string }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="h-full w-full [&>*]:h-full"
      >
        <CarouselContent className="h-full -ml-0">
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-0 basis-full h-full">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              api?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border-2 bg-zinc-900/80 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            style={{ borderColor: `${primaryColor}40` }}
            aria-label="Previous image"
          >
            <svg
              className="h-4 w-4 text-zinc-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              api?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border-2 bg-zinc-900/80 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            style={{ borderColor: `${primaryColor}40` }}
            aria-label="Next image"
          >
            <svg
              className="h-4 w-4 text-zinc-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Image indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-6' : 'w-1.5'
                }`}
                style={{
                  backgroundColor: idx === current ? primaryColor : 'rgba(255, 255, 255, 0.5)',
                }}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Projects = () => {
  const t = useTranslations('projects');
  const { primaryColor, secondaryColor } = useColors();
  const [activeTab, setActiveTab] = useState<'professional' | 'personal'>('professional');
  const [personalCategory, setPersonalCategory] = useState<'programacion' | 'disenoWeb' | 'baseDatos'>('programacion');
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Reset carousel to first slide when tab or category changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
      setCurrentSlide(0);
      setCanScrollPrev(false);
      setCanScrollNext(true);
    }
  }, [activeTab, personalCategory, api]);

  // Track carousel position
  useEffect(() => {
    if (!api) {
      return;
    }

    const updateState = () => {
      setCurrentSlide(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    // Initial state
    updateState();
    
    // Listen for changes
    api.on('select', updateState);
    api.on('reInit', updateState);

    return () => {
      api.off('select', updateState);
      api.off('reInit', updateState);
    };
  }, [api]);

  const professionalProjects = [
    {
      id: 'blimann',
      image: '/TrabajosReales/Auren/Blimann.png',
      title: t('blimann.title'),
      description: t('blimann.description'),
      role: t('blimann.role'),
      stack: t('blimann.stack'),
    },
    {
      id: 'simois',
      image: '/TrabajosReales/Freelance/Simois/1.png',
      images: [
        '/TrabajosReales/Freelance/Simois/1.png',
        '/TrabajosReales/Freelance/Simois/2.png',
        '/TrabajosReales/Freelance/Simois/3.png',
        '/TrabajosReales/Freelance/Simois/4.png',
      ],
      title: t('simois.title'),
      description: t('simois.description'),
      role: t('simois.role'),
      stack: t('simois.stack'),
    },    
    {
      id: 'horizon',
      image: null,
      title: t('horizon.title'),
      description: t('horizon.description'),
      role: t('horizon.role'),
      stack: t('horizon.stack'),
    },
    {
      id: 'algorico',
      image: '/TrabajosReales/Freelance/Algorico/1.png',
      title: t('algorico.title'),
      description: t('algorico.description'),
      role: t('algorico.role'),
      stack: t('algorico.stack'),
    }
  ];

  const programmingProjects = [
    {
      id: 'votingApp',
      image: '/Programacion/DevOps/1.png',
      images: [
        '/Programacion/DevOps/1.png',
        '/Programacion/DevOps/2.png',
      ],
      title: t('personal.programacion.votingApp.title'),
      description: t('personal.programacion.votingApp.description'),
      stack: t('personal.programacion.votingApp.stack'),
    },
    {
      id: 'react',
      image: '/Programacion/REACT/babytracker.png',
      title: t('personal.programacion.react.title'),
      description: t('personal.programacion.react.description'),
      stack: t('personal.programacion.react.stack'),
    },
    {
      id: 'portfolioViejo',
      image: '/Programacion/PortfolioViejo/portfolioViejo.png',
      title: t('personal.programacion.portfolioViejo.title'),
      description: t('personal.programacion.portfolioViejo.description'),
      stack: t('personal.programacion.portfolioViejo.stack'),
    },
    {
      id: 'macro',
      image: '/Programacion/macro/macro.png',
      title: t('personal.programacion.macro.title'),
      description: t('personal.programacion.macro.description'),
    },
    {
      id: 'apiRest',
      image: '/Programacion/P3/API.png',
      title: t('personal.programacion.apiRest.title'),
      description: t('personal.programacion.apiRest.description'),
      stack: t('personal.programacion.apiRest.stack'),
    },
    {
      id: 'censo2023',
      image: '/Programacion/CensoP1/wallpaper.png',
      title: t('personal.programacion.censo2023.title'),
      description: t('personal.programacion.censo2023.description'),
      stack: t('personal.programacion.censo2023.stack'),
    },
    {
      id: 'socialNetwork',
      image: '/Programacion/social.network/wallpaper.png',
      title: t('personal.programacion.socialNetwork.title'),
      description: t('personal.programacion.socialNetwork.description'),
      stack: t('personal.programacion.socialNetwork.stack'),
    }
  ];

  const webDesignProjects = [
    {
        id: 'obligatorio',
        image: '/DisenoWeb/obligatorio.png',
        title: t('personal.disenoWeb.obligatorio.title'),
        description: t('personal.disenoWeb.obligatorio.description'),
      },
    {
      id: 'dominosPizza',
      image: '/DisenoWeb/DominosPizza.png',
      title: t('personal.disenoWeb.dominosPizza.title'),
      description: t('personal.disenoWeb.dominosPizza.description'),
    },
    {
      id: 'muebles',
      image: '/DisenoWeb/Muebles.png',
      title: t('personal.disenoWeb.muebles.title'),
      description: t('personal.disenoWeb.muebles.description'),
    },
    {
      id: 'navidad',
      image: '/DisenoWeb/Navidad.png',
      title: t('personal.disenoWeb.navidad.title'),
      description: t('personal.disenoWeb.navidad.description'),
    },
    {
      id: 'paris',
      image: '/DisenoWeb/Paris.png',
      title: t('personal.disenoWeb.paris.title'),
      description: t('personal.disenoWeb.paris.description'),
    },
    {
      id: 'pullBear',
      image: '/DisenoWeb/Pull&Bear.png',
      title: t('personal.disenoWeb.pullBear.title'),
      description: t('personal.disenoWeb.pullBear.description'),
    },
    {
      id: 'wimbledon',
      image: '/DisenoWeb/Wimbledon.png',
      title: t('personal.disenoWeb.wimbledon.title'),
      description: t('personal.disenoWeb.wimbledon.description'),
    },
  ];

  const databaseProjects = [
    {
        id: 'restauranteInspection',
        image: '/BD/obligatorioPS/wallpaper.png',
        title: t('personal.baseDatos.restauranteInspection.title'),
        description: t('personal.baseDatos.restauranteInspection.description'),
        stack: t('personal.baseDatos.restauranteInspection.stack'),
      },
    {
      id: 'redSocial',
      image: '/BD/obligatorioPS/wallpaper.png',
      title: t('personal.baseDatos.redSocial.title'),
      description: t('personal.baseDatos.redSocial.description'),
      stack: t('personal.baseDatos.redSocial.stack'),
    }
  ];

  const getPersonalProjects = () => {
    switch (personalCategory) {
      case 'programacion':
        return programmingProjects;
      case 'disenoWeb':
        return webDesignProjects;
      case 'baseDatos':
        return databaseProjects;
      default:
        return programmingProjects;
    }
  };

  const renderProjects = (projects: any[]) => {
    return (
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {projects.map((project, index) => (
            <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-2/3">
              <Card className="group relative h-full overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-xl transition-all duration-500 hover:shadow-2xl">
                {/* Animated gradient border effect */}
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                    zIndex: 0,
                  }}
                />

                <div className="relative z-10 flex flex-col gap-4 p-5 pb-4">
                  {/* Image Section */}
                  <div className="relative aspect-[16/9] w-full max-h-64 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-inner">

                    {(project as any).images && Array.isArray((project as any).images) && (project as any).images.length > 0 ? (
                      <ImageGallery 
                        images={(project as any).images} 
                        title={project.title}
                        primaryColor={primaryColor}
                      />
                    ) : project.image ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center transition-transform duration-300 group-hover:scale-110">
                          <div 
                            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:shadow-xl"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}30, ${secondaryColor}30)`,
                            }}
                          >
                            <svg
                              className="h-10 w-10 text-zinc-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-zinc-400">
                            {t('noImage')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col space-y-3">
                    <CardHeader className="px-0 pt-0">
                      <div className="mb-2 flex flex-wrap items-start gap-3">
                        <CardTitle className="flex-1 text-xl font-bold tracking-tight text-zinc-50">
                          {project.title}
                        </CardTitle>
                        {project.role && (
                          <Badge 
                            variant="secondary" 
                            className="shrink-0 border px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-300 group-hover:shadow-md"
                            style={{
                              borderColor: `${primaryColor}40`,
                              backgroundColor: `${primaryColor}10`,
                            }}
                          >
                            {project.role}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0 pb-0">
                      {/* Tech Stack Section */}
                      {project.stack && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-1 w-1 rounded-full"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <h4 className="text-sm font-semibold text-zinc-300">
                              {t('techStack')}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.stack.split(', ').map((tech: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border-zinc-700 bg-zinc-900/50 px-3 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-zinc-600 hover:shadow-md"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious 
            className="left-4 border-2 bg-zinc-900 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl"
            style={{
              borderColor: `${primaryColor}40`,
            }}
          />
        )}
        {canScrollNext && (
          <CarouselNext 
            className="right-4 border-2 bg-zinc-900 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl"
            style={{
              borderColor: `${primaryColor}40`,
            }}
          />
        )}
      </Carousel>
    );
  };

  return (
    <section
      id="projects"
      className="relative block flex min-h-screen items-center overflow-hidden py-8"
      style={{
        background: 'linear-gradient(to bottom, #050510, #0a0a1a, #000000)',
      }}
    >
      {/* Stars Background */}
      <StarsBackground starCount={150} showComets={true} />
      
      {/* Fade transition from Hero section */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(5, 5, 16, 1), rgba(5, 5, 16, 0.6), transparent)',
        }}
      />
      
      {/* Fade transition to next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
        }}
      />
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-25">
        <SectionTitle
          title={activeTab === 'professional' ? t('title') : t('personal.title')}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          subtitle={activeTab === 'professional' ? t('subtitle') : t('personal.subtitle')}
          className="mb-4 text-center"
        />

        {/* Tab Navigation */}
        <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button
            onClick={() => setActiveTab('professional')}
            variant={activeTab === 'professional' ? 'default' : 'outline'}
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 transition-all duration-300"
            style={
              activeTab === 'professional'
                ? {
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    color: '#000000',
                  }
                : {
                    borderColor: `${primaryColor}40`,
                  }
            }
          >
            {t('title')}
          </Button>
          <Button
            onClick={() => setActiveTab('personal')}
            variant={activeTab === 'personal' ? 'default' : 'outline'}
            className="text-xs sm:text-sm px-3 sm:px-4 py-2 transition-all duration-300"
            style={
              activeTab === 'personal'
                ? {
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    color: '#000000',
                  }
                : {
                    borderColor: `${primaryColor}40`,
                  }
            }
          >
            {t('personal.title')}
          </Button>
        </div>

        {/* Personal Projects Category Tabs */}
        {activeTab === 'personal' && (
          <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              onClick={() => setPersonalCategory('programacion')}
              variant={personalCategory === 'programacion' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300"
              style={
                personalCategory === 'programacion'
                  ? {
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      color: '#000000',
                    }
                  : {
                      borderColor: `${primaryColor}40`,
                    }
              }
            >
              {t('personal.programacion.title')}
            </Button>
            <Button
              onClick={() => setPersonalCategory('disenoWeb')}
              variant={personalCategory === 'disenoWeb' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300"
              style={
                personalCategory === 'disenoWeb'
                  ? {
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      color: '#000000',
                    }
                  : {
                      borderColor: `${primaryColor}40`,
                    }
              }
            >
              {t('personal.disenoWeb.title')}
            </Button>
            <Button
              onClick={() => setPersonalCategory('baseDatos')}
              variant={personalCategory === 'baseDatos' ? 'default' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-300"
              style={
                personalCategory === 'baseDatos'
                  ? {
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      color: '#000000',
                    }
                  : {
                      borderColor: `${primaryColor}40`,
                    }
              }
            >
              {t('personal.baseDatos.title')}
            </Button>
          </div>
        )}

        {/* Projects Carousel */}
        {activeTab === 'professional' 
          ? renderProjects(professionalProjects)
          : renderProjects(getPersonalProjects())
        }

        {/* Scroll to About Section Button */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <ScrollButton
            targetId="about"
            label={t('scrollToAbout')}
            primaryColor={primaryColor}
            ariaLabel={t('scrollToAbout')}
          />
          
          {/* Scroll indicator */}
          <ScrollIndicator primaryColor={primaryColor} />
        </div>
      </div>
    </section>
  );
};

export default Projects;
