'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Fecha objetivo: 1 de julio de 2026, 00:00:00 hora de Colombia (UTC-5).
const TARGET = new Date('2026-07-01T00:00:00-05:00').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: 'days', label: 'Días' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Minutos' },
  { key: 'seconds', label: 'Segundos' },
];

export function Countdown() {
  // Evita mismatch de hidratación: no renderiza dígitos hasta montar en cliente.
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="mx-auto mt-10 w-full max-w-xl sm:mt-14"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.9 }}
    >
      <div className="mb-6 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-titanium/50" />
        <span className="text-[10px] uppercase tracking-[0.45em] text-titanium">
          Lanzamiento · 1 Julio 2026
        </span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-titanium/50" />
      </div>

      <div className="flex items-start justify-center gap-3 sm:gap-6">
        {UNITS.map((unit, i) => (
          <div key={unit.key} className="flex items-start gap-3 sm:gap-6">
            <div className="flex flex-col items-center">
              <span
                className="metal-text wordmark tabular-nums text-4xl leading-none sm:text-6xl"
                style={{ letterSpacing: '0.05em' }}
                suppressHydrationWarning
              >
                {mounted ? String(time[unit.key]).padStart(2, '0') : '--'}
              </span>
              <span className="mt-3 text-[9px] uppercase tracking-[0.35em] text-titanium sm:text-[10px]">
                {unit.label}
              </span>
            </div>
            {i < UNITS.length - 1 && (
              <span className="metal-text wordmark text-3xl leading-none opacity-40 sm:text-5xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
