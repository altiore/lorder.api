export function secondsToDays(sec: number): number {
  return Math.ceil(sec / 86400);
}

export function daysToMonths(days: number): number {
  return Math.ceil(days / 30.4375);
}

export function millisecondsTo8hoursDays(milliseconds: number): number {
  return Math.round((milliseconds * 100) / 20571000) / 100;
}

export function timeProductivity(workingDays: number, days: number, membersCount: number) {
  return Math.floor((workingDays * 10000) / days / membersCount) / 10000;
}
