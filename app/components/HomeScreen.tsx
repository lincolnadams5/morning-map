import Link from 'next/link';
import TaskIcon from './TaskIcon';

const sample = [
  { time: '7:43 AM', name: 'Shower', detail: '15 min' },
  { time: '7:58 AM', name: 'Get dressed', detail: '10 min' },
  { time: '8:08 AM', name: 'Breakfast', detail: '15 min' },
  { time: '8:23 AM', name: 'Pack bag', detail: '5 min' },
  { time: '8:28 AM', name: 'Head out', detail: 'Estimated 32 min commute' },
  { time: '9:00 AM', name: 'Arrive', detail: '' },
];

export default function HomeScreen() {
  return (
    <>
      <section className="hero"><div className="hero-copy">
        <h1>Take <em>control</em> of your morning.</h1>
        <p className="hero-description">Turn your arrival time into a morning plan.</p>
        <Link className="primary" href="/plan">Plan my morning <span className="arrow" aria-hidden="true">↗</span></Link>
      </div></section>
      <section className="example" aria-label="Example morning schedule">
        <div className="example-top"><span className="example-title">Your plan</span></div>
        <div className="example-start"><div><p>Your morning starts at</p><div className="time">7:43 <small>AM</small></div></div><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="24" cy="24" r="18" /><path d="M24 12v13l8 5M24 6v3M42 24h-3M24 42v-3M6 24h3" /></svg></div>
        <div className="mini-timeline">{sample.map(item => <div className="mini-row" key={item.name}><time>{item.time}</time><i className="mini-dot" /><div><strong><TaskIcon name={item.name} /><span>{item.name}</span></strong>{item.detail && <small>{item.detail}</small>}</div></div>)}</div>
      </section>
    </>
  );
}
