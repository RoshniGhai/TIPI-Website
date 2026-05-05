import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import styles from './Meta.module.css';

export function Meta({ date, readTime, author, location, compact = false }) {
  return (
    <div className={`${styles.meta} ${compact ? styles.compact : ''}`}>
      {date ? (
        <span>
          <CalendarDays size={16} />
          {date}
        </span>
      ) : null}
      {readTime ? (
        <span>
          <Clock3 size={16} />
          {readTime}
        </span>
      ) : null}
      {location ? (
        <span>
          <MapPin size={16} />
          {location}
        </span>
      ) : null}
      {author ? <strong>{author}</strong> : null}
    </div>
  );
}
