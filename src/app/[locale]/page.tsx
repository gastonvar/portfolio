import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Projects section placeholder */}
      <section id="projects" className="min-h-screen bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Projects Section
          </h2>
        </div>
      </section>
    </main>
  );
}
