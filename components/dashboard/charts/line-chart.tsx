import type { LineSeries } from "@/types/dashboard";

export function LineChart({
  labels,
  series,
  safetyStockLabel,
}: {
  labels: string[];
  series: LineSeries[];
  safetyStockLabel: string;
}) {
  const width = 860;
  const height = 310;
  const padding = { top: 20, right: 18, bottom: 44, left: 48 };
  const maxValue = Math.max(25, ...series.flatMap((item) => item.values));
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const safetyStock = 3;

  function getX(index: number) {
    return padding.left + (index / Math.max(labels.length - 1, 1)) * innerWidth;
  }

  function getY(value: number) {
    return padding.top + innerHeight - (value / maxValue) * innerHeight;
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex min-w-[640px] items-center justify-end gap-4 text-[0.7rem] text-slate-500 sm:text-sm">
        {series.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-5 border-t-2 border-dashed border-red-400" />
          <span>{safetyStockLabel}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3.5 min-w-[640px]">
        {[0, 5, 10, 15, 20, 25].map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={getY(value)}
              y2={getY(value)}
              stroke="#ebdfd1"
              strokeWidth="1"
            />
            <text x={padding.left - 10} y={getY(value) + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {value}
            </text>
          </g>
        ))}

        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={getY(safetyStock)}
          y2={getY(safetyStock)}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="8 6"
        />

        {series.map((item) => (
          <g key={item.label}>
            <polyline
              fill="none"
              stroke={item.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={item.values.map((value, index) => `${getX(index)},${getY(value)}`).join(" ")}
            />
            {item.values.map((value, index) => (
              <circle key={`${item.label}-${labels[index]}`} cx={getX(index)} cy={getY(value)} r="3.2" fill={item.color} />
            ))}
          </g>
        ))}

        {labels.map((label, index) => (
          <text key={label} x={getX(index)} y={height - 14} textAnchor="middle" fontSize="10" fill="#64748b">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
