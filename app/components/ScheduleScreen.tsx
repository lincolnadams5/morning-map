'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMorningMap } from '../context/morning-map-context';
import { duration } from '../lib/plan';
import TaskIcon from './TaskIcon';
import Time from './Time';

export default function ScheduleScreen() {
  const router = useRouter();
  const { valid, validArrival, validCommute, selected, setStep, plan, done, toggleDone } = useMorningMap();

  useEffect(() => {
    if (!valid || selected.length === 0) {
      setStep(!validArrival ? 0 : !validCommute ? 1 : 2);
      router.replace('/plan');
    }
  }, [valid, validArrival, validCommute, selected.length, setStep, router]);

  if (!valid || selected.length === 0) return null;

  const complete = selected.filter(task => done.has(task.id)).length;
  const timeline = selected.map((task, index) => ({
    ...task,
    start: plan.start + selected.slice(0, index).reduce((sum, previous) => sum + Number(previous.minutes), 0),
  }));

  return (
    <>
      <div className="page-heading schedule-top"><div><p className="eyebrow">A little more control, from the start</p><h1>Your morning, mapped out</h1><p>One thing at a time. Check off each task as you go.</p></div><button className="secondary" onClick={() => { setStep(2); router.push('/plan'); }}>Edit my plan</button></div>
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
    </>
  );
}
