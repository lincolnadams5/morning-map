export type Task = {
  id: number;
  name: string;
  minutes: string;
  selected: boolean;
};

export function calculatePlan(arrivalTime: string, commuteTime: string, tasks: Task[]) {
  const [hours, minutes] = arrivalTime.split(':').map(Number);
  const arrival = hours * 60 + minutes;
  const preparation = tasks.filter(task => task.selected).reduce((total, task) => total + (Number(task.minutes) || 0), 0);
  const commute = Number(commuteTime) || 0;
  return { arrival, preparation, commute, leave: arrival - commute, start: arrival - commute - preparation, total: commute + preparation };
}

export function timeParts(minutes: number) {
  if (!Number.isFinite(minutes)) return null;
  const day = Math.floor(minutes / 1440);
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  return {
    clock: `${hour % 12 || 12}:${String(normalized % 60).padStart(2, '0')}`,
    period: hour >= 12 ? 'PM' : 'AM',
    day: day < 0 ? day === -1 ? 'Previous day' : `${-day} days earlier` : '',
  };
}

export function duration(minutes: number) {
  return minutes >= 60 ? `${Math.floor(minutes / 60)} hr${minutes % 60 ? ` ${minutes % 60} min` : ''}` : `${minutes} min`;
}
