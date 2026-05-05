import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronDown, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import { ReadMore } from '../ReadMore/ReadMore.jsx';
import styles from './InsightsView.module.css';

function InsightMeta({ insight }) {
  return (
    <div className={styles.meta}>
      <span>
        <CalendarDays size={16} />
        {insight.date}
      </span>
      <span>
        <Clock3 size={16} />
        {insight.readTime || '8 Min Read'}
      </span>
      <strong>{insight.author || 'The IPI Desk'}</strong>
    </div>
  );
}

function openWithKeyboard(event, callback) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback?.();
  }
}

function getInsightTags(insight) {
  if (Array.isArray(insight.tags) && insight.tags.length) {
    return insight.tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return insight.category ? [String(insight.category).trim()].filter(Boolean) : [];
}

function getInsightExcerpt(insight) {
  return insight.excerpt || insight.content || '';
}

function useFallbackImage(event, fallback) {
  if (event.currentTarget.src.endsWith(fallback)) return;
  event.currentTarget.src = fallback;
}

function parseDisplayDate(value) {
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

function TrendingCard({ insight, index, onSelect }) {
  const tags = getInsightTags(insight);
  const excerpt = getInsightExcerpt(insight);

  return (
    <article
      className={styles.trendingCard}
      onClick={onSelect}
      onKeyDown={(event) => openWithKeyboard(event, onSelect)}
      role="link"
      style={{ '--enter-delay': `${Math.min(index, 8) * 35}ms` }}
      tabIndex={0}
    >
      <div className={styles.imageWrap}>
        <img
          src={insight.image || '/figma-assets/detail-similar-1.png'}
          alt=""
          onError={(event) => useFallbackImage(event, '/figma-assets/detail-similar-1.png')}
        />
      </div>
      <div className={styles.trendingCopy}>
        <h2>{insight.title}</h2>
        <div className={styles.tags} aria-label="Insight tags">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <InsightMeta insight={insight} />
        {excerpt ? <p>{excerpt}</p> : null}
        <ReadMore
          href={insight.href}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </article>
  );
}

function AllInsightCard({ insight, index, onSelect }) {
  const tags = getInsightTags(insight);
  const excerpt = getInsightExcerpt(insight);

  return (
    <article
      className={styles.allCard}
      onClick={onSelect}
      onKeyDown={(event) => openWithKeyboard(event, onSelect)}
      role="link"
      style={{ '--enter-delay': `${Math.min(index, 7) * 35}ms` }}
      tabIndex={0}
    >
      <div className={styles.allImageWrap}>
        <img
          src={insight.image || '/figma-assets/detail-similar-1.png'}
          alt=""
          onError={(event) => useFallbackImage(event, '/figma-assets/detail-similar-1.png')}
        />
      </div>
      <div className={styles.allCopy}>
        <h3>{insight.title}</h3>
        <div className={styles.tags} aria-label="Insight tags">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <InsightMeta insight={insight} />
        {excerpt ? <p>{excerpt}</p> : null}
        <ReadMore
          href={insight.href}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </article>
  );
}

function Filter({ filter, isPrimary = false, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const selectedLabel = filter.options.find((option) => option.value === selected)?.label || filter.label;

  useEffect(() => {
    function closeMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <div className={styles.filterWrap} ref={menuRef}>
      <button
        className={`${styles.filter} ${isPrimary ? styles.primaryFilter : ''}`}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {selectedLabel}
        <ChevronDown
          className={isOpen ? styles.chevronOpen : undefined}
          size={16}
          strokeWidth={1.8}
        />
      </button>
      <div className={`${styles.filterMenu} ${isOpen ? styles.filterMenuOpen : ''}`}>
        {filter.options.map((option) => (
          <button
            className={selected === option.value ? styles.filterOptionActive : ''}
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function InsightsView({ insights }) {
  const navigate = useNavigate();
  const sortedInsights = useMemo(
    () =>
      [...insights].sort(
        (a, b) => parseDisplayDate(b.publishedAt || b.date) - parseDisplayDate(a.publishedAt || a.date),
      ),
    [insights],
  );
  const trendingInsights = sortedInsights.slice(0, 9);
  const filterGroups = useMemo(() => {
    const tags = [...new Set(sortedInsights.flatMap((insight) => getInsightTags(insight)))].sort();
    const authors = [...new Set(sortedInsights.map((insight) => insight.author).filter(Boolean))].sort();

    return [
      {
        id: 'tag',
        label: 'All Tags',
        options: [
          { label: 'All Tags', value: '' },
          ...tags.map((tag) => ({ label: tag, value: tag })),
        ],
      },
      {
        id: 'author',
        label: 'All Authors',
        options: [
          { label: 'All Authors', value: '' },
          ...authors.map((author) => ({ label: author, value: author })),
        ],
      },
      {
        id: 'sort',
        label: 'Recommended',
        options: [
          { label: 'Recommended', value: 'recommended' },
          { label: 'Latest', value: 'latest' },
          { label: 'Trending', value: 'trending' },
        ],
      },
    ];
  }, [sortedInsights]);
  const [selectedFilters, setSelectedFilters] = useState({
    author: '',
    sort: 'recommended',
    tag: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(selectedFilters);
  const allInsights = useMemo(() => {
    const filtered = sortedInsights.filter((insight) => {
      const matchesTag = !appliedFilters.tag || getInsightTags(insight).includes(appliedFilters.tag);
      const matchesAuthor = !appliedFilters.author || insight.author === appliedFilters.author;
      return matchesTag && matchesAuthor;
    });

    if (appliedFilters.sort === 'trending') {
      return filtered
        .filter((insight) => insight.trending)
        .sort((a, b) => parseDisplayDate(b.publishedAt || b.date) - parseDisplayDate(a.publishedAt || a.date));
    }

    return filtered.sort(
      (a, b) => parseDisplayDate(b.publishedAt || b.date) - parseDisplayDate(a.publishedAt || a.date),
    );
  }, [appliedFilters, sortedInsights]);
  const clearFilters = () => {
    const nextFilters = {
      author: '',
      sort: 'recommended',
      tag: '',
    };

    setSelectedFilters(nextFilters);
    setAppliedFilters(nextFilters);
  };
  const openInsight = (insight) => {
    navigate(insight.href || `/insights/${insight.slug || insight.id}`);
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs currentTitle="Insights" />

      <section className={styles.section} aria-labelledby="trending-insights">
        <h1 id="trending-insights">Trending Insights</h1>
        <div className={styles.trendingGrid}>
          {trendingInsights.map((insight, index) => (
            <TrendingCard
              insight={insight}
              index={index}
              key={insight.id}
              onSelect={() => openInsight(insight)}
            />
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={`${styles.section} ${styles.allSection}`} aria-labelledby="all-insights">
        <div className={styles.sectionHeader}>
          <h1 id="all-insights">All Insights</h1>
          <a className={styles.headerViewAll} href="#all-insights">
            View All
            <ArrowRight size={18} />
          </a>
        </div>
        <div className={styles.filters} aria-label="Insight filters">
          <span>Filters</span>
          {filterGroups.map((filter, index) => (
            <Filter
              filter={filter}
              isPrimary={index === 0}
              key={filter.id}
              selected={selectedFilters[filter.id]}
              onChange={(value) => {
                setSelectedFilters((current) => {
                  const nextFilters = { ...current, [filter.id]: value };
                  setAppliedFilters(nextFilters);
                  return nextFilters;
                });
              }}
            />
          ))}
          <button
            className={styles.applyFilter}
            type="button"
            onClick={() => setAppliedFilters(selectedFilters)}
          >
            Apply
          </button>
          <button
            className={styles.clearFilter}
            type="button"
            onClick={clearFilters}
          >
            Reset
          </button>
        </div>
        {allInsights.length ? (
          <div className={styles.allGrid}>
            {allInsights.map((insight, index) => (
              <AllInsightCard
                insight={insight}
                index={index}
                key={insight.id}
                onSelect={() => openInsight(insight)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            No insights match these filters.
            <button type="button" onClick={clearFilters}>Reset filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
