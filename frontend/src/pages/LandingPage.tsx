import heroImage from '../assets/hero.png';

const FEATURES = [
  {
    icon: '📦',
    title: 'Asset Tracking',
    description:
      'Register every laptop, vehicle and machine with serial numbers, categories and live status.',
  },
  {
    icon: '🔄',
    title: 'Allocations & Bookings',
    description:
      'Assign assets to employees or departments, and let teams book shared equipment ahead of time.',
  },
  {
    icon: '🛠️',
    title: 'Maintenance',
    description:
      'Schedule preventive maintenance and log repairs so nothing breaks down unnoticed.',
  },
  {
    icon: '📋',
    title: 'Audits & Reports',
    description:
      'Run periodic audits and export reports on utilization, value and depreciation in one click.',
  },
];

const STEPS = [
  {
    step: '1',
    title: 'Register your assets',
    description: 'Import or add assets with their category, serial number and value.',
  },
  {
    step: '2',
    title: 'Allocate to your team',
    description: 'Hand out equipment to employees and track who holds what.',
  },
  {
    step: '3',
    title: 'Stay in control',
    description: 'Get notified about maintenance, returns and audit deadlines.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 px-6 py-4 shadow-sm backdrop-blur md:px-12">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-brand no-underline">
          <span className="flex items-center gap-0.5">
            <span className="h-3 w-3 rounded-full border-[2.5px] border-brand" />
            <span className="h-3 w-3 rounded-full border-[2.5px] border-brand" />
          </span>
          AssetFlow
        </a>
        <nav className="flex items-center gap-3">
          <a
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-semibold text-brand no-underline hover:bg-brand-light"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-dark"
          >
            Sign up
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:gap-16 md:py-24">
        <div className="flex-1 text-center md:text-left">
          <span className="mb-4 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            Asset management for modern teams
          </span>
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Every asset. <span className="text-brand">One flow.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-600">
            AssetFlow keeps your organization&apos;s equipment tracked, allocated and maintained —
            from purchase to retirement — without spreadsheets.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <a
              href="/signup"
              className="rounded-md bg-brand px-6 py-3 font-semibold text-white no-underline shadow hover:bg-brand-dark"
            >
              Get started free
            </a>
            <a
              href="/assets"
              className="rounded-md border border-brand px-6 py-3 font-semibold text-brand no-underline hover:bg-brand-light"
            >
              View demo
            </a>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <img
            src={heroImage}
            alt="Layered asset platform illustration"
            className="w-full max-w-sm drop-shadow-xl"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything your assets need
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            One place to manage the full lifecycle of your organization&apos;s equipment.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">How it works</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to take control of your assets?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Set up your organization in minutes and invite your team.
        </p>
        <a
          href="/signup"
          className="mt-8 inline-block rounded-md bg-white px-8 py-3 font-semibold text-brand no-underline shadow hover:bg-brand-light"
        >
          Get started free
        </a>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row md:px-12">
        <span>© {new Date().getFullYear()} AssetFlow. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="/login" className="no-underline hover:text-brand">
            Log in
          </a>
          <a href="/signup" className="no-underline hover:text-brand">
            Sign up
          </a>
          <a href="/assets" className="no-underline hover:text-brand">
            Demo
          </a>
        </div>
      </footer>
    </div>
  );
}
