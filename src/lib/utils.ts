import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type guard to check whether the passed in object is defined.
 */
export function isDefined<T>(obj: T | undefined): obj is T {
  return obj !== undefined && obj !== null
}

export function _isNullOrEmpty(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'string') {
    return value.trim() === ''
  }
  throw new Error('Value must be a string or null or undefined')
  // return value.length === 0
}

export function isNotEmpty<T extends { length?: number; trim?: () => string }>(
  value: T | null | undefined,
): value is T {
  if (value === null || value === undefined) {
    return false
  }
  if (Object.keys(value).length === 0) {
    return false
  }
  if ('trim' in value && value.trim !== undefined) {
    return value.trim() !== ''
  }
  if ('length' in value && value.length !== undefined) {
    return value.length !== 0
  }

  throw new Error('Invalid value')
  // return value.length === 0
}
