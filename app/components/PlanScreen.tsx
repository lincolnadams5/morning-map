'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMorningMap } from '../context/morning-map-context';
import { duration } from '../lib/plan';
import TaskIcon from './TaskIcon';
import Time from './Time';

export default function PlanScreen() {
  const router = useRouter();
  const {
    arrival, setArrival, commute, setCommute, tasks, updateTask, addTask, removeTask,
    step, setStep, plan, selected, validArrival, validCommute, validDurations, valid,
  } = useMorningMap();
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');
  const customRef = useRef<HTMLInputElement>(null);

  function validate() {
    const message = !validArrival ? 'Choose an arrival time to keep going.'
      : !validCommute ? 'Enter a commute from 0 to 720 whole minutes.'
      : step === 2 && selected.length === 0 ? 'Choose at least one task for your morning.'
      : step === 2 && !validDurations ? 'Give each selected task 1 to 240 whole minutes.' : '';
    setError(message);
    return !message;
  }

  return (
    <>
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
              {task.id > 5 && <button className="remove" aria-label={`Remove ${task.name}`} onClick={() => removeTask(task.id)}>×</button>}
            </div>)}</div>
            <form className="custom-form" onSubmit={event => { event.preventDefault(); const name = customName.trim(); if (name) { addTask(name); setCustomName(''); setError(''); } customRef.current?.focus(); }}>
              <input ref={customRef} aria-label="Your own task" placeholder="Add your own task…" maxLength={60} value={customName} onChange={event => setCustomName(event.target.value)} />
              <button className="secondary" type="submit">+ Add</button>
            </form><p className="helper">Tasks follow the order shown.</p>
          </>}
        </div>
        <p className="error" role="alert">{error}</p>
        <div className="walk-nav"><button className="text-button" onClick={() => { setError(''); if (step === 0) router.push('/'); else setStep(step - 1); }}>{step === 0 ? 'Back to home' : '← Back'}</button>
          <button className="primary" onClick={() => { if (validate()) { if (step < 2) setStep(step + 1); else router.push('/schedule'); } }}>{step === 2 ? 'See my morning' : 'Continue'} <span className="arrow" aria-hidden="true">→</span></button>
        </div>
      </section></div>
    </>
  );
}
