import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative">
      <div className="section-wrapper">
        <section className="sticky-section z-10">
          <Hero />
        </section>
      </div>
      <div className="section-wrapper">
        <section className="sticky-section z-20">
          <Projects />
        </section>
      </div>
      <div className="section-wrapper">
        <section className="sticky-section z-30">
          <About />
        </section>
      </div>
      <div className="section-wrapper">
        <section className="sticky-section z-40">
          <Education />
        </section>
      </div>
      <div className="section-wrapper">
        <section className="sticky-section z-50">
          <Contact />
        </section>
      </div>
    </main>
  );
}
