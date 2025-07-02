import { useEffect } from "react";

export const useInfiniteScroll = (callback: () => void, disabled: boolean) => {
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 300 && !disabled) {
        callback();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [callback, disabled]);
};
