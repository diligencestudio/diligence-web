import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  'inline-flex items-center justify-center gap-2 px-7 py-3 text-xs uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-pure text-obsidian hover:bg-chrome',
  outline: 'border border-titanium/50 text-chrome hover:border-chrome hover:text-pure',
  ghost: 'text-titanium hover:text-pure',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
