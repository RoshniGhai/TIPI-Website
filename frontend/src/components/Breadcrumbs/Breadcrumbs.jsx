import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs({ currentTitle, onBack }) {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {paths.length > 0 && <span>&gt;</span>}
      
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const href = '/' + paths.slice(0, index + 1).join('/');
        
        // Capitalize path segment
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return (
          <span key={path} className={styles.crumbWrapper}>
            {isLast ? (
              <strong>{currentTitle || label}</strong>
            ) : (
              <Link to={href}>{label}</Link>
            )}
            {!isLast && <span>&gt;</span>}
          </span>
        );
      })}
    </nav>
  );
}
