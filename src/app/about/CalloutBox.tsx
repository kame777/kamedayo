import Link from 'next/link';
import styles from './About.module.css';
import type { CalloutData } from '../data/about';

export default function CalloutBox({ data }: { data: CalloutData }) {
  return (
    <div className={styles.callout}>
      <div>
        {data.date && <p className={styles.calloutDate}>{data.date}</p>}
        {data.title && <p className={styles.calloutTitle}>{data.title}</p>}
        {data.paragraphs.map((para, i) => (
          <p key={i}>
            {para.map((seg, j) =>
              typeof seg === 'string' ? (
                seg
              ) : (
                <Link
                  key={j}
                  href={seg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {seg.text}
                </Link>
              ),
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
