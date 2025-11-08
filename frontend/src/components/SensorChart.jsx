import React from 'react';

const SensorChart = ({ data, type, label, color, optimalRange }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), optimalRange.max);
  const minValue = Math.min(...data.map(d => d.value), optimalRange.min);
  const range = maxValue - minValue || 1;

  // Simple SVG line chart
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  const optimalY = 100 - ((optimalRange.optimal - minValue) / range) * 80;

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-700">{label}</h4>
        <span className={`text-sm font-semibold ${color}`}>
          {data[data.length - 1]?.value?.toFixed(1) || 'N/A'}
        </span>
      </div>
      <div className="relative h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Optimal range background */}
          <rect
            x="0"
            y={100 - ((optimalRange.max - minValue) / range) * 80}
            width="100"
            height={((optimalRange.max - optimalRange.min) / range) * 80}
            fill={color.replace('text-', '') + '20'}
          />
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}
          {/* Optimal line */}
          <line
            x1="0"
            y1={optimalY}
            x2="100"
            y2={optimalY}
            stroke={color.replace('text-', '')}
            strokeWidth="1"
            strokeDasharray="2,2"
            opacity="0.5"
          />
          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            stroke={color.replace('text-', '')}
            strokeWidth="2"
          />
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1 || 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color.replace('text-', '')}
              />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Min: {minValue.toFixed(1)}</span>
        <span>Optimal: {optimalRange.optimal}</span>
        <span>Max: {maxValue.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default SensorChart;

