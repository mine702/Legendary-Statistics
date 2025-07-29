import {useEffect} from "react";

export const useMobileViewport = () => {
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }
  }, []);
};
