import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './SectionHeading.module.css';

export function SectionHeading({ title, subtitle, actionLabel = 'View All', href = '#', hideAction = false }) {
  const action = (
    <>
      {actionLabel}
      <ArrowRight size={18} />
    </>
  );

  return (
    <div className={styles.wrap}>
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {!hideAction && (
        href.startsWith('/') ? (
          <Link className={styles.action} to={href}>{action}</Link>
        ) : (
          <a className={styles.action} href={href}>{action}</a>
        )
      )}
    </div>
  );
}
