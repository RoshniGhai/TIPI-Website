import { useState } from 'react';
import { Download, MessageCircle, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import { FormattedContent } from '../FormattedContent/FormattedContent.jsx';
import { createInsightComment, createInsightLike } from '../../services/api.js';
import styles from './InsightDetailView.module.css';

function getInsightTags(insight) {
  if (Array.isArray(insight?.tags) && insight.tags.length) {
    return insight.tags;
  }

  return insight?.category ? [insight.category] : [];
}

function getInsightHref(insight) {
  return insight?.href || `/insights/${insight?.slug || insight?.id}`;
}

function getSimilarInsights(currentInsight, insights) {
  const currentId = currentInsight?.slug || currentInsight?.id;
  const currentTags = new Set(getInsightTags(currentInsight).map((tag) => tag.toLowerCase()));

  return insights
    .filter((item) => {
      const itemId = item.slug || item.id;
      if (!itemId || itemId === currentId) {
        return false;
      }

      return getInsightTags(item).some((tag) => currentTags.has(tag.toLowerCase()));
    })
    .slice(0, 3);
}

export function InsightDetailView({ insight, insights = [], onBack }) {
  const title = insight?.title || 'Sporting Events';
  const mediaItems = insight?.media || [];
  const insightSlug = insight?.slug || insight?.id;
  const similarInsights = getSimilarInsights(insight, insights);
  const [likeCount, setLikeCount] = useState(insight?.like_count || 7700);
  const [likeStatus, setLikeStatus] = useState('idle');
  const [commentStatus, setCommentStatus] = useState('idle');

  const handleLike = async () => {
    if (!insightSlug || likeStatus === 'loading') {
      return;
    }

    setLikeStatus('loading');
    try {
      const response = await createInsightLike(insightSlug, {
        email: `guest-${Date.now()}@tipi.local`,
        name: 'Guest Reader',
      });
      setLikeCount(response.like_count || likeCount + 1);
      setLikeStatus('success');
    } catch {
      setLikeStatus('error');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!insightSlug) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    setCommentStatus('loading');

    try {
      await createInsightComment(insightSlug, {
        comment: data.get('comment'),
      });
      form.reset();
      setCommentStatus('success');
    } catch {
      setCommentStatus('error');
    }
  };

  return (
    <article className={styles.page}>
      <Breadcrumbs currentTitle={title} onBack={onBack} />

      <section className={styles.hero}>
        <h1>{title}</h1>
        <img className={styles.heroImage} src={insight?.image || '/figma-assets/detail-hero.png'} alt="" />
        <div className={styles.authorRow}>
          <img className={styles.avatar} src="/figma-assets/detail-author.png" alt="" />
          <strong>{insight?.author || 'Aryan Choudhary'}</strong>
          <button className={styles.followButton} type="button">Follow</button>
          <span>{insight?.readTime || '7 min Read'}</span>
          <i aria-hidden="true" />
          <span>{insight?.date || '15 March 2026'}</span>
        </div>
        <div className={styles.statsRow}>
          <button type="button" onClick={handleLike} disabled={likeStatus === 'loading'} aria-label="Like insight">
            <ThumbsUp size={28} />{likeCount}
          </button>
          <span><MessageCircle size={28} />1.7k</span>
          <button type="button" aria-label="Download article">
            <Download size={28} />
          </button>
        </div>
      </section>

      <section className={styles.content}>
        <FormattedContent
          className={styles.copyBlock}
          emptyText="No article content has been added for this insight yet."
          value={insight?.content || insight?.excerpt}
        />
        {insight?.image_note ? (
          <FormattedContent className={styles.imageNoteBlock} value={insight.image_note} />
        ) : null}
        {insight?.quote ? (
          <FormattedContent className={styles.quoteBlock} value={insight.quote} />
        ) : null}
        
        {mediaItems.filter(item => !item.is_primary).length ? (
          <section className={styles.mediaBlock} aria-labelledby="insight-media-title">
            <h2 id="insight-media-title">Related Media</h2>
            <div className={styles.mediaGrid}>
              {mediaItems.filter(item => !item.is_primary).map((item) => (
                <figure className={styles.mediaItem} id={`media-${item.id}`} key={item.id}>
                  <img src={item.image || item.thumbnail || item.mediaUrl} alt="" />
                  <figcaption>
                    <strong>{item.title}</strong>
                    <span>{item.description || item.type}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <section className={styles.commentBox} aria-labelledby="comment-title">
        <h2 id="comment-title">Join the Conversation</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea name="comment" placeholder="Write your comment" aria-label="Write your comment" required />
          <button type="submit" disabled={commentStatus === 'loading'}>
            {commentStatus === 'loading' ? 'Posting...' : 'Post Comment'}
          </button>
          {commentStatus === 'success' ? <p className={styles.formStatus}>Comment saved for review.</p> : null}
          {commentStatus === 'error' ? <p className={styles.formStatusError}>Unable to post comment. Try again.</p> : null}
          {likeStatus === 'error' ? <p className={styles.formStatusError}>Unable to save like. Try again.</p> : null}
        </form>
      </section>

      <section className={styles.similar} aria-labelledby="similar-insights">
        <h2 id="similar-insights">Similar Insights</h2>
        {similarInsights.length ? (
          <div className={styles.similarGrid}>
            {similarInsights.map((item) => (
              <Link className={styles.similarCard} to={getInsightHref(item)} key={item.slug || item.id}>
                <img src={item.image || '/figma-assets/detail-similar-1.png'} alt="" />
                <h3>{item.title}</h3>
                <p>
                  <span>{getInsightTags(item)[0] || 'Insight'}</span>
                  <i aria-hidden="true" />
                  {item.date}
                </p>
              </Link>
            ))}
          </div>
        ) : <p className={styles.emptySimilar}>No similar insights are available for this tag yet.</p>}
      </section>
    </article>
  );
}
