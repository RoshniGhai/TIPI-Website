import { useState } from 'react';
import { ArrowUpRight, CalendarDays, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import styles from './EventsView.module.css';

const eventCopy =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati..it amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim';

function stripHtml(value = '') {
  const doc = new DOMParser().parseFromString(value, 'text/html');
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() || '';
}

function getEventExcerpt(event) {
  return stripHtml(event.excerpt || event.description || eventCopy);
}

function parseEventDate(value) {
  if (!value) return 0;

  const nativeTime = new Date(value).getTime();
  if (!Number.isNaN(nativeTime)) return nativeTime;

  const match = String(value).match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (!match) return 0;

  const [, day, month, year] = match;
  const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(
    month.slice(0, 3).toLowerCase(),
  );

  return monthIndex >= 0 ? new Date(Number(year), monthIndex, Number(day)).getTime() : 0;
}

function EventMeta({ event }) {
  return (
    <div className={styles.meta}>
      <span>
        <CalendarDays size={18} />
        {event.date}
      </span>
      <span>
        <MapPin size={18} />
        {event.location}
      </span>
    </div>
  );
}

function ViewMore({ event }) {
  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <Link className={styles.viewMore} to={event.href} onClick={handleClick}>
      View More
      <span aria-hidden="true">
        <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}

function EventRow({ event, index, isPast }) {
  const navigate = useNavigate();
  const openEvent = (interactionEvent) => {
    if (
      interactionEvent.type === 'keydown' &&
      interactionEvent.key !== 'Enter' &&
      interactionEvent.key !== ' '
    ) {
      return;
    }

    interactionEvent.preventDefault();
    navigate(event.href || `/events/${event.slug || event.id}`);
  };

  return (
    <article
      className={`${styles.eventRow} ${isPast ? styles.pastEvent : ''}`}
      onClick={openEvent}
      onKeyDown={openEvent}
      role="link"
      style={{ '--enter-delay': `${index * 45}ms` }}
      tabIndex={0}
    >
      <div className={styles.dateLabel}>{event.dateLabel}</div>
      <div className={styles.timeline} aria-hidden="true" />
      <img className={styles.eventImage} src={event.image || '/figma-assets/tipi-event-fallback.png'} alt="" />
      <div className={styles.eventCopy}>
        <h3>{event.title}</h3>
        <EventMeta event={event} />
        <p>{getEventExcerpt(event)}</p>
        <div className={styles.eventActions}>
          <button
            className={styles.notifyButton}
            type="button"
            onClick={(event) => event.stopPropagation()}
          >
            Notify
          </button>
          <ViewMore event={event} />
        </div>
      </div>
    </article>
  );
}

export function EventsView({ events }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const sortedEvents = [...events].sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
  const upcomingPool = sortedEvents.filter((event) => parseEventDate(event.date) >= todayTime);
  const pastPool = sortedEvents
    .filter((event) => parseEventDate(event.date) < todayTime)
    .sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date));
  const featured = upcomingPool[0] || pastPool[0] || events[0];
  const openFeatured = () => {
    if (featured) {
      navigate(featured.href || `/events/${featured.slug || featured.id}`);
    }
  };

  const upcomingEvents = upcomingPool.filter((event) => event.id !== featured?.id);
  const pastEvents = pastPool.filter((event) => event.id !== featured?.id);

  const activeEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (!featured) {
    return (
      <div className={styles.page}>
        <Breadcrumbs currentTitle="Events" />
        <section className={styles.emptyState}>No published events are available yet.</section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs currentTitle="Events" />

      <section className={styles.featured}>
        <img src={featured.image || '/figma-assets/tipi-event-fallback.png'} alt="" />
        <div className={styles.featuredCopy}>
          <h1>{featured.title}</h1>
          <EventMeta event={featured} />
          <p>{getEventExcerpt(featured)}</p>
          <div className={styles.featuredActions}>
            <button type="button" onClick={openFeatured}>Join Event</button>
            <ViewMore event={featured} />
          </div>
        </div>
      </section>

      <section className={styles.listSection} aria-labelledby="upcoming-events">
        <div className={styles.tabs} role="tablist" aria-label="Event type">
          <button
            className={activeTab === 'upcoming' ? styles.activeTab : ''}
            type="button"
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            id="upcoming-events"
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={activeTab === 'past' ? styles.activeTab : ''}
            type="button"
            role="tab"
            aria-selected={activeTab === 'past'}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>

        <div className={styles.eventList}>
          {activeEvents.map((event, index) => (
            <EventRow event={event} index={index} key={event.id} isPast={activeTab === 'past'} />
          ))}
        </div>

        <nav className={styles.pagination} aria-label="Events pagination">
          <button type="button" aria-label="First page"><ChevronsLeft size={16} /></button>
          <button type="button" aria-label="Previous page"><ChevronLeft size={16} /></button>
          <button className={styles.currentPage} type="button" aria-current="page">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <span>...</span>
          <button type="button">10</button>
          <button type="button" aria-label="Next page"><ChevronRight size={16} /></button>
          <button type="button" aria-label="Last page"><ChevronsRight size={16} /></button>
        </nav>
      </section>
    </div>
  );
}
