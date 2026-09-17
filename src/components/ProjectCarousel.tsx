'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useColors } from '@/contexts/ColorContext';

export type ProjectItem = {
  id: string;
  image?: string;
  images?: string[];
  title: string;
  description: string;
  role?: string;
  stack?: string;
};

const getPreviewDescription = (description: string) => {
  return description.replace(/\s+/g, ' ').trim();
};

const ImageGallery = ({ images, title, primaryColor }: { images: string[]; title: string; primaryColor: string }) => {
  const [current, setCurrent] = useState(0);
  const hasMultipleImages = images.length > 1;

  const handleSelectImage = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <div className="relative h-full w-full">
        <Image
          src={images[current]}
          alt={`${title} - Image ${current + 1}`}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 90vw, 50vw"
          unoptimized
          priority={current === 0}
        />
      </div>

      {hasMultipleImages && (
        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-0.5 rounded-full bg-black/40 px-1 py-0.5 backdrop-blur-sm">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleSelectImage(idx);
              }}
              className="flex h-7 w-7 items-center justify-center"
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === current ? 'true' : undefined}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-5' : 'w-1.5'
                }`}
                style={{
                  backgroundColor: idx === current ? primaryColor : 'rgba(255, 255, 255, 0.55)',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

type ProjectCarouselProps = {
  projects: ProjectItem[];
  resetKey?: string;
};

export const ProjectCarousel = ({ projects, resetKey }: ProjectCarouselProps) => {
  const t = useTranslations('projects');
  const { primaryColor } = useColors();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [scrollSnapCount, setScrollSnapCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const hasMultipleProjects = projects.length > 1;
  const canNavigate = scrollSnapCount > 1;

  useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(0);

    const frame = window.requestAnimationFrame(() => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setScrollSnapCount(api.scrollSnapList().length);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [resetKey, api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateState = () => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setScrollSnapCount(api.scrollSnapList().length);
    };

    updateState();
    api.on('select', updateState);
    api.on('reInit', updateState);
    api.on('resize', updateState);

    return () => {
      api.off('select', updateState);
      api.off('reInit', updateState);
      api.off('resize', updateState);
    };
  }, [api]);

  const handleScrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  const handlePreviousProject = () => {
    api?.scrollPrev();
  };

  const handleNextProject = () => {
    api?.scrollNext();
  };

  return (
    <div className={hasMultipleProjects ? 'w-full' : 'mx-auto w-full max-w-3xl'}>
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: 'start',
          containScroll: 'trimSnaps',
          slidesToScroll: 'auto',
        }}
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {projects.map((project) => (
            <CarouselItem
              key={project.id}
              className={
                hasMultipleProjects
                  ? 'basis-[88%] pl-3 sm:basis-[85%] sm:pl-4 md:basis-1/2'
                  : 'basis-full pl-3 sm:pl-4'
              }
            >
              <Card className="relative flex h-full flex-col overflow-hidden rounded-none border-zinc-800 bg-transparent shadow-none">
                <div className="flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 sm:aspect-[16/9]">
                    {project.images && project.images.length > 0 ? (
                      <ImageGallery
                        images={project.images}
                        title={project.title}
                        primaryColor={primaryColor}
                      />
                    ) : project.image ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 768px) 90vw, 50vw"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-xs font-medium text-zinc-500 sm:text-sm">
                          {t('noImage')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <CardHeader className="space-y-1 p-0">
                      <CardTitle className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
                        {project.title}
                      </CardTitle>
                      {project.role && (
                        <p className="text-xs font-medium text-zinc-500">
                          {project.role}
                        </p>
                      )}
                      <CardDescription className="pt-2 text-xs leading-relaxed text-zinc-400 line-clamp-4 sm:text-sm">
                        {getPreviewDescription(project.description)}
                      </CardDescription>
                    </CardHeader>

                    {project.stack && (
                      <CardContent className="mt-auto px-0 pb-0 pt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {project.stack.split(', ').map((tech: string) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="border-zinc-800 bg-zinc-900/40 px-2 py-0.5 text-[10px] font-medium text-zinc-400 sm:text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {canNavigate && (
        <div className="mt-5 flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={handlePreviousProject}
            disabled={!canScrollPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-zinc-50 disabled:opacity-30"
            aria-label="Previous project"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex justify-center" role="tablist" aria-label="Project slides">
            {Array.from({ length: scrollSnapCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleScrollTo(index)}
                className="flex h-8 w-8 items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current ? 'true' : undefined}
                role="tab"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === current ? 'w-5' : 'w-1.5'
                  }`}
                  style={{
                    backgroundColor: index === current ? primaryColor : 'rgba(255, 255, 255, 0.28)',
                  }}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextProject}
            disabled={!canScrollNext}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-zinc-50 disabled:opacity-30"
            aria-label="Next project"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
