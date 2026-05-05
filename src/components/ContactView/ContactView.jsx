import { useState } from 'react';
import { ArrowRight, Facebook, Instagram, Twitter } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs.jsx';
import { createContactMessage } from '../../services/api.js';
import styles from './ContactView.module.css';

const socialLinks = [
  { label: 'Facebook', href: '#facebook', Icon: Facebook },
  { label: 'Instagram', href: '#instagram', Icon: Instagram },
  { label: 'Twitter', href: '#twitter', Icon: Twitter },
];

export function ContactView() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('loading');

    try {
      await createContactMessage({
        email: data.get('email'),
        message: data.get('message'),
        name: data.get('name'),
        phone: data.get('phone'),
        source: 'contact-page',
      });
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Breadcrumbs currentTitle="Contact Us" />

        <section className={styles.hero} aria-labelledby="contact-title">
          <div className={styles.heroText}>
            <h1 id="contact-title">Get in touch with us. We&apos;re here to assist you.</h1>
          </div>
          <div className={styles.socialRail} aria-label="Social media">
            {socialLinks.map(({ label, href, Icon }) => (
              <a href={href} aria-label={label} key={label}>
                <Icon size={18} strokeWidth={2.1} />
              </a>
            ))}
          </div>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>
              <span>Your Name</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Email Address</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label>
              <span>Phone Number (optional)</span>
              <input type="tel" name="phone" autoComplete="tel" />
            </label>
          </div>
          <label className={styles.messageField}>
            <span>Message</span>
            <textarea name="message" rows="3" required />
          </label>
          <button className={styles.submitButton} type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Leave us a Message'}
            <ArrowRight size={28} strokeWidth={1.7} />
          </button>
          {status === 'success' ? (
            <p className={styles.formStatus}>Thanks, your message has been saved.</p>
          ) : null}
          {status === 'error' ? (
            <p className={styles.formStatusError}>Something went wrong. Please try again.</p>
          ) : null}
        </form>
      </div>

      <section className={styles.infoBand} aria-labelledby="contact-info-title">
        <div className={styles.infoInner}>
          <div className={styles.infoHeading}>
            <p>Contact Info</p>
            <h2 id="contact-info-title">We are always happy to assist you</h2>
          </div>
          <div className={styles.details}>
            <h3>Contact Details</h3>
            <span className={styles.detailRule} aria-hidden="true" />
            <a href="mailto:help@info.com">help@info.com</a>
            <a href="tel:+180899834256">(808) 998-34256</a>
            <p>
              Assistance hours:
              <br />
              Monday - Friday 9 am to 7 pm EST
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
