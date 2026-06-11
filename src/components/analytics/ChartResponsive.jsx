import React, { useEffect, useRef, useState } from "react";
import { ResponsiveContainer } from "recharts";
import cn from "../../lib/cn";

/**
 * Recharts needs a parent with positive width & height.
 * Measures the container via ResizeObserver before mounting the chart.
 */
const ChartResponsive = ({ children, className = "", minHeight = 288 }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : el.clientWidth;
      const height = rect.height > 0 ? rect.height : Math.max(el.clientHeight, minHeight);
      if (width > 0 && height > 0) {
        setSize({ width: Math.floor(width), height: Math.floor(height) });
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [minHeight]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full min-w-0", className)}
      style={!className.match(/\bh-/) ? { minHeight } : undefined}
    >
      {size ? (
        <ResponsiveContainer width={size.width} height={size.height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};

export default ChartResponsive;
