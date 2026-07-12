import { useCallback, useEffect, useRef, useState } from 'react';
import { get, set } from 'idb-keyval';
import { UserBookStatus, UserData } from '../types';

const STORAGE_KEY = 'sanderson-timeline-user';

export function useUserBooks() {
  const [bookStatuses, setBookStatuses] = useState<Record<string, UserBookStatus>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const latest = useRef(bookStatuses);
  latest.current = bookStatuses;

  useEffect(() => {
    let cancelled = false;
    get<UserData>(STORAGE_KEY)
      .then((stored) => {
        if (!cancelled && stored?.bookStatuses) {
          setBookStatuses(stored.bookStatuses);
        }
      })
      .catch((err) => console.error('Failed to load user data from IndexedDB', err))
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setStatus = useCallback((bookId: string, status: UserBookStatus) => {
    setBookStatuses((prev) => {
      const next = { ...prev };
      if (status === null) {
        delete next[bookId];
      } else {
        next[bookId] = status;
      }
      set(STORAGE_KEY, { bookStatuses: next }).catch((err) =>
        console.error('Failed to save user data to IndexedDB', err)
      );
      return next;
    });
  }, []);

  return { bookStatuses, setStatus, isLoaded };
}
