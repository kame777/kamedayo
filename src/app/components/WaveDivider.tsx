import styles from './WaveDivider.module.css';

type Props = {
  /** 上のセクションの色に合わせる */
  fillTop?: string;
  /** 下のセクションの色に合わせる */
  fillBottom?: string;
  /** 上下反転 */
  flip?: boolean;
};

export default function WaveDivider({
  fillTop,
  fillBottom,
  flip = false,
}: Props) {
  return (
    <div
      className={`${styles.wrapper} ${flip ? styles.flip : ''}`}
      aria-hidden="true"
      style={{ background: fillTop || 'var(--hero-solid)' }}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C240,100 480,0 720,60 C960,120 1200,20 1440,80 L1440,120 L0,120 Z"
          fill={fillBottom || 'var(--page-grad-end)'}
        />
        <path
          d="M0,60 C360,120 720,0 1080,80 C1260,110 1380,50 1440,70 L1440,120 L0,120 Z"
          fill={fillBottom || 'var(--page-grad-end)'}
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
