export const scrollToSection = (targetId?: string) => {
  if (!targetId || targetId === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const element = document.getElementById(targetId);
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
