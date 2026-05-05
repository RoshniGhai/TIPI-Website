import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { createSubscriber } from '../../services/api.js';
import styles from './SubscribeModal.module.css';

export function SubscribeModal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setStatus('idle');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('loading');

    try {
      await createSubscriber({
        email: data.get('email'),
        name: data.get('name'),
        organization: data.get('organization'),
      });
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <img className={styles.image} src="/figma-assets/subscribe-news.png" alt="" />
        <form className={styles.content} onSubmit={handleSubmit}>
          <button
            className={styles.closeButton}
            type="button"
            aria-label="Close subscribe modal"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <X size={32} strokeWidth={2.2} />
          </button>

          <h2 id="subscribe-modal-title">Latest News delivered weekly.</h2>
          <p className={styles.description}>
            Stay up to date with the latest articles and news updates. You&apos;ll even get special
            recommendations weekly.
          </p>

          <label className={styles.field}>
            <span>Name</span>
            <input type="text" name="name" placeholder="Enter your name" autoComplete="name" required />
          </label>

          <label className={styles.field}>
            <span>Organization Name</span>
            <input
              type="text"
              name="organization"
              placeholder="Enter your Organization Name"
              autoComplete="organization"
            />
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input type="email" name="email" placeholder="Enter your email address" autoComplete="email" required />
          </label>

          <button className={styles.submitButton} type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Submit'}
          </button>
          {status === 'success' ? <p className={styles.formStatus}>You are subscribed.</p> : null}
          {status === 'error' ? <p className={styles.formStatusError}>Unable to subscribe. Try again.</p> : null}
        </form>
      </section>
    </div>
  );
}
