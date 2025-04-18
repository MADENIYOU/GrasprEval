// @ts-nocheck
"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";

export function BarChartVertical({ data }: { data: { key: string; value: number }[][] }) {
  const [datasets, setDatasets] = useState(data);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDatasets(data);
  }, [data]);

  useEffect(() => {
    if (datasets.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % datasets.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [datasets]);

  if (datasets.length === 0) return <p>Chargement des données...</p>;

  const currentData = datasets[currentIndex];

  const xScale = scaleBand()
    .domain(currentData.map((d) => d.key))
    .range([0, 100])
    .padding(0.3);

  const yScale = scaleLinear()
    .domain([0, max(currentData.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  return (
    <div
      className="relative h-72 w-full grid"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "25px",
          "--marginBottom": "56px",
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      <div className="relative h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        {yScale.ticks(8).map((value, i) => (
          <div
            key={i}
            style={{ top: `${yScale(value)}%` }}
            className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-300 w-full text-right pr-2"
          >
            {value}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        <svg viewBox="0 0 100 100" className="overflow-visible w-full h-full" preserveAspectRatio="none">
          {yScale.ticks(8).map((active, i) => (
            <g key={i} transform={`translate(0,${yScale(active)})`} className="text-gray-300/80">
              <line x1={0} x2={100} stroke="currentColor" strokeDasharray="6,5" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </svg>

        {currentData.map((entry, i) => {
          const xPosition = xScale(entry.key)! + xScale.bandwidth() / 2;
          return (
            <div
              key={i}
              className="absolute overflow-visible text-gray-400"
              style={{
                left: `${xPosition}%`,
                top: "100%",
                transform: "rotate(45deg) translateX(4px) translateY(8px)",
              }}
            >
              <div className="absolute text-xs -translate-y-1/2 whitespace-nowrap">
                {entry.key}
              </div>
            </div>
          );
        })}

        {currentData.map((d, index) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yScale(0) - yScale(d.value);

          return (
            <div
              key={index}
              style={{
                width: `${barWidth}%`,
                height: `${barHeight}%`,
                borderRadius: "6px 6px 0 0",
                marginLeft: `${xScale(d.key)}%`,
              }}
              className="absolute bottom-0 bg-gradient-to-b from-yellow-500 to-blue-400 transition-all duration-1000 ease-in-out"
            />
          );
        })}
      </div>
    </div>
  );
}
