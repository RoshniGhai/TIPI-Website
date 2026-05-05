import DOMPurify from 'dompurify';
import styles from './FormattedContent.module.css';

function isHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function textToHtml(value) {
  return value
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');
}

export function formatContentHtml(value) {
  const content = value || '';
  const html = isHtml(content) ? content : textToHtml(content);
  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['href', 'rel', 'target'],
    ALLOWED_TAGS: ['a', 'blockquote', 'br', 'em', 'h2', 'h3', 'h4', 'li', 'ol', 'p', 'strong', 'ul'],
  });
}

export function FormattedContent({ className = '', emptyText = 'No content has been added yet.', value }) {
  const html = formatContentHtml(value);

  if (!html) {
    return <p className={`${styles.empty} ${className}`}>{emptyText}</p>;
  }

  return (
    <div
      className={`${styles.content} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
