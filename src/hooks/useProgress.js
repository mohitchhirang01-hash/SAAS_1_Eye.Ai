/* FIXED: Optimized data fetching with SWR & Singleton Client (Problem 7, 10, 12) */
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import useSWR from 'swr';
import { getSupabaseClient } from '@/lib/supabase';
import { SYL, TOT } from '@/lib/syllabus';
import { differenceInDays, startOfDay } from 'date-fns';

export function useProgress(userId) {
  const supabase = getSupabaseClient();
  const saveTimeout = useRef(null);

  // SWR for initial load and caching (Problem 6)
  const { data: remoteData, mutate, isLoading } = useSWR(userId ? `user_progress_${userId}` : null, async () => {
    const { data, error } = await supabase
      .from('user_data_v2')
      .select('payload')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is single row not found
    return data?.payload || { done: [], tags: {}, hours: {}, mocks: [] };
  }, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  });

  // Local state for optimistic updates and UI performance
  const [localS, setLocalS] = useState(null);

  // Sync local state when remote data arrives
  useEffect(() => {
    if (remoteData && !localS) {
      setLocalS({
        done: new Set(remoteData.done || []),
        tags: remoteData.tags || {},
        hours: remoteData.hours || {},
        mocks: remoteData.mocks || []
      });
    }
  }, [remoteData, localS]);

  const S = useMemo(() => {
    if (localS) return localS;
    if (remoteData) return {
      done: new Set(remoteData.done || []),
      tags: remoteData.tags || {},
      hours: remoteData.hours || {},
      mocks: remoteData.mocks || []
    };
    return { done: new Set(), tags: {}, hours: {}, mocks: [] };
  }, [localS, remoteData]);

  const save = useCallback((currentS) => {
    if (!userId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        const payload = {
          done: Array.from(currentS.done),
          tags: currentS.tags,
          hours: currentS.hours,
          mocks: currentS.mocks
        };

        await supabase
          .from('user_data_v2')
          .upsert({ id: userId, payload, updated_at: new Date().toISOString() });
          
        mutate(payload, false); // Optimistic update of SWR cache
      } catch (e) {
        console.error('Save failed:', e);
      }
    }, 1500);
  }, [supabase, userId, mutate]);

  const updateDone = (topicId) => {
    const nextDone = new Set(S.done);
    if (nextDone.has(topicId)) nextDone.delete(topicId);
    else nextDone.add(topicId);
    const nextS = { ...S, done: nextDone };
    setLocalS(nextS);
    save(nextS);
  };

  const updateTag = (topicId, tag) => {
    const nextS = { 
      ...S, 
      tags: { ...S.tags, [topicId]: S.tags[topicId] === tag ? null : tag } 
    };
    setLocalS(nextS);
    save(nextS);
  };

  const updateHours = (subject, val) => {
    const today = new Date().toISOString().split('T')[0];
    const nextS = {
      ...S,
      hours: {
        ...S.hours,
        [today]: { ...(S.hours[today] || { math: 0, phys: 0, chem: 0 }), [subject]: val }
      }
    };
    setLocalS(nextS);
    save(nextS);
  };

  const addMock = (mock) => {
    const nextS = { ...S, mocks: [...S.mocks, mock] };
    setLocalS(nextS);
    save(nextS);
  };

  const deleteMock = (index) => {
    const nextS = { ...S, mocks: S.mocks.filter((_, i) => i !== index) };
    setLocalS(nextS);
    save(nextS);
  };

  const getCov = (subject) => {
    const topics = SYL[subject];
    const doneCount = topics.filter(t => S.done.has(t.id)).length;
    const total = TOT[subject];
    return { done: doneCount, total, pct: Math.round((doneCount / total) * 100) };
  };

  const getStreak = () => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().split('T')[0];
      const h = S.hours[k] || {};
      if ((h.math || 0) + (h.phys || 0) + (h.chem || 0) > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const getDL = () => {
    const examDate = new Date('2026-04-09');
    return Math.max(0, differenceInDays(examDate, startOfDay(new Date())));
  };

  return {
    S,
    isLoaded: !isLoading || !!localS,
    updateDone,
    updateTag,
    updateHours,
    addMock,
    deleteMock,
    getCov,
    getStreak,
    getDL,
    refresh: mutate
  };
}
