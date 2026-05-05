import { Facebook, Instagram, Linkedin, X } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import styles from './PersonDetailView.module.css';

const person = {
  name: 'Aryan Choudhary',
  role: 'Sr. UI / UX Designer',
  email: 'aryan.choudhary@tailnode.com',
  avatar: '/figma-assets/person-detail-avatar.png',
};

const bio =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati..it amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim';

const works = [
  {
    title: 'Understanding the socialmovements reshaping ourworld today',
    category: 'World News',
    date: 'Sep 9, 2024',
    image: '/figma-assets/person-work-1.png',
  },
  {
    title: 'Tailoring treatments to individual genetic profiles',
    category: 'Health',
    date: 'Sep 9, 2024',
    image: '/figma-assets/person-work-2.png',
  },
  {
    title: 'The journey from aspiring athlete to global sports icon',
    category: 'Sports',
    date: 'Sep 9, 2024',
    image: '/figma-assets/person-work-3.png',
  },
];

const workItems = [...works, ...works];

function SocialLinks() {
  return (
    <div className={styles.socials} aria-label={`${person.name} social links`}>
      <a href="#linkedin" aria-label={`${person.name} on LinkedIn`}>
        <Linkedin size={18} strokeWidth={2.4} />
      </a>
      <a href="#instagram" aria-label={`${person.name} on Instagram`}>
        <Instagram size={18} strokeWidth={2.2} />
      </a>
      <a href="#x" aria-label={`${person.name} on X`}>
        <X size={18} strokeWidth={2.4} />
      </a>
      <a href="#facebook" aria-label={`${person.name} on Facebook`}>
        <Facebook size={18} strokeWidth={2.2} />
      </a>
    </div>
  );
}

function ProfileCard() {
  return (
    <article className={styles.profileCard}>
      <img className={styles.avatar} src={person.avatar} alt="" />
      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>
          <p className={styles.role}>{person.role}</p>
          <div className={styles.nameRow}>
            <h1>{person.name}</h1>
            <SocialLinks />
          </div>
          <a className={styles.email} href={`mailto:${person.email}`}>
            <img src="/figma-assets/people-mail.svg" alt="" />
            {person.email}
          </a>
        </div>
        <div className={styles.bio}>
          <p>{bio}</p>
          <p>{bio}</p>
        </div>
      </div>
    </article>
  );
}

function WorkCard({ work, index }) {
  return (
    <article className={styles.workCard} style={{ '--enter-delay': `${index * 45}ms` }}>
      <img src={work.image} alt="" />
      <div className={styles.workCopy}>
        <h2>{work.title}</h2>
        <p>
          <span>{work.category}</span>
          <span aria-hidden="true" />
          <time>{work.date}</time>
        </p>
      </div>
    </article>
  );
}

export function PersonDetailView({ onBack }) {
  return (
    <div className={styles.page}>
      <Breadcrumbs currentTitle={person.name} onBack={onBack} />

      <ProfileCard />

      <section className={styles.workSection} aria-labelledby="person-work-title">
        <div className={styles.workHeading}>
          <h2 id="person-work-title">Aryan&apos;s Work</h2>
        </div>
        <div className={styles.workGrid}>
          {workItems.map((work, index) => (
            <WorkCard work={work} index={index} key={`${work.title}-${index}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
