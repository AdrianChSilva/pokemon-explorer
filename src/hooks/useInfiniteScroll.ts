import { useEffect, useRef } from "react";

export const SCROLL_THRESHOLD_PX = 300;

export const useInfiniteScroll = (callback: () => void, disabled: boolean) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;

        if (
          scrollTop + windowHeight >= documentHeight - SCROLL_THRESHOLD_PX &&
          !disabled
        ) {
          callback();
        }
      }, 100);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, disabled]);
};
