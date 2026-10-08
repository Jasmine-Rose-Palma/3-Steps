export const TIME_OPTIONS = [
  { value: 'under5', label: 'Under 5 minutes' },
  { value: '5to10', label: '5 to 10 minutes' },
]

export const ENERGY_OPTIONS = [
  { value: 'low', label: 'Low-effort' },
  { value: 'someEffort', label: 'A bit of effort' },
]

export function difficultyLabel(difficulty) {
  const lookup = {
    low: 'Low-effort',
    someEffort: 'A bit of effort',
  }
  return lookup[difficulty] || difficulty;
}

export function formatCompletedDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
}
