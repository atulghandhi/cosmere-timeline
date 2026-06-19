import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { UserBookStatus, UserData } from '../types';

export function useUserBooks() {
  const [bookStatuses, setBookStatuses] = useState<Record<string, UserBookStatus>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await get<UserData>('sanderson-timeline-user');
        if (storedData && storedData.bookStatuses) {
          setBookStatuses(storedData.bookStatuses);
        }
      } catch (err) {
        console.error("Failed to load user data from IndexedDB", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadUserData();
  }, []);

  const setStatus = async (bookId: string, status: UserBookStatus) => {
    const newStatuses = { ...bookStatuses, [bookId]: status };
    if (status === null) {
      delete newStatuses[bookId];
    }
    setBookStatuses(newStatuses);
    
    try {
      await set('sanderson-timeline-user', { bookStatuses: newStatuses });
    } catch (err) {
      console.error("Failed to save user data to IndexedDB", err);
    }
  };

  return { bookStatuses, setStatus, isLoaded };
}
