const paths: Record<string, string> = {
  shower: 'M4 20V6a3 3 0 0 1 6 0v1M7 10h6l-1-3H8zM8 13v1m4-1v1m-4 3v1m4-1v1',
  shirt: 'm8 4-5 3 3 5 2-1v9h8v-9l2 1 3-5-5-3a4 4 0 0 1-8 0Z',
  cup: 'M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 1h2a3 3 0 0 1 0 6h-2M7 3v2m5-2v2',
  bag: 'M8 6V4h8v2M6 6h12l2 14H4ZM8 13h8v4H8Z',
  stretch: 'M12 8v7m-7-5 7 2 7-2m-7 5-5 6m5-6 5 6',
  task: 'M5 3h14v18H5ZM9 8h6m-6 4h6m-6 4h4',
  travel: 'M3 17h18M5 17V9l2-5h10l2 5v8M5 10h14M7 14h1m8 0h1M7 17v3m10-3v3',
  arrival: 'M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Zm-2-12 2 2 3-4',
};

export default function TaskIcon({ name }: { name: string }) {
  const key = /shower/i.test(name) ? 'shower'
    : /dress/i.test(name) ? 'shirt'
    : /breakfast/i.test(name) ? 'cup'
    : /bag/i.test(name) ? 'bag'
    : /stretch/i.test(name) ? 'stretch'
    : /head out/i.test(name) ? 'travel'
    : /arriv/i.test(name) ? 'arrival'
    : 'task';
  return (
    <svg className="task-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {key === 'stretch' && <circle cx="12" cy="4" r="2" />}
      <path d={paths[key]} />
    </svg>
  );
}
