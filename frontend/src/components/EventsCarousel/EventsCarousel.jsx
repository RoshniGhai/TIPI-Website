import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Meta } from '../Meta/Meta.jsx';
import { SectionHeading } from '../SectionHeading/SectionHeading.jsx';
import styles from './EventsCarousel.module.css';

export function EventsCarousel({ events }) {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const orderedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events],
  );
  const visibleEvents = useMemo(
    () => [0, 1, 2].map((offset) => orderedEvents[(startIndex + offset) % orderedEvents.length]).filter(Boolean),
    [orderedEvents, startIndex],
  );

  const move = (direction) => {
    setStartIndex((current) => (current + direction + orderedEvents.length) % orderedEvents.length);
  };

  const openEvent = (eventItem, interactionEvent) => {
    if (
      interactionEvent.type === 'keydown' &&
      interactionEvent.key !== 'Enter' &&
      interactionEvent.key !== ' '
    ) {
      return;
    }

    interactionEvent.preventDefault();
    navigate(eventItem.href || `/events/${eventItem.slug || eventItem.id}`);
  };

  const openFromLink = (eventItem, event) => {
    event.stopPropagation();
    navigate(eventItem.href || `/events/${eventItem.slug || eventItem.id}`);
  };

  return (
    <section className={styles.section} id="events">
      <SectionHeading
        title="Events"
        subtitle="Some random txt about explaining Insights"
        href="/events"
      />
      <div className={styles.carousel}>
        <button className={`${styles.navButton} ${styles.prev}`} type="button" onClick={() => move(-1)} aria-label="Previous events">
          <ChevronLeft size={34} />
        </button>
        <div className={styles.eventGrid}>
          {visibleEvents.map((event) => (
            <article
              className={styles.card}
              key={event.id}
              onClick={(interactionEvent) => openEvent(event, interactionEvent)}
              onKeyDown={(interactionEvent) => openEvent(event, interactionEvent)}
              role="link"
              tabIndex={0}
            >
                <div className={styles.cardTop}>
                  <h3>{event.title}</h3>
                  <Meta date={event.date} location={event.location} compact />
                </div>
                <img src={event.image || '/figma-assets/tipi-event-fallback.png'} alt="" />
                <a className={styles.moreInfo} href={event.href} onClick={(interactionEvent) => openFromLink(event, interactionEvent)}>
                  More Info
                </a>
              </article>
          ))}
        </div>
        <button className={`${styles.navButton} ${styles.next}`} type="button" onClick={() => move(1)} aria-label="Next events">
          <ChevronRight size={34} />
        </button>
      </div>
    </section>
  );
}
