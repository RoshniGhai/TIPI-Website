import { useState } from 'react';
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Facebook, Instagram, Linkedin, X } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import styles from './PeopleView.module.css';

const people = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  name: 'Aryan Choudhary',
  role: 'Sr. UI / UX Designer',
  email: 'aryan.choudhary@tailnode.com',
  avatar: '/figma-assets/people-avatar.png',
}));

const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati..it amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim';

function SocialLinks({ name }) {
  return (
    <div className={styles.socials} aria-label={`${name} social links`}>
      <a href="#linkedin" aria-label={`${name} on LinkedIn`} onClick={(event) => event.stopPropagation()}>
        <Linkedin size={18} strokeWidth={2.4} />
      </a>
      <a href="#instagram" aria-label={`${name} on Instagram`} onClick={(event) => event.stopPropagation()}>
        <Instagram size={18} strokeWidth={2.2} />
      </a>
      <a href="#x" aria-label={`${name} on X`} onClick={(event) => event.stopPropagation()}>
        <X size={18} strokeWidth={2.4} />
      </a>
      <a href="#facebook" aria-label={`${name} on Facebook`} onClick={(event) => event.stopPropagation()}>
        <Facebook size={18} strokeWidth={2.2} />
      </a>
    </div>
  );
}

function PersonCard({ person, index, onPersonSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const openFromKeyboard = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onPersonSelect?.();
    }
  };

  return (
    <article
      className={styles.personCard}
      style={{ '--enter-delay': `${index * 50}ms` }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${person.name} profile`}
      onClick={onPersonSelect}
      onKeyDown={openFromKeyboard}
    >
      <img className={styles.avatar} src={person.avatar} alt="" />
      <div className={styles.personContent}>
        <div className={styles.personHeader}>
          <p className={styles.role}>{person.role}</p>
          <div className={styles.nameRow}>
            <h2>{person.name}</h2>
            <SocialLinks name={person.name} />
          </div>
          <a
            className={styles.email}
            href={`mailto:${person.email}`}
            onClick={(event) => event.stopPropagation()}
          >
            <img src="/figma-assets/people-mail.svg" alt="" />
            {person.email}
          </a>
        </div>
        <div className={`${styles.bio} ${isExpanded ? styles.bioExpanded : ''}`}>
          <p>{bio}</p>
          <p>{bio}</p>
          <button
            className={styles.readMore}
            type="button"
            aria-expanded={isExpanded}
            onClick={(event) => {
              event.stopPropagation();
              setIsExpanded((expanded) => !expanded);
            }}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function PeopleView({ onPersonSelect }) {
  return (
    <div className={styles.page}>
      <Breadcrumbs currentTitle="People" />

      <section className={styles.hero} aria-labelledby="people-title">
        <img src="/figma-assets/people-hero.png" alt="" />
        <div className={styles.heroShade} />
        <h1 id="people-title">People</h1>
      </section>

      <section className={styles.list} aria-label="People directory">
        {people.map((person, index) => (
          <PersonCard person={person} index={index} key={person.id} onPersonSelect={onPersonSelect} />
        ))}
      </section>

      <nav className={styles.pagination} aria-label="People pagination">
        <button type="button" aria-label="First page">
          <ChevronsLeft size={16} />
        </button>
        <button type="button" aria-label="Previous page">
          <ChevronLeft size={16} />
        </button>
        <button className={styles.currentPage} type="button" aria-current="page">
          1
        </button>
        <button type="button">2</button>
        <button type="button">3</button>
        <span>...</span>
        <button type="button">10</button>
        <button type="button" aria-label="Next page">
          <ChevronRight size={16} />
        </button>
        <button type="button" aria-label="Last page">
          <ChevronsRight size={16} />
        </button>
      </nav>
    </div>
  );
}
