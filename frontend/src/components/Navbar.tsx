import { useEffect, useRef, useState } from 'react';
import './Navbar.css';

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
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <span className="navbar-logo-mark">
          <span className="navbar-logo-dot" />
          <span className="navbar-logo-dot" />
        </span>
        AssetFlow
      </a>

      <div className="navbar-links">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={
              link.href === activePath ? 'navbar-link navbar-link-active' : 'navbar-link'
            }
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="navbar-actions">
        <button type="button" className="navbar-quick-action" onClick={onQuickAction}>
          + Quick Action
        </button>

        <button type="button" className="navbar-bell" aria-label="Notifications">
          🔔
          {unreadCount > 0 && (
            <span className="navbar-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </button>

        <div className="navbar-profile" ref={profileRef}>
          <button
            type="button"
            className="navbar-profile-trigger"
            onClick={() => setIsProfileOpen((open) => !open)}
          >
            <span className="navbar-avatar">{userName.charAt(0).toUpperCase()}</span>
            <span className="navbar-username">{userName}</span>
            <span className="navbar-caret">▾</span>
          </button>

          {isProfileOpen && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <span className="navbar-dropdown-name">{userName}</span>
                <span className="navbar-role-badge">{userRole}</span>
              </div>
              <a href="/profile" className="navbar-dropdown-item">
                My Profile
              </a>
              <button type="button" className="navbar-dropdown-item navbar-logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
