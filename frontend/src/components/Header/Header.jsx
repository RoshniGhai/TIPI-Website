import { useEffect, useRef, useState } from 'react';
import { Box, ChevronDown, Landmark, Lightbulb, Menu } from 'lucide-react';
import { Logo } from '../Logo/Logo.jsx';
import styles from './Header.module.css';

const verticalMenuItems = [
  {
    label: 'Opportunity',
    description: 'Unlock emerging growth areas and identify high-impact avenues for national development.',
    href: '#verticals',
    Icon: Lightbulb,
  },
  {
    label: 'Resources',
    description: 'Leverage data, research, and knowledge assets to enable informed decision-making.',
    href: '#resources',
    Icon: Box,
  },
  {
    label: 'Assurance',
    description: 'Ensure policy reliability and execution through structured governance and accountability.',
    href: '#assurance',
    Icon: Landmark,
  },
];

export function Header({ logo, navItems, cta, activeView = 'home', onVerticalSelect, onNavSelect, onSubscribe }) {
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState(false);
  const verticalMenuRef = useRef(null);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (verticalMenuRef.current && !verticalMenuRef.current.contains(event.target)) {
        setIsVerticalMenuOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsVerticalMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo logo={logo} />
        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <div key={item.label} className={styles.navItem} ref={verticalMenuRef}>
                <button
                  className={`${styles.navLink} ${
                    activeView === 'opportunity' ? styles.navLinkActive : ''
                  }`}
                  type="button"
                  aria-expanded={isVerticalMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsVerticalMenuOpen((isOpen) => !isOpen)}
                >
                  {item.label}
                  <ChevronDown
                    className={isVerticalMenuOpen ? styles.chevronOpen : undefined}
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>
                <div
                  className={`${styles.verticalMenu} ${
                    isVerticalMenuOpen ? styles.verticalMenuOpen : ''
                  }`}
                  role="menu"
                  aria-label={`${item.label} menu`}
                >
                  {verticalMenuItems.map(({ label, description, href, Icon }) => (
                    <a
                      key={label}
                      className={styles.verticalMenuItem}
                      href={href}
                      role="menuitem"
                      onClick={(event) => {
                        setIsVerticalMenuOpen(false);
                        if (label === 'Opportunity') {
                          event.preventDefault();
                          onVerticalSelect?.('opportunity');
                        }
                      }}
                    >
                      <span className={styles.verticalMenuIcon} aria-hidden="true">
                        <Icon size={24} strokeWidth={2.3} />
                      </span>
                      <span className={styles.verticalMenuCopy}>
                        <span className={styles.verticalMenuTitle}>{label}</span>
                        <span className={styles.verticalMenuDescription}>{description}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                className={`${styles.navLink} ${
                  ((activeView === 'insights' || activeView === 'insightDetail') &&
                    item.label === 'Insights') ||
                  ((activeView === 'events' || activeView === 'eventDetail') &&
                    item.label === 'Events') ||
                  (activeView === 'about' && item.label === 'About Us') ||
                  ((activeView === 'people' || activeView === 'personDetail') &&
                    item.label === 'People') ||
                  (activeView === 'contact' && item.label === 'Contact Us')
                    ? styles.navLinkActive
                    : ''
                }`}
                href={item.href}
                onClick={(event) => {
                  if (
                    item.label === 'Insights' ||
                    item.label === 'Events' ||
                    item.label === 'About Us' ||
                    item.label === 'People' ||
                    item.label === 'Contact Us'
                  ) {
                    event.preventDefault();
                    setIsVerticalMenuOpen(false);
                    const targetView =
                      item.label === 'Insights'
                        ? 'insights'
                        : item.label === 'Events'
                          ? 'events'
                          : item.label === 'People'
                            ? 'people'
                            : item.label === 'Contact Us'
                              ? 'contact'
                              : 'about';
                    onNavSelect?.(targetView);
                  }
                }}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <a
          className={styles.subscribe}
          href={cta.href}
          onClick={(event) => {
            event.preventDefault();
            setIsVerticalMenuOpen(false);
            onSubscribe?.();
          }}
        >
          {cta.label}
        </a>
        <button className={styles.menuButton} aria-label="Open navigation menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
