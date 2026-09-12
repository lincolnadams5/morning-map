'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { calculatePlan } from '../lib/plan';
import type { Task } from '../lib/plan';

const initialTasks: Task[] = [
  { id: 1, name: 'Shower', minutes: '15', selected: true },
  { id: 5, name: 'Get dressed', minutes: '10', selected: true },
  { id: 2, name: 'Breakfast', minutes: '15', selected: true },
  { id: 3, name: 'Pack my bag', minutes: '5', selected: true },
  { id: 4, name: 'Stretch', minutes: '10', selected: false },
];

type MorningMapContextValue = {
  arrival: string;
  setArrival: (value: string) => void;
  commute: string;
  setCommute: (value: string) => void;
  tasks: Task[];
  updateTask: (id: number, patch: Partial<Task>) => void;
  addTask: (name: string) => void;
  removeTask: (id: number) => void;
  done: Set<number>;
  toggleDone: (id: number) => void;
  step: number;
  setStep: (step: number) => void;
  plan: ReturnType<typeof calculatePlan>;
  selected: Task[];
  validArrival: boolean;
  validCommute: boolean;
  validDurations: boolean;
  valid: boolean;
};

const MorningMapContext = createContext<MorningMapContextValue | null>(null);

export function MorningMapProvider({ children }: { children: ReactNode }) {
  const [arrival, setArrival] = useState('09:00');
  const [commute, setCommute] = useState('30');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const [step, setStep] = useState(0);
  const nextId = useRef(6);

  function updateTask(id: number, patch: Partial<Task>) {
    setTasks(previous => previous.map(task => task.id === id ? { ...task, ...patch } : task));
  }

  function addTask(name: string) {
    const id = nextId.current++;
    setTasks(previous => [...previous, { id, name, minutes: '10', selected: true }]);
  }

  function removeTask(id: number) {
    setTasks(previous => previous.filter(task => task.id !== id));
  }

  function toggleDone(id: number) {
    setDone(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const plan = calculatePlan(arrival, commute, tasks);
  const selected = tasks.filter(task => task.selected);
  const validArrival = /^([01]\d|2[0-3]):[0-5]\d$/.test(arrival);
  const validCommute = commute !== '' && Number.isInteger(Number(commute)) && Number(commute) >= 0 && Number(commute) <= 720;
  const validDurations = selected.every(task => task.minutes !== '' && Number.isInteger(Number(task.minutes)) && Number(task.minutes) >= 1 && Number(task.minutes) <= 240);
  const valid = validArrival && validCommute && validDurations;

  return (
    <MorningMapContext.Provider value={{
      arrival, setArrival, commute, setCommute, tasks, updateTask, addTask, removeTask,
      done, toggleDone, step, setStep, plan, selected, validArrival, validCommute, validDurations, valid,
    }}>
      {children}
    </MorningMapContext.Provider>
  );
}

export function useMorningMap() {
  const context = useContext(MorningMapContext);
  if (!context) throw new Error('useMorningMap must be used within a MorningMapProvider');
  return context;
}
