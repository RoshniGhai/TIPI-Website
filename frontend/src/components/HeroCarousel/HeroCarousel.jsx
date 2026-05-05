import { useState } from 'react';
import { Meta } from '../Meta/Meta.jsx';
import { ReadMore } from '../ReadMore/ReadMore.jsx';
import styles from './HeroCarousel.module.css';

export function HeroCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  return (
    <section className={styles.hero} aria-label="Featured stories">
      <div className={styles.imageWrap}>
        <img src={activeSlide.image} alt="" />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h1>{activeSlide.title}</h1>
          <Meta date={activeSlide.date} readTime={activeSlide.readTime} author={activeSlide.author} />
        </div>
        <div className={styles.summaryRow}>
          <p>{activeSlide.excerpt}</p>
          <ReadMore href={activeSlide.href} />
        </div>
      </div>
      <div className={styles.dots} role="tablist" aria-label="Featured story slides">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={index === activeIndex ? styles.activeDot : ''}
            type="button"
            aria-label={`Show ${slide.title}`}
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
