import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = BaseProps &
  ComponentPropsWithoutRef<'button'> & { href?: undefined };

type LinkProps = BaseProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

type Props = ButtonProps | LinkProps;

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  );
}
