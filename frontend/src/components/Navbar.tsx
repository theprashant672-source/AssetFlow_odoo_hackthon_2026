import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Assets', href: '/assets' },
  { label: 'Allocations', href: '/allocations' },
  { label: 'Bookings', href: '/bookings' },
  { label: 'Maintenance', href: '/maintenance' },
  { label: 'Audits', href: '/audits' },
  { label: 'Reports', href: '/reports' },
];

interface NavbarProps {
  userName?: string;
  userRole?: string;
  unreadCount?: number;
  activePath?: string;
  onQuickAction?: () => void;
  onLogout?: () => void;
}

export default function Navbar({
  userName = 'Guest User',
  userRole = 'Employee',
  unreadCount = 0,
  activePath = '/',
  onQuickAction,
  onLogout,
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-20 flex w-full items-center justify-between gap-4 bg-brand px-6 py-3 font-sans shadow">
      <a href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold text-white no-underline">
        <span className="flex items-center gap-0.5">
          <span className="h-3 w-3 rounded-full border-[2.5px] border-white" />
          <span className="h-3 w-3 rounded-full border-[2.5px] border-white" />
        </span>
        AssetFlow
      </a>

      <div className="ml-8 flex min-w-0 flex-1 flex-wrap gap-6">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap py-1.5 text-sm no-underline hover:text-white ${
              link.href === activePath
                ? 'border-b-2 border-white font-semibold text-white'
                : 'text-white/80'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          className="cursor-pointer whitespace-nowrap rounded-md border-none bg-white px-3.5 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
          onClick={onQuickAction}
        >
          + Quick Action
        </button>

        <button
          type="button"
          className="relative cursor-pointer border-none bg-transparent p-1 text-lg text-white"
          aria-label="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1 rounded-full bg-red-600 px-1.5 py-px text-[0.65rem] font-bold leading-snug text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-1"
            onClick={() => setIsProfileOpen((open) => !open)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand">
              {userName.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm text-white">{userName}</span>
            <span className="text-[0.7rem] text-white/80">▾</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-10 min-w-[180px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="flex flex-col gap-1 border-b border-gray-200 px-4 py-3">
                <span className="text-sm font-semibold text-gray-800">{userName}</span>
                <span className="self-start rounded-full bg-brand-light px-2 py-px text-[0.7rem] font-semibold text-brand">
                  {userRole}
                </span>
              </div>
              <a
                href="/profile"
                className="block w-full cursor-pointer border-none bg-transparent px-4 py-2.5 text-left text-sm text-gray-700 no-underline hover:bg-gray-50"
              >
                My Profile
              </a>
              <button
                type="button"
                className="block w-full cursor-pointer border-none bg-transparent px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
