'use client';

import { useTranslations } from 'next-intl';
import { SectionTitle } from './ui/SectionTitle';
import { SECTION_CONTENT_CLASS, SECTION_GRADIENT_BLACK_TO_NAVY, SECTION_INNER_CLASS, SECTION_SHELL_CLASS } from '@/constants/sectionLayout';
import { ProjectCarousel, type ProjectItem } from './ProjectCarousel';

const DeployedPersonalProjects = () => {
  const t = useTranslations('projects');

  const deployedProjects: ProjectItem[] = [
    {
      id: 'scheduly',
      image: '/trabajospersonales/Scheduly/1.png',
      title: t('scheduly.title'),
      description: t('scheduly.description'),
      stack: t('scheduly.stack'),
    },
    {
      id: 'ubuntuHomelab',
      image: '/trabajospersonales/ubuntuserver.png',
      title: t('homelab.ubuntu.title'),
      description: t('homelab.ubuntu.description'),
      stack: t('homelab.ubuntu.stack'),
    },
  ];

  return (
    <section
      id="personal-projects"
      className={SECTION_SHELL_CLASS}
      style={{
        background: SECTION_GRADIENT_BLACK_TO_NAVY,
      }}
    >
      <div className={SECTION_CONTENT_CLASS}>
        <div className={SECTION_INNER_CLASS}>
          <SectionTitle
            title={t('personalProjects.title')}
            subtitle={t('personalProjects.subtitle')}
            index="02"
            className="mb-10"
          />

          <ProjectCarousel projects={deployedProjects} />
        </div>
      </div>
    </section>
  );
};

export default DeployedPersonalProjects;
