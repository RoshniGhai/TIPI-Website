import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import styles from './AboutView.module.css';

const metrics = [
  {
    value: '500+',
    label: 'Thought Leaders & Writers',
    icon: '/figma-assets/about-icon-person.svg',
  },
  {
    value: '1,000+',
    label: 'Insightful Articles',
    icon: '/figma-assets/about-icon-articles.svg',
  },
  {
    value: '100K+',
    label: 'Total Reads',
    icon: '/figma-assets/about-icon-read.svg',
  },
  {
    value: '20+',
    label: 'Domains Covered',
    icon: '/figma-assets/about-icon-category.svg',
  },
];

const principles = [
  {
    title: 'Editorial Excellence',
    text: 'Ensuring every piece meets high standards of clarity and quality',
    icon: '/figma-assets/about-icon-badge.svg',
  },
  {
    title: 'Diverse Perspectives',
    text: 'Bringing voices from different backgrounds and experiences',
    icon: '/figma-assets/about-icon-globe.svg',
  },
  {
    title: 'Meaningful Impact',
    text: 'Focusing on ideas that inform, inspire, and drive progress',
    icon: '/figma-assets/about-icon-trending.svg',
  },
];

const portraits = [
  '/figma-assets/about-person-1.png',
  '/figma-assets/about-person-2.png',
  '/figma-assets/about-person-3.png',
  '/figma-assets/about-person-4.png',
];

export function AboutView() {
  return (
    <div className={styles.page}>
      <Breadcrumbs currentTitle="About Us" />

      <section className={styles.hero} aria-labelledby="about-title">
        <img src="/figma-assets/about-hero.png" alt="" />
        <div className={styles.heroShade} />
        <h1 id="about-title">About Us</h1>
      </section>

      <section className={styles.intro} aria-labelledby="about-heading">
        <h2 id="about-heading">Shaping Ideas. Driving India&apos;s Prosperity.</h2>
        <div className={styles.visionMission}>
          <article className={styles.statement}>
            <img src="/figma-assets/about-icon-vision.svg" alt="" />
            <h3>Our Vision</h3>
            <p>
              To create an open platform that empowers diverse voices to share thoughtful ideas,
              foster informed dialogue, and contribute meaningfully to India&apos;s inclusive growth
              and progress.
            </p>
          </article>
          <span className={styles.divider} aria-hidden="true" />
          <article className={styles.statement}>
            <img src="/figma-assets/about-icon-mission.svg" alt="" />
            <h3>Our Mission</h3>
            <p>
              To build a trusted space where ideas inspire perspectives, conversations shape
              understanding, and collective voices drive a more aware, progressive, and prosperous
              India.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.metrics} aria-label="Platform metrics">
        {metrics.map((metric, index) => (
          <article className={styles.metric} style={{ '--enter-delay': `${index * 45}ms` }} key={metric.label}>
            <img src={metric.icon} alt="" />
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className={styles.teamStory} aria-labelledby="team-story-heading">
        <div className={styles.portraits} aria-hidden="true">
          {portraits.map((portrait, index) => (
            <img src={portrait} alt="" key={portrait} style={{ '--enter-delay': `${index * 40}ms` }} />
          ))}
        </div>
        <div className={styles.storyCopy}>
          <h2 id="team-story-heading">“Driven by ideas. United by purpose.”</h2>
          <div className={styles.storyText}>
            <p>
              Our team brings together individuals from varied backgrounds, including design,
              technology, research, and content, united by a shared vision of fostering meaningful
              dialogue.
            </p>
            <p>
              We work collaboratively to ensure that every piece published reflects clarity,
              credibility, and purpose. From shaping editorial direction to enhancing user
              experience, our focus remains on creating a platform that is thoughtful, inclusive,
              and impactful.
            </p>
          </div>

          <div className={styles.principles}>
            {principles.map((principle) => (
              <article className={styles.principle} key={principle.title}>
                <img src={principle.icon} alt="" />
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </div>
              </article>
            ))}
          </div>

          <a className={styles.joinButton} href="#join-the-team">
            Join The Team
          </a>
        </div>
      </section>
    </div>
  );
}
