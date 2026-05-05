import { useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Clock3, MapPin } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import { FormattedContent } from '../FormattedContent/FormattedContent.jsx';
import { createEventRegistration } from '../../services/api.js';
import styles from './EventDetailView.module.css';

const speakers = [
  {
    name: 'Meera Kapoor',
    role: 'Professor, National Institute for Policy',
    expertise: 'Public Policy Analyst',
    image: '/figma-assets/insight-detail-speaker-1.png',
  },
  {
    name: 'Meera Kapoor',
    role: 'Founder & Editor-In-Chief',
    expertise: 'Digital Policy',
    image: '/figma-assets/insight-detail-speaker-2.png',
  },
  {
    name: 'Meera Kapoor',
    role: 'Professor, National Institute for Policy',
    expertise: 'Public Policy Analyst',
    image: '/figma-assets/insight-detail-speaker-3.png',
  },
  {
    name: 'Meera Kapoor',
    role: 'Founding Partner, JurisTech',
    expertise: 'Digital Rights & Sovereignty Expert',
    image: '/figma-assets/insight-detail-speaker-4.png',
  },
];

const schedule = [
  {
    time: '09:00 AM',
    title: 'Opening Keynote',
    description: 'The State of Global Sovereignty: Challenges and Prospects for 2025.',
    location: 'Grand Ballroom',
  },
  {
    time: '11:00 AM',
    title: 'Panel Discussion I',
    description: 'Data Localization vs. Open Innovation: Striking the Delicate Balance.',
    location: 'Strategy Wing',
  },
  {
    time: '01:00 PM',
    title: 'Networking Luncheon',
    description: 'Curated lunch for delegates and speakers to facilitate informal dialogue.',
    location: 'The Atrium',
  },
  {
    time: '02:30 PM',
    title: 'Panel Discussion II',
    description: 'Sovereign Cloud: Infrastructure as a National Asset.',
    location: 'Main Hall',
  },
];

export function EventDetailView({ event, onBack }) {
  const registrationRef = useRef(null);
  const [registrationStatus, setRegistrationStatus] = useState('idle');
  const eventSlug = event?.slug || event?.id;
  const eventTime = event?.time_slot || [event?.start_time, event?.end_time].filter(Boolean).join(' - ');
  const eventSpeakers = event?.event_speakers?.length
    ? event.event_speakers.map((item) => ({
      expertise: item.speaker_company,
      image: item.speaker_image || '/figma-assets/insight-detail-speaker-1.png',
      name: item.speaker_name,
      role: item.speaker_designation,
    }))
    : speakers;
  const eventSchedule = event?.schedules?.length
    ? event.schedules.map((item) => ({
      description: item.description,
      location: item.venue,
      time: item.start_time || event?.time_slot || '',
      title: item.title,
    }))
    : schedule;

  const handleRegisterClick = () => {
    registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRegistrationSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    if (!eventSlug) {
      return;
    }

    const form = submitEvent.currentTarget;
    const data = new FormData(form);
    setRegistrationStatus('loading');

    try {
      await createEventRegistration(eventSlug, {
        full_name: data.get('full_name'),
        email: data.get('email'),
        organization: data.get('organization'),
        designation: data.get('designation'),
        interests: data.get('interests'),
      });
      form.reset();
      setRegistrationStatus('success');
    } catch {
      setRegistrationStatus('error');
    }
  };

  return (
    <article className={styles.page}>
      <Breadcrumbs currentTitle={event?.title || 'The Digital Sovereignty Dialogues 2026'} onBack={onBack} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.badge}>{event?.category || 'Event'}</span>
          <h1>{event?.title || 'The Digital Sovereignty Dialogues 2026'}</h1>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <CalendarDays size={31} strokeWidth={1.8} />
              <div>
                <span>Date</span>
                <strong>{event?.date || 'Nov 12, 2024'}</strong>
              </div>
            </div>
            <div className={styles.metaItem}>
              <MapPin size={31} strokeWidth={1.8} />
              <div>
                <span>Location</span>
                <strong>{event?.location || 'Mumbai, India'}</strong>
              </div>
            </div>
            {event?.venue ? (
              <div className={styles.metaItem}>
                <MapPin size={31} strokeWidth={1.8} />
                <div>
                  <span>Venue</span>
                  <strong>{event.venue}</strong>
                </div>
              </div>
            ) : null}
            {eventTime ? (
              <div className={styles.metaItem}>
                <Clock3 size={31} strokeWidth={1.8} />
                <div>
                  <span>Time</span>
                  <strong>{eventTime}</strong>
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={handleRegisterClick}>Register Now</button>
            <button
              type="button"
              onClick={() => {
                if (event?.content_url) {
                  window.open(event.content_url, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              Download Brochure
            </button>
          </div>
        </div>
        <img
          className={styles.heroImage}
          src={event?.image || '/figma-assets/insight-detail-event-hero.png'}
          alt=""
        />
      </section>

      <section className={styles.contentBlock}>
        <h2>Defining the New Frontier</h2>
        <FormattedContent
          value={event?.description || event?.excerpt || 'The Digital Sovereignty Dialogues 2026 convenes policymakers, industry leaders, technologists, and civic thinkers to examine how nations can protect trust, data, and opportunity in a rapidly shifting digital landscape.'}
        />
      </section>

      <section className={styles.speakers} aria-labelledby="speakers-title">
        <div className={styles.sectionIntro}>
          <h2 id="speakers-title">Distinguished Speakers</h2>
          <p>Leading voices in global policy and technology</p>
        </div>
        <div className={styles.speakerGrid}>
          {eventSpeakers.map((speaker, index) => (
            <article className={styles.speakerCard} key={`${speaker.name}-${speaker.role}-${index}`}>
              <img src={speaker.image} alt={speaker.name} />
              <div>
                <h3>{speaker.name}</h3>
                <p>{speaker.role}</p>
                <span>{speaker.expertise}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.schedule} aria-labelledby="schedule-title">
        <div className={styles.sectionIntro}>
          <h2 id="schedule-title">Schedule of Insights</h2>
        </div>
        <div className={styles.scheduleList}>
          {eventSchedule.map((item, index) => (
            <article className={styles.scheduleItem} key={`${item.title}-${index}`}>
              <time>{item.time}</time>
              <div>
                <h3>{item.title}</h3>
                <FormattedContent value={item.description} />
              </div>
              <span>{item.location}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.registration} aria-labelledby="register-title" ref={registrationRef}>
        <h2 id="register-title">Secure Your Seat</h2>
        <p>Limited delegate passes available for the 2026 dialogue.</p>
        <form className={styles.form} onSubmit={handleRegistrationSubmit}>
          <input type="text" name="full_name" placeholder="Full Name" aria-label="Full Name" required />
          <input type="email" name="email" placeholder="Official Email" aria-label="Official Email" required />
          <input type="text" name="organization" placeholder="Organization" aria-label="Organization" />
          <input type="text" name="designation" placeholder="Designation" aria-label="Designation" />
          <label className={styles.selectWrap}>
            <span>Interests</span>
            <select name="interests" aria-label="Interests" defaultValue="">
              <option value="" disabled>Interests</option>
              <option>Digital Sovereignty</option>
              <option>Public Policy</option>
              <option>Technology Infrastructure</option>
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </label>
          <button type="submit" disabled={registrationStatus === 'loading'}>
            {registrationStatus === 'loading' ? 'Registering...' : 'Confirm Registration'}
          </button>
          {registrationStatus === 'success' ? <p className={styles.formStatus}>Registration saved.</p> : null}
          {registrationStatus === 'error' ? <p className={styles.formStatusError}>Unable to register. Try again.</p> : null}
        </form>
      </section>
    </article>
  );
}
