import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Education from '@/components/Education';

export default function Home() {
  return (
    <main className="relative">
      <section className="sticky-section z-10">
        <Hero />
      </section>
      <section className="sticky-section z-20">
        <Projects />
      </section>
      <section className="sticky-section z-30">
        <About />
      </section>
      <section className="sticky-section z-40">
        <Education />
      </section>
    </main>
  );
}
