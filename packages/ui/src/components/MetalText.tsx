import type { ElementType, ReactNode } from 'react';

interface MetalTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

/**
 * Titular con acabado metálico plata (replica el look de los assets de marca).
 */
export function MetalText({ as: Tag = 'span', children, className = '' }: MetalTextProps) {
  return <Tag className={`metal-text ${className}`}>{children}</Tag>;
}
