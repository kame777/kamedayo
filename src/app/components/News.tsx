'use client';

import styles from './News.module.css';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { newsItems } from '../data/tools';
import { MegaphoneIcon } from './Icons';

export default function News() {
  const sectionRef = useScrollReveal<HTMLElement>(
    `.${styles.card}`,
    styles.visible,
    { threshold: 0.2 },
  );

  return (
    <section className={styles.news} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <MegaphoneIcon size={20} />
            お知らせ
          </h2>
          <ul className={styles.list}>
            {newsItems.map((item, i) => (
              <li key={i} className={styles.item}>
                <time className={styles.date}>{item.date}</time>
                <span className={styles.text}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
