import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiActivity } from 'react-icons/fi';
import AdminSelect from './AdminSelect';

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch {
    // Fallback to raw string
  }
  return dateStr;
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    // Fallback to raw string
  }
  return dateStr;
}

/**
 * Custom hook to smoothly interpolate numbers when data/range changes
 */
function useAnimatedNumber(value, duration = 450) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    prevValueRef.current = value;
    if (startValue === endValue) return;

    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Cubic easeOut: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return displayValue;
}

export default function AnalyticsChart({
  data = [],
  activeRange = '30d',
  onRangeChange,
  loading = false,
}) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const svgRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(1000);
  const [hoverIndex, setHoverIndex] = useState(null);

  const ranges = [
    { label: 'Weekly (7 Days)', shortLabel: 'Weekly', value: '7d' },
    { label: 'Last 30 Days', shortLabel: '30 Days', value: '30d' },
    { label: 'Last 90 Days', shortLabel: '90 Days', value: '90d' },
    { label: 'All Time (1 Year)', shortLabel: 'All Time', value: 'all' },
  ];

  // Dynamically observe container width for full-width responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setContainerWidth(w);
      }
    };
    updateWidth();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.round(entry.contentRect.width));
        }
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Summary Metrics
  const { totalViews, totalVisitors } = useMemo(() => {
    if (!data || data.length === 0) return { totalViews: 0, totalVisitors: 0 };
    return data.reduce(
      (acc, d) => ({
        totalViews: acc.totalViews + (d.views || 0),
        totalVisitors: acc.totalVisitors + (d.uniqueVisitors || 0),
      }),
      { totalViews: 0, totalVisitors: 0 }
    );
  }, [data]);

  // Smooth number counting for metrics
  const animatedViews = useAnimatedNumber(totalViews, 450);
  const animatedVisitors = useAnimatedNumber(totalVisitors, 450);

  // Chart Dimensions & Padding
  const height = 290;
  const paddingLeft = 45;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 42;

  // Adaptive minimum width based on data points to ensure curves & points breathe nicely on smaller screens
  const chartWidth = useMemo(() => {
    if (!data || data.length <= 1) return Math.max(containerWidth, 320);

    let targetPointWidth;
    if (activeRange === '7d') {
      targetPointWidth = 45;
    } else if (activeRange === '30d') {
      targetPointWidth = 24;
    } else if (activeRange === '90d') {
      targetPointWidth = 15;
    } else {
      targetPointWidth = 9;
    }

    const rawWidth = data.length * targetPointWidth + paddingLeft + paddingRight;
    const minThreshold = activeRange === '7d' ? containerWidth : 620;
    const calculated = Math.max(minThreshold, rawWidth);
    return Math.max(containerWidth, calculated);
  }, [data, containerWidth, activeRange]);

  const isScrollable = chartWidth > containerWidth;
  const width = chartWidth;
  const chartW = Math.max(width - paddingLeft - paddingRight, 100);
  const chartH = Math.max(height - paddingTop - paddingBottom, 100);

  // On mount, range change, or when width expands, scroll right so latest dates are immediately in view
  useEffect(() => {
    if (scrollContainerRef.current && isScrollable) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [activeRange, data?.length, isScrollable]);

  // Determine scale
  const highestVal = Math.max(
    ...data.map((d) => Math.max(d.views || 0, d.uniqueVisitors || 0)),
    0
  );

  let maxVal = 5;
  if (highestVal > 0) {
    if (highestVal <= 4) maxVal = 5;
    else if (highestVal <= 8) maxVal = 10;
    else if (highestVal <= 18) maxVal = 20;
    else if (highestVal <= 40) maxVal = 50;
    else if (highestVal <= 85) maxVal = 100;
    else maxVal = Math.ceil(highestVal * 1.15);
  }

  // Calculate points
  const pointsViews = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartW;
    const y = height - paddingBottom - ((d.views || 0) / maxVal) * chartH;
    return { x, y, ...d };
  });

  const pointsVisitors = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartW;
    const y = height - paddingBottom - ((d.uniqueVisitors || 0) / maxVal) * chartH;
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG curve
  const createSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const pathViews = createSmoothPath(pointsViews);
  const areaViews =
    pointsViews.length >= 2
      ? `${pathViews} L ${pointsViews[pointsViews.length - 1]?.x} ${height - paddingBottom} L ${pointsViews[0]?.x} ${height - paddingBottom} Z`
      : '';
  const pathVisitors = createSmoothPath(pointsVisitors);

  // Mouse scrubbing handler
  const handleMouseMove = (e) => {
    if (!svgRef.current || data.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX - paddingLeft) / (chartW || 1);
    const clampedIndex = Math.max(
      0,
      Math.min(data.length - 1, Math.round(relativeX * (data.length - 1)))
    );
    setHoverIndex(clampedIndex);
  };

  // Touch scrubbing handler for mobile devices
  const handleTouch = (e) => {
    if (!svgRef.current || data.length === 0 || !e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const relativeX = (touchX - paddingLeft) / (chartW || 1);
    const clampedIndex = Math.max(
      0,
      Math.min(data.length - 1, Math.round(relativeX * (data.length - 1)))
    );
    setHoverIndex(clampedIndex);
  };

  // Determine active hovered point
  const activePoint =
    hoverIndex !== null && pointsViews[hoverIndex]
      ? pointsViews[hoverIndex]
      : null;

  const activeVisitorPoint =
    hoverIndex !== null && pointsVisitors[hoverIndex]
      ? pointsVisitors[hoverIndex]
      : null;

  // Exact boundary clamping for tooltip positioning (prevents overflow on right, left, and top)
  const tooltipWidth = 180;
  const tooltipHeight = 84;

  const clampedLeft = activePoint
    ? Math.max(8, Math.min(width - tooltipWidth - 8, activePoint.x - tooltipWidth / 2))
    : 0;

  const isNearTop = activePoint ? activePoint.y - tooltipHeight - 14 < 0 : false;
  const clampedTop = activePoint
    ? isNearTop
      ? Math.max(8, activePoint.y + 14)
      : Math.max(8, activePoint.y - tooltipHeight - 12)
    : 0;

  // Grid tick lines
  const tickSteps = [0, 0.25, 0.5, 0.75, 1];

  // Filter date labels so adjacent labels are guaranteed never to collide
  const renderedDateLabels = useMemo(() => {
    if (!pointsViews || pointsViews.length === 0) return [];
    if (pointsViews.length === 1) {
      return [{ ...pointsViews[0], anchor: 'middle', index: 0 }];
    }

    const minLabelGap = 55; // minimum horizontal px gap between date labels
    const result = [];
    let lastX = -Infinity;
    const lastPoint = pointsViews[pointsViews.length - 1];

    pointsViews.forEach((p, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === pointsViews.length - 1;

      if (isFirst) {
        result.push({ ...p, anchor: 'start', index: idx });
        lastX = p.x;
        return;
      }

      if (isLast) {
        // If too close to previous intermediate label, remove previous label so latest date always shows
        if (p.x - lastX < minLabelGap && result.length > 1) {
          result.pop();
        }
        result.push({ ...p, anchor: 'end', index: idx });
        return;
      }

      // Intermediate points: only display if adequately spaced from last rendered label AND from final point
      if (p.x - lastX >= minLabelGap && lastPoint.x - p.x >= minLabelGap) {
        result.push({ ...p, anchor: 'middle', index: idx });
        lastX = p.x;
      }
    });

    return result;
  }, [pointsViews]);

  const hasData = data && data.length > 0;

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300">
      {/* Subtle Shimmer Refresh Line during range fetch */}
      {loading && (
        <div className="absolute top-0 inset-x-0 h-[2.5px] rounded-t-2xl bg-amber-100 overflow-hidden z-20">
          <div className="h-full w-2/5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-marquee" />
        </div>
      )}

      {/* Header: Title, Metric Badges & Days Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              User Activity
            </h3>
            {/* {isScrollable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 sm:hidden">
                ↔ Scrollable
              </span>
            )} */}
          </div>
          <p className="text-sm text-slate-500 mt-0.5 font-semibold">
            Real-time visitor page views & uniques breakdown
          </p>
        </div>

        {/* Right side: Legend & Dropdown filter */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Legend Badges with Animated Smooth Numbers */}
          <div className="flex items-center gap-4 text-[13px] font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="size-2.5 rounded-full bg-amber-400 shadow-xs" />
              <span>Views</span>
              <span className="font-bold font-mono text-slate-900 min-w-[28px] tabular-nums">
                {(activePoint ? activePoint.views : animatedViews).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="size-2.5 rounded-full bg-slate-400" />
              <span>Uniques</span>
              <span className="font-bold font-mono text-slate-700 min-w-[28px] tabular-nums">
                {(activePoint ? activePoint.uniqueVisitors : animatedVisitors).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Days Filter Dropdown */}
          <AdminSelect
            options={ranges}
            value={activeRange}
            onChange={onRangeChange}
            icon={FiCalendar}
            headerTitle="Select Time Range"
            align="right"
          />
        </div>
      </div>

      {/* Chart Canvas Area */}
      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-3 border border-amber-200/50">
            <FiActivity className="size-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No visitor traffic recorded for this period
          </p>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Try switching to another time range using the dropdown above.
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="mt-4 w-full select-none">
          {/* Scrollable Container for small screens */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto custom-scrollbar touch-pan-x pb-2"
          >
            <div
              className="relative"
              style={{ width: `${width}px`, minWidth: `${width}px` }}
            >
              {/* Floating Tooltip Card */}
              <AnimatePresence>
                {activePoint && hoverIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="pointer-events-none absolute z-30 transition-[left,top] duration-75 ease-out"
                    style={{
                      left: `${clampedLeft}px`,
                      top: `${clampedTop}px`,
                      width: `${tooltipWidth}px`,
                    }}
                  >
                    <div className="w-full rounded-xl border border-slate-700/80 bg-[#0f1117]/95 px-3 py-2.5 shadow-2xl backdrop-blur-md">
                      <p className="text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5 whitespace-nowrap text-center">
                        {formatFullDate(activePoint.date)}
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-amber-400 shrink-0" />
                            <span className="text-slate-300 font-medium whitespace-nowrap">Page Views</span>
                          </div>
                          <span className="font-bold text-white font-mono tabular-nums">
                            {activePoint.views}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-slate-400 shrink-0" />
                            <span className="text-slate-300 font-medium whitespace-nowrap">Unique Visitors</span>
                          </div>
                          <span className="font-bold text-slate-300 font-mono tabular-nums">
                            {activePoint.uniqueVisitors}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible cursor-crosshair block"
                style={{ width: `${width}px`, height: `${height}px` }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
                onTouchStart={handleTouch}
                onTouchMove={handleTouch}
              >
                <defs>
                  {/* Modern Golden Amber Gradient Fill */}
                  <linearGradient id="amberWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Subtle glow filter for the active point */}
                  <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#f59e0b" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Clean Horizontal Grid Lines & Y-axis labels */}
                {tickSteps.map((pct) => {
                  const y = height - paddingBottom - pct * chartH;
                  const val = Math.round(pct * maxVal);
                  return (
                    <g key={pct} className="transition-all duration-300">
                      {pct === 0 && (
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={width - paddingRight}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeWidth="1.5"
                        />
                      )}
                      <text
                        x={paddingLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                      </text>
                    </g>
                  );
                })}

                {/* Smooth Animated Views Area Gradient Fill */}
                {areaViews && (
                  <motion.path
                    key={`area-${activeRange}-${data.length}`}
                    d={areaViews}
                    fill="url(#amberWaveGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                  />
                )}

                {/* Smooth Animated Secondary Line: Unique Visitors (Subtle Slate Solid) */}
                {pathVisitors && (
                  <motion.path
                    key={`visitors-${activeRange}-${data.length}`}
                    d={pathVisitors}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}

                {/* Smooth Animated Hero Line: Page Views (Golden Amber Vibrant Stroke) */}
                {pathViews && (
                  <motion.path
                    key={`views-${activeRange}-${data.length}`}
                    d={pathViews}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}

                {/* Hover Indicators */}
                {activePoint && (
                  <g pointerEvents="none">
                    {/* Glowing Dot on Views Hero Line */}
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="5.5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      filter="url(#pointGlow)"
                    />

                    {/* Subtle Dot on Visitors Line */}
                    {activeVisitorPoint && (
                      <circle
                        cx={activeVisitorPoint.x}
                        cy={activeVisitorPoint.y}
                        r="4"
                        fill="#94a3b8"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                )}

                {/* X-axis Clean Date Labels with Smooth Transition */}
                <motion.g
                  key={`dates-${activeRange}-${data.length}`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                >
                  {renderedDateLabels.map((p) => (
                    <text
                      key={p.index}
                      x={p.x}
                      y={height - paddingBottom + 22}
                      textAnchor={p.anchor}
                      fill="#94a3b8"
                      fontSize="11"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      {formatShortDate(p.date)}
                    </text>
                  ))}
                </motion.g>
              </svg>
            </div>
          </div>

          {/* Mobile Scroll Indicator Helper */}
          {/* {isScrollable && (
            <div className="flex items-center justify-between pt-1.5 px-1 text-[11px] font-semibold text-slate-400 sm:hidden">
              <span>← Swipe timeline to explore</span>
              <span>Latest ({data[data.length - 1]?.date ? formatShortDate(data[data.length - 1].date) : 'Today'}) →</span>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
