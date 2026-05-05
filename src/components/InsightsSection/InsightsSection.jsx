import { Meta } from '../Meta/Meta.jsx';
import { ReadMore } from '../ReadMore/ReadMore.jsx';
import { SectionHeading } from '../SectionHeading/SectionHeading.jsx';
import styles from './InsightsSection.module.css';
import { useNavigate } from 'react-router-dom';

function getInsightTags(insight) {
  if (Array.isArray(insight.tags) && insight.tags.length) {
    return insight.tags;
  }

  return insight.category ? [insight.category] : [];
}

function getInsightExcerpt(insight) {
  return insight.excerpt || insight.content || '';
}

function useFallbackImage(event, fallback) {
  if (event.currentTarget.src.endsWith(fallback)) return;
  event.currentTarget.src = fallback;
}

export function InsightsSection({ insights }) {
  const [featured, ...cards] = insights;
  const navigate = useNavigate();

  const openInsight = (insight, event) => {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    navigate(insight.href || `/insights/${insight.slug || insight.id}`);
  };

  const stopCardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <section className={styles.section} id="insights">
      <SectionHeading title="Insights" href="/insights" />
      <article
        className={styles.featured}
        onClick={(event) => openInsight(featured, event)}
        onKeyDown={(event) => openInsight(featured, event)}
        role="link"
        tabIndex={0}
      >
        <img
          src={featured.image || '/figma-assets/detail-hero.png'}
          alt=""
          onError={(event) => useFallbackImage(event, '/figma-assets/detail-hero.png')}
        />
        <div className={styles.featuredCopy}>
          <h3>{featured.title}</h3>
          <div className={styles.tags} aria-label="Insight tags">
            {getInsightTags(featured).slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <Meta date={featured.date} readTime={featured.readTime} author={featured.author} />
          {getInsightExcerpt(featured) ? <p>{getInsightExcerpt(featured)}</p> : null}
          <ReadMore href={featured.href} onClick={stopCardClick} />
        </div>
      </article>
      <div className={styles.grid}>
        {cards.map((insight) => (
          <article
            className={styles.card}
            key={insight.id}
            onClick={(event) => openInsight(insight, event)}
            onKeyDown={(event) => openInsight(insight, event)}
            role="link"
            tabIndex={0}
          >
            <img
              src={insight.image || '/figma-assets/detail-similar-1.png'}
              alt=""
              onError={(event) => useFallbackImage(event, '/figma-assets/detail-similar-1.png')}
            />
            <h3>{insight.title}</h3>
            <div className={styles.tags}>
              {getInsightTags(insight).slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Meta date={insight.date} readTime={insight.readTime} author={insight.author} compact />
            {getInsightExcerpt(insight) ? <p>{getInsightExcerpt(insight)}</p> : null}
            <ReadMore href={insight.href} onClick={stopCardClick} />
          </article>
        ))}
      </div>
    </section>
  );
}
