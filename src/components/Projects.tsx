'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useColors } from '@/contexts/ColorContext';
import { SectionTitle } from './ui/SectionTitle';
import { SECTION_CONTENT_CLASS, SECTION_GRADIENT_NAVY_TO_BLACK, SECTION_INNER_CLASS, SECTION_SHELL_CLASS } from '@/constants/sectionLayout';
import { ProjectCarousel, type ProjectItem } from './ProjectCarousel';

type TabButtonProps = {
  isActive: boolean;
  onClick: () => void;
  label: string;
  primaryColor: string;
};

const TabButton = ({ isActive, onClick, label, primaryColor }: TabButtonProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className="shrink-0 pb-1 text-xs sm:text-sm"
      style={
        isActive
          ? {
              boxShadow: `inset 0 -1px 0 ${primaryColor}`,
              color: 'rgb(250 250 249)',
            }
          : {
              boxShadow: 'none',
              color: 'rgb(113 113 122)',
            }
      }
    >
      {label}
    </button>
  );
};

const Projects = () => {
  const t = useTranslations('projects');
  const { primaryColor } = useColors();
  const [activeTab, setActiveTab] = useState<'professional' | 'university'>('professional');
  const [universityCategory, setUniversityCategory] = useState<'programacion' | 'disenoWeb' | 'baseDatos'>('programacion');

  const professionalProjects: ProjectItem[] = [
    {
      id: 'algorico',
      image: '/TrabajosReales/Freelance/AlgoRico/1.png',
      title: t('algorico.title'),
      description: t('algorico.description'),
      role: t('algorico.role'),
      stack: t('algorico.stack'),
    },
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
      image: '/TrabajosReales/Auren/Horizon.png',
      title: t('horizon.title'),
      description: t('horizon.description'),
      role: t('horizon.role'),
      stack: t('horizon.stack'),
    },
  ];

  const programmingProjects: ProjectItem[] = [
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
    },
  ];

  const webDesignProjects: ProjectItem[] = [
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

  const databaseProjects: ProjectItem[] = [
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
    },
  ];

  const getUniversityProjects = () => {
    switch (universityCategory) {
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

  const handleProfessionalTab = () => {
    setActiveTab('professional');
  };

  const handleUniversityTab = () => {
    setActiveTab('university');
  };

  const handleProgramacionCategory = () => {
    setUniversityCategory('programacion');
  };

  const handleDisenoWebCategory = () => {
    setUniversityCategory('disenoWeb');
  };

  const handleBaseDatosCategory = () => {
    setUniversityCategory('baseDatos');
  };

  return (
    <section
      id="projects"
      className={SECTION_SHELL_CLASS}
      style={{
        background: SECTION_GRADIENT_NAVY_TO_BLACK,
      }}
    >
      <div className={SECTION_CONTENT_CLASS}>
        <div className={SECTION_INNER_CLASS}>
          <SectionTitle
            title={
              activeTab === 'professional'
                ? t('title')
                : t('university.title')
            }
            subtitle={
              activeTab === 'professional'
                ? t('subtitle')
                : t('university.subtitle')
            }
            index="01"
            className="mb-8"
          />

          <div
            className="mb-8 flex gap-6"
            role="tablist"
            aria-label={t('title')}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'professional'}
              onClick={handleProfessionalTab}
              className="pb-1 text-sm transition-colors"
              style={
                activeTab === 'professional'
                  ? {
                      boxShadow: `inset 0 -1px 0 ${primaryColor}`,
                      color: 'rgb(250 250 249)',
                    }
                  : {
                      boxShadow: 'none',
                      color: 'rgb(113 113 122)',
                    }
              }
            >
              {t('tabProfessional')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'university'}
              onClick={handleUniversityTab}
              className="pb-1 text-sm transition-colors"
              style={
                activeTab === 'university'
                  ? {
                      boxShadow: `inset 0 -1px 0 ${primaryColor}`,
                      color: 'rgb(250 250 249)',
                    }
                  : {
                      boxShadow: 'none',
                      color: 'rgb(113 113 122)',
                    }
              }
            >
              {t('university.tab')}
            </button>
          </div>

          {activeTab === 'university' && (
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:gap-5 sm:overflow-visible">
              <div className="flex min-w-max gap-5 sm:min-w-0 sm:flex-wrap">
                <TabButton
                  isActive={universityCategory === 'programacion'}
                  onClick={handleProgramacionCategory}
                  label={t('personal.programacion.title')}
                  primaryColor={primaryColor}
                />
                <TabButton
                  isActive={universityCategory === 'disenoWeb'}
                  onClick={handleDisenoWebCategory}
                  label={t('personal.disenoWeb.title')}
                  primaryColor={primaryColor}
                />
                <TabButton
                  isActive={universityCategory === 'baseDatos'}
                  onClick={handleBaseDatosCategory}
                  label={t('personal.baseDatos.title')}
                  primaryColor={primaryColor}
                />
              </div>
            </div>
          )}

          <ProjectCarousel
            projects={
              activeTab === 'professional'
                ? professionalProjects
                : getUniversityProjects()
            }
            resetKey={`${activeTab}-${universityCategory}`}
          />
        </div>
      </div>
    </section>
  );
};

export default Projects;
