//@ts-nocheck

import { pie, arc, PieArcDatum } from "d3";

type Statistic = { id: number; taux_reussite: number };

export function Chart({ statistics, currentExamId }: { statistics: Statistic[]; currentExamId: number }) {
  const radius = 420;
  const lightStrokeEffect = 10;

  const currentStat = statistics.find((stat) => stat.id === currentExamId);

  const data = [
    { name: "Réussi", value: currentStat?.taux_reussite || 0 },
    { name: "Échoué", value: 100 - (currentStat?.taux_reussite || 0) },
  ];

  const pieLayout = pie<{ name: string; value: number }>()
    .value((d) => d.value)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .sort((a, b) => a.value - b.value)
    .padAngle(0.0);

  const innerRadius = radius / 1.625;
  const arcGenerator = arc<PieArcDatum<any>>().innerRadius(innerRadius).outerRadius(radius);
  const arcClip =
    arc<PieArcDatum<any>>()
      .innerRadius(innerRadius + lightStrokeEffect / 2)
      .outerRadius(radius)
      .cornerRadius(lightStrokeEffect + 2) || undefined;

  const arcs = pieLayout(data);

  const colors = {
    gray: "fill-[#e0e0e0] dark:fill-zinc-700",
    purple: "fill-violet-600 dark:fill-violet-500",
  };

  return (
    <div className="relative">
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius}`}
        className="max-w-[16rem] mx-auto overflow-visible"
      >
        <defs>
          {arcs.map((d, i) => (
            <clipPath key={`clip-${i}`} id={`clip-${i}`}>
              <path d={arcClip(d) || undefined} />
            </clipPath>
          ))}
        </defs>
        <g>
          {arcs.map((d, i) => (
            <g key={i} clipPath={`url(#clip-${i})`}>
              <path
                className={`stroke-white/30 dark:stroke-zinc-400/10 ${
                  i === 1 ? colors.gray : colors.purple
                }`}
                strokeWidth={lightStrokeEffect}
                d={arcGenerator(d) || undefined}
              />
            </g>
          ))}
        </g>
        <text
          transform={`translate(0, ${-radius / 4})`}
          textAnchor="middle"
          fontSize={48}
          fontWeight="bold"
          fill="currentColor"
          className="text-white dark:text-zinc-100"
        >
          Réussi {currentStat?.id || "?"}
        </text>
        <text
          transform={`translate(0, ${-radius / 12})`}
          textAnchor="middle"
          fontSize={64}
          fontWeight="bold"
          fill="currentColor"
          className="text-zinc-100 dark:text-zinc-300"
        >
          {currentStat?.taux_reussite ?? 0}%
        </text>
      </svg>
    </div>
  );
}
