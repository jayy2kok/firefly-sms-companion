import { fromObject } from '@nativescript/core';

/**
 * Converts a date object to a formatted string based on the provided format
 */
export function dateConverter(value: Date, format: string): string {
  if (!value) {
    return '';
  }

  if (!(value instanceof Date)) {
    value = new Date(value);
  }

  const formatOptions = {
    'MM/dd/yyyy': {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    },
    'MM/dd/yyyy hh:mm a': {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  };

  try {
    const options = formatOptions[format] || formatOptions['MM/dd/yyyy'];
    return value.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return value.toLocaleDateString();
  }
}

// Register the converter
export const dateConverterInstance = fromObject({
  toView: dateConverter
});