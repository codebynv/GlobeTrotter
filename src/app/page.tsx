import Link from 'next/link';
import { Compass, Map, DollarSign, Calendar, Share2, Sparkles, ArrowRight, CheckCircle, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageContainer } from '@/components/layout/PageContainer';

export default function Home() {
  const features = [
    {
      icon: Map,
      title: 'Multi-City Itineraries',
      description: 'Effortlessly organize stops, transport between cities, and day-by-day travel schedules in one timeline.',
    },
    {
      icon: DollarSign,
      title: 'Intelligent Budgeting',
      description: 'Set total spending goals, categorize accommodation, dining, and activities, and eliminate surprise expenses.',
    },
    {
      icon: Calendar,
      title: 'Visual Trip Planning',
      description: 'Switch seamlessly between timeline views, calendar schedules, and categorized activity boards.',
    },
    {
      icon: Share2,
      title: 'Seamless Trip Sharing',
      description: 'Generate instant read-only share links to showcase your travel blueprints to friends and co-travelers.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/70 via-transparent to-transparent dark:from-blue-950/30" />
        <PageContainer className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 backdrop-blur-xs dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Modern Travel-Tech Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-3xl mx-auto leading-tight">
            Plan, Budget & Experience{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Multi-City Journeys
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            GlobeTrotter transforms complex wanderlust into organized itineraries. Add stops, discover curated local activities, balance your budget, and share your adventures.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/trips/new">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg shadow-blue-500/20">
                Start Planning Free
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Highlights Grid */}
      <section>
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Built for Modern Explorers
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Everything you need to orchestrate unforgettable journeys across multiple destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} hoverEffect className="p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* CTA Section */}
      <section>
        <PageContainer>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Map Out Your Next Escape?
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                Join travelers worldwide crafting seamless itineraries with GlobeTrotter.
              </p>
              <div className="pt-2">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-none font-semibold">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
