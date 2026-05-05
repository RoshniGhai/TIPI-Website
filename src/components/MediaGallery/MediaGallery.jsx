import { ArrowRight, Image as ImageIcon, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SectionHeading } from '../SectionHeading/SectionHeading.jsx';
import styles from './MediaGallery.module.css';

export function MediaGallery({
  items,
  title = 'Media Gallery',
  subtitle = 'Some random txt about explaining Insights',
  sectionId = 'media',
  actionHref = '#media',
}) {
  const featured = items.find((item) => item.featured);
  const rest = items.filter((item) => !item.featured);

  if (!featured) {
    return null;
  }

  return (
    <section className={styles.section} id={sectionId}>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        href={actionHref}
        hideAction
      />
      <div className={styles.gallery}>
        <MediaTile item={featured} featured />
        {rest.map((item) => (
          <MediaTile item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

function MediaTile({ item, featured = false }) {
  const navigate = useNavigate();
  const content = (
    <>
      <img src={item.image} alt="" />
      <Badge type={item.type} />
      <p className={styles.hoverCaption}>{item.description || item.title}</p>
      {featured ? (
        <div className={styles.featuredCaption}>
          <h3>{item.title}</h3>
          <span aria-hidden="true">
            <ArrowRight size={22} />
          </span>
        </div>
      ) : null}
    </>
  );

  if (item.href?.startsWith('/')) {
    return (
      <Link
        className={`${styles.tile} ${featured ? styles.featured : ''}`}
        id={`media-${item.id}`}
        to={item.href}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      className={`${styles.tile} ${featured ? styles.featured : ''}`}
      href={item.href}
      id={`media-${item.id}`}
    >
      {content}
    </a>
  );
}

function Badge({ type }) {
  const Icon = type === 'Video' ? Video : ImageIcon;

  return (
    <span className={styles.badge}>
      <Icon size={13} />
      {type}
    </span>
  );
}
