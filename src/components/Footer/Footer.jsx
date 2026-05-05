import { Logo } from '../Logo/Logo.jsx';
import styles from './Footer.module.css';

export function Footer({ logo, footer, onSubscribe }) {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <Logo logo={logo} variant="dark" />
        <p>{footer.subscribeText}</p>
        <a
          className={styles.subscribe}
          href={footer.cta.href}
          onClick={(event) => {
            event.preventDefault();
            onSubscribe?.();
          }}
        >
          {footer.cta.label}
        </a>
        <nav className={styles.links} aria-label="Footer navigation">
          {footer.links.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
