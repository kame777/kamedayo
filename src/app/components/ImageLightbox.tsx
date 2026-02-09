'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageLightbox.module.css';

type Props = {
  images: { src: string; alt: string }[];
};

export default function ImageLightbox({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [activeIndex, close, prev, next]);

  return (
    <>
      <div className={styles.gallery}>
        {images.map((img, i) => (
          <div key={img.src} className={styles.thumbWrap} onClick={() => setActiveIndex(i)}>
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={450}
              className={styles.thumb}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className={styles.overlay} onClick={close}>
          <button className={styles.closeBtn} onClick={close} aria-label="閉じる">✕</button>

          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="前へ"
          >
            ‹
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            className={styles.fullImage}
            onClick={(e) => e.stopPropagation()}
            loading="eager"
          />

          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="次へ"
          >
            ›
          </button>

          <span className={styles.counter}>
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
