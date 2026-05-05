import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ReadMore.module.css';

export function ReadMore({ href, label = 'Read More', onClick }) {
  const content = (
    <>
      {label}
      <span aria-hidden="true">
        <ArrowUpRight size={16} />
      </span>
    </>
  );

  if (href?.startsWith('/')) {
    return (
      <Link className={styles.link} to={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <a className={styles.link} href={href} onClick={onClick}>
      {content}
    </a>
  );
}
