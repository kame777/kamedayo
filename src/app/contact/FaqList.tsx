'use client';

import { useState } from 'react';
import { faqs } from '../data/faq';
import styles from './Contact.module.css';

export default function FaqList() {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className={styles.faqList}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`${styles.faqItem} ${openSet.has(i) ? styles.faqItemOpen : ''}`}
          style={{ '--faq-i': i } as React.CSSProperties}
        >
          <button
            className={styles.faqQuestion}
            onClick={() => toggle(i)}
            aria-expanded={openSet.has(i)}
          >
            {faq.q}
          </button>
          <div className={styles.faqAnswerWrapper}>
            <p className={styles.faqAnswer}>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}