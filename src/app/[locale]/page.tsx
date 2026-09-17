import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import DeployedPersonalProjects from '@/components/DeployedPersonalProjects';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <DeployedPersonalProjects />
      <About />
      <Education />
      <Contact />
    </main>
  );
}
