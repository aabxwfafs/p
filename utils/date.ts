import React from 'react';

export const toHijri = (date: Date): string => {
  try {
    // 'ar-SA' for Arabic in Saudi Arabia, 'u-ca-islamic' for Islamic calendar, 'nu-latn' for latin numbers.
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'islamic',
    };
    return new Intl.DateTimeFormat('ar-SA', options).format(date);
  } catch (e) {
    // Fallback for older browsers
    return date.toLocaleDateString('ar-EG');
  }
};
