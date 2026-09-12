'use client';

import { useEffect, useRef, useState } from 'react';
import { calculatePlan, duration, timeParts } from './morning-map-utils';
import type { Task } from './morning-map-utils';

type Screen = 'home' | 'plan' | 'schedule';
const initialTasks: Task[] = [
  { id: 1, name: 'Shower', minutes: '15', selected: true },
  { id: 5, name: 'Get dressed', minutes: '10', selected: true },
  { id: 2, name: 'Breakfast', minutes: '15', selected: true },
  { id: 3, name: 'Pack my bag', minutes: '5', selected: true },
  { id: 4, name: 'Stretch', minutes: '10', selected: false },
];
const sample = [
  { time: '7:43 AM', name: 'Shower', detail: '15 min' },
  { time: '7:58 AM', name: 'Get dressed', detail: '10 min' },
  { time: '8:08 AM', name: 'Breakfast', detail: '15 min' },
  { time: '8:23 AM', name: 'Pack bag', detail: '5 min' },
  { time: '8:28 AM', name: 'Head out', detail: 'Estimated 32 min commute' },
  { time: '9:00 AM', name: 'Arrive', detail: '' },
];

function TaskIcon({ name }: { name: string }) {
  const paths = {
    shower: 'M4 20V6a3 3 0 0 1 6 0v1M7 10h6l-1-3H8zM8 13v1m4-1v1m-4 3v1m4-1v1',
    shirt: 'm8 4-5 3 3 5 2-1v9h8v-9l2 1 3-5-5-3a4 4 0 0 1-8 0Z',
    cup: 'M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 1h2a3 3 0 0 1 0 6h-2M7 3v2m5-2v2',
    bag: 'M8 6V4h8v2M6 6h12l2 14H4ZM8 13h8v4H8Z',
    stretch: 'M12 8v7m-7-5 7 2 7-2m-7 5-5 6m5-6 5 6',
    task: 'M5 3h14v18H5ZM9 8h6m-6 4h6m-6 4h4',
    travel: 'M3 17h18M5 17V9l2-5h10l2 5v8M5 10h14M7 14h1m8 0h1M7 17v3m10-3v3',
    arrival: 'M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Zm-2-12 2 2 3-4',
  };
  const key = /shower/i.test(name) ? 'shower' : /dress/i.test(name) ? 'shirt' : /breakfast/i.test(name) ? 'cup' : /bag/i.test(name) ? 'bag' : /stretch/i.test(name) ? 'stretch' : /head out/i.test(name) ? 'travel' : /arriv/i.test(name) ? 'arrival' : 'task';
  return <svg className="task-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {key === 'stretch' && <circle cx="12" cy="4" r="2" />}
    <path d={paths[key]} />
  </svg>;
}

function Time({ minutes, compact = false }: { minutes: number; compact?: boolean }) {
  const value = timeParts(minutes);
  if (!value) return <>—</>;
  return <>{value.clock} {compact ? value.period : <small>{value.period}</small>}{value.day && <span className="day">{value.day}</span>}</>;
}

export default function MorningMap() {
  const [screen, setScreen] = useState<Screen>('home');
  const [step, setStep] = useState(0);
  const [arrival, setArrival] = useState('09:00');
  const [commute, setCommute] = useState('30');
  const [tasks, setTasks] = useState(initialTasks);
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');
  const nextId = useRef(6);
  const mainRef = useRef<HTMLElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.slice(1);
      setScreen(hash === 'plan' || hash === 'schedule' ? hash : 'home');
      setError('');
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [screen]);

  const plan = calculatePlan(arrival, commute, tasks);
  const selected = tasks.filter(task => task.selected);
  const validArrival = /^([01]\d|2[0-3]):[0-5]\d$/.test(arrival);
  const validCommute = commute !== '' && Number.isInteger(Number(commute)) && Number(commute) >= 0 && Number(commute) <= 720;
  const validDurations = selected.every(task => task.minutes !== '' && Number.isInteger(Number(task.minutes)) && Number(task.minutes) >= 1 && Number(task.minutes) <= 240);
  const valid = validArrival && validCommute && validDurations;

  // A manually entered #schedule URL must not render invalid estimates.
  useEffect(() => {
    if (screen === 'schedule' && (!valid || selected.length === 0)) {
      setStep(!validArrival ? 0 : !validCommute ? 1 : 2);
      window.location.hash = 'plan';
    }
  }, [screen, valid, validArrival, validCommute, selected.length]);

  function navigate(next: Screen) {
    setError('');
    window.location.hash = next;
    setScreen(next);
  }

  function validate() {
    const message = !validArrival ? 'Choose an arrival time to keep going.'
      : !validCommute ? 'Enter a commute from 0 to 720 whole minutes.'
      : step === 2 && selected.length === 0 ? 'Choose at least one task for your morning.'
      : step === 2 && !validDurations ? 'Give each selected task 1 to 240 whole minutes.' : '';
    setError(message);
    return !message;
  }

  function updateTask(id: number, patch: Partial<Task>) {
    setTasks(previous => previous.map(task => task.id === id ? { ...task, ...patch } : task));
    setError('');
  }

  function toggleDone(id: number) {
    setDone(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const complete = selected.filter(task => done.has(task.id)).length;
  let cursor = plan.start;
  const timeline = selected.map(task => {
    const start = cursor;
    cursor += Number(task.minutes);
    return { ...task, start };
  });

  return <div className="morning-map" data-screen={screen}>
    <header>
      <a className="brand" href="#home" onClick={() => navigate('home')} aria-label="Morning Map home">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"><path d="M20 15.57V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586" /><path d="M8 4v16M12 4v16M16 4v16M4 8h16M4 12h16M4 16h16" /></svg>
        Morning Map
      </a>
      {screen !== 'home' && <a className="home-link" href="#home" onClick={() => navigate('home')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" /></svg>Home</a>}
    </header>

    <main ref={mainRef} tabIndex={-1}>
      {screen === 'home' && <>
        <section className="hero"><div className="hero-copy">
          <h1>Take <em>control</em> of your morning.</h1>
          <p className="hero-description">Turn your arrival time into a morning plan.</p>
          <button className="primary" onClick={() => navigate('plan')}>Plan my morning <span className="arrow" aria-hidden="true">↗</span></button>
        </div></section>
        <section className="example" aria-label="Example morning schedule">
          <div className="example-top"><span className="example-title">Your plan</span></div>
          <div className="example-start"><div><p>Your morning starts at</p><div className="time">7:43 <small>AM</small></div></div><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="24" cy="24" r="18" /><path d="M24 12v13l8 5M24 6v3M42 24h-3M24 42v-3M6 24h3" /></svg></div>
          <div className="mini-timeline">{sample.map(item => <div className="mini-row" key={item.name}><time>{item.time}</time><i className="mini-dot" /><div><strong><TaskIcon name={item.name} /><span>{item.name}</span></strong>{item.detail && <small>{item.detail}</small>}</div></div>)}</div>
        </section>
      </>}

      {screen === 'plan' && <>
        <div className="planner-heading"><h1>Plan your morning</h1>
          <aside className="preview" aria-label="Live morning plan">
            <div className="preview-start"><span>Start at</span><div className="preview-time" role="status" aria-live="polite" aria-atomic="true">{valid ? <Time minutes={plan.start} /> : '—'}</div></div>
            <div className="calc">{valid ? <>
              <div className="calc-row"><span>Preparation</span><strong>{duration(plan.preparation)}</strong></div>
              <div className="calc-row"><span>Commute</span><strong>{duration(plan.commute)}</strong></div>
              <div className="calc-row calc-total"><span>Total</span><strong>{duration(plan.total)}</strong></div>
            </> : <p className="helper">Check your time and durations.</p>}</div>
          </aside>
        </div>
        <div className="planner"><section className="walkthrough">
          <nav className="steps" aria-label="Planning questions">{['Arrival', 'Commute', 'Routine'].map((label, index) => <span className="step-item" key={label}>
            {index > 0 && <span className="step-line" aria-hidden="true" />}
            <button className={`step ${step === index ? 'active' : index < step ? 'past' : ''}`} aria-current={step === index ? 'step' : undefined} onClick={() => { if (validate()) setStep(index); }}><span>{index + 1}</span>{label}</button>
          </span>)}</nav>
          <div className="question">
            {step === 0 && <><h2><label htmlFor="arrival">When do you need to arrive?</label></h2><input className="large-input" id="arrival" type="time" required value={arrival} onChange={event => { setArrival(event.target.value); setError(''); }} /></>}
            {step === 1 && <><h2><label htmlFor="commute">How long is your commute?</label></h2><div className="input-unit"><input className="large-input" id="commute" type="number" min="0" max="720" step="1" required inputMode="numeric" value={commute} onChange={event => { setCommute(event.target.value); setError(''); }} /><span>minutes</span></div><p className="helper">Include walking, parking, and waiting.</p></>}
            {step === 2 && <>
              <h2>What’s in your morning?</h2><p>Choose tasks and adjust the minutes.</p>
              <div className="task-list">{tasks.map(task => <div className={`task-edit ${task.selected ? '' : 'off'}`} key={task.id}>
                <input type="checkbox" id={`select-${task.id}`} checked={task.selected} onChange={event => updateTask(task.id, { selected: event.target.checked })} />
                <label className="task-name" htmlFor={`select-${task.id}`}><TaskIcon name={task.name} /><span>{task.name}</span></label>
                <div className="duration"><input type="number" aria-label={`Minutes for ${task.name}`} min="1" max="240" step="1" inputMode="numeric" value={task.minutes} disabled={!task.selected} required onChange={event => updateTask(task.id, { minutes: event.target.value })} /><span>min</span></div>
                {task.id > 5 && <button className="remove" aria-label={`Remove ${task.name}`} onClick={() => setTasks(previous => previous.filter(item => item.id !== task.id))}>×</button>}
              </div>)}</div>
              <form className="custom-form" onSubmit={event => { event.preventDefault(); const name = customName.trim(); if (name) { const id = nextId.current++; setTasks(previous => [...previous, { id, name, minutes: '10', selected: true }]); setCustomName(''); setError(''); } customRef.current?.focus(); }}>
                <input ref={customRef} aria-label="Your own task" placeholder="Add your own task…" maxLength={60} value={customName} onChange={event => setCustomName(event.target.value)} />
                <button className="secondary" type="submit">+ Add</button>
              </form><p className="helper">Tasks follow the order shown.</p>
            </>}
          </div>
          <p className="error" role="alert">{error}</p>
          <div className="walk-nav"><button className="text-button" onClick={() => { setError(''); if (step === 0) navigate('home'); else setStep(step - 1); }}>{step === 0 ? 'Back to home' : '← Back'}</button>
            <button className="primary" onClick={() => { if (validate()) { if (step < 2) setStep(step + 1); else navigate('schedule'); } }}>{step === 2 ? 'See my morning' : 'Continue'} <span className="arrow" aria-hidden="true">→</span></button>
          </div>
        </section></div>
      </>}

      {screen === 'schedule' && valid && selected.length > 0 && <>
        <div className="page-heading schedule-top"><div><p className="eyebrow">A little more control, from the start</p><h1>Your morning, mapped out</h1><p>One thing at a time. Check off each task as you go.</p></div><button className="secondary" onClick={() => { setStep(2); navigate('plan'); }}>Edit my plan</button></div>
        <div className="schedule-layout"><aside className="start-card"><p className="eyebrow">Start your morning at</p><div className="big-time"><Time minutes={plan.start} /></div><div className="leave"><p>Leave at</p><strong><Time minutes={plan.leave} /></strong></div><p className="duration-note">{duration(plan.preparation)} to prepare · {duration(plan.commute)} to travel</p></aside>
          <section aria-label="Your morning timeline"><ol className="schedule-list">
            {timeline.map(task => <li className={`schedule-row ${done.has(task.id) ? 'done' : ''}`} key={task.id}>
              <time><Time minutes={task.start} compact /></time><div className="check-node"><input type="checkbox" id={`done-${task.id}`} aria-label={`${task.name} complete`} checked={done.has(task.id)} onChange={() => toggleDone(task.id)} /></div>
              <label className="schedule-task" htmlFor={`done-${task.id}`}><div className="schedule-task-name"><TaskIcon name={task.name} /><strong>{task.name}</strong></div><span className="duration-text">{task.minutes} min</span></label>
            </li>)}
            <li className="schedule-row"><time><Time minutes={plan.leave} compact /></time><div className="check-node"><span className="fixed-node" /></div><div className="schedule-task"><div><strong>Head out</strong><p>Your commute starts here</p></div><span className="duration-text">{duration(plan.commute)}</span></div></li>
            <li className="schedule-row arrival"><time><Time minutes={plan.arrival} compact /></time><div className="check-node"><span className="fixed-node" /></div><div className="schedule-task"><div><strong>You’ve arrived</strong><p>Ready for what’s next.</p></div></div></li>
          </ol><div className="progress-area" role="status">{complete === selected.length ? 'All set. You’re ready to head out.' : `${complete} of ${selected.length} preparation tasks complete`}<div className="progress-track" aria-hidden="true"><div className="progress-fill" style={{ width: `${complete / selected.length * 100}%` }} /></div></div></section>
        </div>
      </>}
    </main>
    <footer><span>Morning Map</span><span>Make room for your morning.</span></footer>
  </div>;
}
