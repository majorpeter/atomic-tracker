import { useCallback, useEffect, useState } from "react";

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const onWindowResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return windowWidth;
}

/**
 * Responsive Breakpoints of Joy UI
 * @see https://mui.com/material-ui/customization/breakpoints/
 */
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export function useResponsiveBreakpoint(
  breakpoint: keyof typeof breakpoints
): boolean {
  return breakpoints[breakpoint] <= useWindowWidth();
}
