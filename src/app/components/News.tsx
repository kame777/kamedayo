'use client';

import styles from './News.module.css';
import { useEffect, useRef } from 'react';

const newsItems = [
  { date: '2026/02/10', text: 'メインページを大幅リニューアルしました！' },
  { date: '2025/11/15', text: 'メインページリニューアルしました！' },
];

export default function News() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.2 }
    );

    const el = section.querySelector(`.${styles.card}`);
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.news} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>📢</span>
            近況報告
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
