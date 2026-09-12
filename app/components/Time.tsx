import { timeParts } from '../lib/plan';

export default function Time({ minutes, compact = false }: { minutes: number; compact?: boolean }) {
  const value = timeParts(minutes);
  if (!value) return <>—</>;
  return <>{value.clock} {compact ? value.period : <small>{value.period}</small>}{value.day && <span className="day">{value.day}</span>}</>;
}
