import { useCallback, useRef } from 'react';

export const useInfiniteScroll = (action, enabled, offset = '1500px') => {
  const observerRef = useRef(null);

  const lastItemRef = useCallback(
    (node) => {
      if (!enabled) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            action();
          }
        },
        {
          scrollMargin: `0px 0px ${offset} 0px`, // Trigger when `offset` away from the bottom
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [action, enabled, offset]
  );

  return { lastItemRef };
};
