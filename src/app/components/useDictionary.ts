"use client";

import { useMemo } from 'react';
import { useLocale } from './useLocale';
import { getDictionary, Dictionary } from '../i18n/dictionaries';

export function useDictionary(): Dictionary {
  const locale = useLocale();
  return useMemo(() => getDictionary(locale), [locale]);
}



