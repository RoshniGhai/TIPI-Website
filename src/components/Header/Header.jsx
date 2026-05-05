import { useEffect, useRef, useState } from 'react';
import { Box, ChevronDown, Landmark, Lightbulb, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileVerticalOpen, setIsMobileVerticalOpen] = useState(false);
  const verticalMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeMenus = () => {
    setIsVerticalMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileVerticalOpen(false);
  };

  const getTargetView = (label) => {
    if (label === 'Insights') return 'insights';
    if (label === 'Events') return 'events';
    if (label === 'People') return 'people';
    if (label === 'Contact Us') return 'contact';
    if (label === 'About Us') return 'about';
    return null;
  };

  const handleNavItemClick = (event, item) => {
    const targetView = getTargetView(item.label);
    if (!targetView) return;
    event.preventDefault();
    closeMenus();
    onNavSelect?.(targetView);
  };

  const handleVerticalClick = (event, label) => {
    closeMenus();
    if (label === 'Opportunity') {
      event.preventDefault();
      onVerticalSelect?.('opportunity');
    }
  };

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (
        verticalMenuRef.current &&
        !verticalMenuRef.current.contains(event.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsVerticalMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileVerticalOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        closeMenus();
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
                        handleVerticalClick(event, label);
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
                    handleNavItemClick(event, item);
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
            closeMenus();
            onSubscribe?.();
          }}
        >
          {cta.label}
        </a>
        <button
          className={styles.menuButton}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          type="button"
          onClick={() => {
            setIsVerticalMenuOpen(false);
            setIsMobileMenuOpen((isOpen) => !isOpen);
          }}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`${styles.mobileScrim} ${isMobileMenuOpen ? styles.mobileScrimOpen : ''}`} />
      <div
        className={`${styles.mobilePanel} ${isMobileMenuOpen ? styles.mobilePanelOpen : ''}`}
        id="mobile-navigation"
        ref={mobileMenuRef}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <div className={styles.mobileGroup} key={item.label}>
                <button
                  className={styles.mobileLink}
                  type="button"
                  aria-expanded={isMobileVerticalOpen}
                  onClick={() => setIsMobileVerticalOpen((isOpen) => !isOpen)}
                >
                  {item.label}
                  <ChevronDown
                    className={isMobileVerticalOpen ? styles.chevronOpen : undefined}
                    size={18}
                  />
                </button>
                <div className={`${styles.mobileSubmenu} ${isMobileVerticalOpen ? styles.mobileSubmenuOpen : ''}`}>
                  {verticalMenuItems.map(({ label, description, href, Icon }) => (
                    <a
                      className={styles.mobileVerticalItem}
                      href={href}
                      key={label}
                      onClick={(event) => handleVerticalClick(event, label)}
                    >
                      <Icon size={20} />
                      <span>
                        <strong>{label}</strong>
                        <small>{description}</small>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                className={`${styles.mobileLink} ${
                  ((activeView === 'insights' || activeView === 'insightDetail') &&
                    item.label === 'Insights') ||
                  ((activeView === 'events' || activeView === 'eventDetail') &&
                    item.label === 'Events') ||
                  (activeView === 'about' && item.label === 'About Us') ||
                  ((activeView === 'people' || activeView === 'personDetail') &&
                    item.label === 'People') ||
                  (activeView === 'contact' && item.label === 'Contact Us')
                    ? styles.mobileLinkActive
                    : ''
                }`}
                href={item.href}
                key={item.label}
                onClick={(event) => handleNavItemClick(event, item)}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <a
          className={styles.mobileSubscribe}
          href={cta.href}
          onClick={(event) => {
            event.preventDefault();
            closeMenus();
            onSubscribe?.();
          }}
        >
          {cta.label}
        </a>
      </div>
    </header>
  );
}
