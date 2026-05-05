import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Plus } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import { ReadMore } from '../ReadMore/ReadMore.jsx';
import { SectionHeading } from '../SectionHeading/SectionHeading.jsx';
import styles from './OpportunityView.module.css';

const bodyText =
  'In a world where creativity thrives, the essence of life is found in the balance of freedom and structure. Embracing the flow of ideas, we navigate through challenges with grace, transforming obstacles into opportunities. Each moment is a chance to learn and grow, as we weave our stories together, creating a vibrant tapestry of experiences that enrich our journey.';

const insights = [
  {
    title: 'G20 Coming Up',
    image: '/figma-assets/opportunity-insight-featured.jpg',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim',
    featured: true,
  },
  {
    title: 'G20 Coming Up',
    image: '/figma-assets/opportunity-insight-1.png',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ma...',
  },
  {
    title: 'G20 Coming Up',
    image: '/figma-assets/opportunity-insight-2.png',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ma...',
  },
  {
    title: 'G20 Coming Up',
    image: '/figma-assets/insight-3.png',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ma...',
  },
];

const people = Array.from({ length: 5 }, (_, index) => ({
  id: index,
  name: 'Aryan Choudhary',
  role: 'UI/UX Designer',
  image: '/figma-assets/opportunity-person.png',
}));

function MiniMeta({ location = false }) {
  return (
    <div className={styles.meta}>
      <span>
        <CalendarDays size={16} />
        26 Feb 2026
      </span>
      {location ? (
        <span>
          <MapPin size={16} />
          New Delhi, India
        </span>
      ) : (
        <span>
          <Clock3 size={16} />8 Min Read
        </span>
      )}
      {!location ? <strong>Aryan Choudhary</strong> : null}
    </div>
  );
}

function Filter({ children, primary = false }) {
  return (
    <button className={`${styles.filter} ${primary ? styles.primaryFilter : ''}`} type="button">
      {children}
      <ChevronDown size={16} />
    </button>
  );
}

export function OpportunityView() {
  const [featuredInsight, ...cards] = insights;

  return (
    <div className={styles.page}>
      <Breadcrumbs currentTitle="Opportunity" />

      <section className={styles.article}>
        <h1>Olympics 2028</h1>
        <img className={styles.heroImage} src="/figma-assets/opportunity-hero.png" alt="" />
        <p className={styles.kicker}>Porem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className={styles.articleCopy}>
          <p>{bodyText} {bodyText}</p>
          <h2>Corem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
          <p>{bodyText} {bodyText}</p>
        </div>
        <button className={styles.readMoreButton} type="button">
          Read More
          <Plus size={24} />
        </button>
      </section>

      <section className={styles.section}>
        <SectionHeading title="Insights" href="#insights" />
        <div className={styles.filters}>
          <span>Filters</span>
          <Filter primary>lorem</Filter>
          <Filter>Ipsum</Filter>
          <Filter>Recommended</Filter>
          <button className={styles.applyFilter} type="button">Apply</button>
        </div>
        <article className={styles.featuredInsight}>
          <img src={featuredInsight.image} alt="" />
          <div>
            <h3>{featuredInsight.title}</h3>
            <MiniMeta />
            <p>{featuredInsight.excerpt}</p>
            <ReadMore href="#g20-coming-up" />
          </div>
        </article>
        <div className={styles.insightGrid}>
          {cards.map((item) => (
            <article className={styles.insightCard} key={item.image}>
              <img src={item.image} alt="" />
              <h3>{item.title}</h3>
              <div className={styles.tags}>
                <span>Olympics</span>
                <span>India</span>
              </div>
              <MiniMeta />
              <p>{item.excerpt}</p>
              <ReadMore href="#g20-coming-up" />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.eventsBand}>
        <div className={styles.bandInner}>
          <SectionHeading title="Events" subtitle="Some random txt about explaining Insights" actionLabel="View All Events" href="#events" />
          <article className={styles.eventFeature}>
            <img src="/figma-assets/opportunity-event.png" alt="" />
            <div className={styles.eventCopy}>
              <h3>20th AI Conference</h3>
              <MiniMeta location />
              <p>{insights[0].excerpt}</p>
              <a href="#register">Register</a>
            </div>
          </article>
          <div className={styles.pagination}>
            <ChevronLeft size={36} />
            <span />
            <i />
            <i />
            <i />
            <i />
            <ChevronRight size={36} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title="People" subtitle="Some random txt about explaining Team" actionLabel="View All Members" href="#people" />
        <div className={styles.peopleWrap}>
          <ChevronLeft className={styles.peopleArrow} size={34} />
          <div className={styles.peopleGrid}>
            {people.map((person) => (
              <article className={styles.personCard} key={person.id}>
                <img src={person.image} alt="" />
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <ReadMore href="#person" label="View More" />
              </article>
            ))}
          </div>
          <ChevronRight className={styles.peopleArrow} size={34} />
        </div>
      </section>
    </div>
  );
}
