import type { MonthType } from '../types';
import isLeapYear from '../utils/isLeapYear.util';

// Get the list of Years
export const useGetYears = (): number[] => {
  const years: number[] = [];

  const end = new Date().getFullYear();
  const start = end - 120;

  for (let year = end; year >= start; year--) {
    years.push(year);
  }
  return years;
};

// Get the list of Days
export const useGetDays = (month: MonthType, year: number): number[] => {
  const days: number[] = [];

  let dayLimit: number = 0;

  if (
    month === 'January' ||
    month === 'March' ||
    month === 'May' ||
    month === 'July' ||
    month === 'August' ||
    month === 'October' ||
    month === 'December'
  ) {
    dayLimit = 31;
  } else if (month === 'February') {
    dayLimit = isLeapYear(year) ? 29 : 28;
  } else {
    dayLimit = 30;
  }

  for (let day = 1; day <= dayLimit; day++) {
    days.push(day);
  }
  return days;
};

// Get post date
// TODO: implement 'time from'
export const useGetPostDate = (date: string | undefined) => {
  if (!date) {
    return '';
  }

  const day = new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
  });
  const month = new Date(date).toLocaleString('en-IN', {
    month: 'short',
  });
  const year = new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
  });

  const final = `${month} ${day}, ${year}`;

  return final;
};

// Get post time
export const useGetPostTime = (date: string | undefined) => {
  if (!date) {
    return '';
  }

  const time = new Date(date).toLocaleString('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return time;
};

export const useGetBirthday = (date: string | null) => {
  if (!date) return '';

  const day = new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
  });
  const month = new Date(date).toLocaleString('en-IN', {
    month: 'long',
  });
  const year = new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
  });

  return `${month} ${day}, ${year}`;
};

export const useGetJoiningDate = (date: string | null) => {
  if (!date) return '';

  const month = new Date(date).toLocaleString('en-IN', {
    month: 'long',
  });
  const year = new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
  });

  return `${month} ${year}`;
};
