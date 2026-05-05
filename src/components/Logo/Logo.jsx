import styles from './Logo.module.css';

export function Logo({ logo, variant = 'light' }) {
  const image = variant === 'dark' ? logo.footerImage || logo.image : logo.image;

  return (
    <a href="/" className={`${styles.logo} ${styles[variant]}`} aria-label="The India Prosperity Initiative">
      {image ? (
        <img className={styles.image} src={image} alt="" aria-hidden="true" />
      ) : (
        <>
          <span className={styles.mark} aria-hidden="true">
            <span />
          </span>
          <span className={styles.text}>{logo.title}</span>
        </>
      )}
    </a>
  );
}
