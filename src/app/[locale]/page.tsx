import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Education from '@/components/Education';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Projects />
      <About />
      <Education />
    </main>
  );
}
