//@ts-nocheck

"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import { scaleBand, scaleLinear, max } from "d3";

export function BarChartVertical({ data }: { data: { note: string; nombre_etudiants: number }[] }) {
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  if (chartData.length === 0) return <p>Aucune donnée à afficher pour le moment !</p>;

  // Transformation des données 'note' en objet
  const transformedData = chartData.map((d) => ({
    ...d,
    note: typeof d.note === "string" ? JSON.parse(d.note) : d.note, // Parser uniquement si c'est une chaîne JSON
  }));

  // xScale et yScale restent inchangés
  const xScale = scaleBand()
    .domain(Object.keys(transformedData[0]?.note || {}))  // Utilisation des clés des notes comme labels
    .range([0, 100])
    .padding(0.3);

  const yScale = scaleLinear()
    .domain([0, max(transformedData.map((d) => d.nombre_etudiants)) ?? 0])
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
      {/* Axe Y - valeurs */}
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

      {/* Lignes et barres */}
      <div className="absolute inset-0 h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[calc(100%-var(--marginLeft)-var(--marginRight))] translate-x-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible">
        {yScale.ticks(8).map((active, i) => (
          <div key={i} style={{ top: `${yScale(active)}%` }} className="absolute w-full h-px bg-gray-300/80" />
        ))}

        {transformedData.map((d, index) => {
          const noteEntries = Object.entries(d.note); // Récupère les paires [note, count]
          return noteEntries.map(([note, count], subIndex) => {
            const barWidth = xScale.bandwidth();
            const barHeight = yScale(0) - yScale(count); // Hauteur basée sur le nombre d'étudiants
            const xPosition = xScale(note);

            return (
              <div
                key={`${index}-${subIndex}`} // Utiliser un key unique par barre
                className="absolute bottom-0 bg-gradient-to-b from-green-500 to-blue-400 transition-all duration-1000 ease-in-out"
                style={{
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                  left: `${xPosition}%`,
                  borderRadius: "6px 6px 0 0",
                }}
              />
            );
          });
        })}
      </div>

      {/* Axe X - notes */}
      <div className="absolute w-full bottom-0 flex justify-between translate-y-1">
        {transformedData[0]?.note && Object.keys(transformedData[0]?.note).map((note, index) => {
          const xPosition = xScale(note);

          return (
            <div
              key={index}
              className="absolute w-full text-center"
              style={{ left: `${xPosition}%`, width: `${xScale.bandwidth()}%` }}
            >
              <div className="text-xs text-gray-600">{note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
