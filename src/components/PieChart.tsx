import React from "react";

interface PieChartProps {
  present: number;
  absent: number;
}

const PieChart: React.FC<PieChartProps> = ({ present, absent }) => {
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const total = present + absent;
  
  if (total === 0) return <div>Sem dados</div>;

  const presentAngle = (present / total) * 360;
  const absentAngle = (absent / total) * 360;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const getArcPath = (startAngle: number, endAngle: number, innerRadius: number = 0) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    if (innerRadius > 0) {
      const innerStart = polarToCartesian(center, center, innerRadius, endAngle);
      const innerEnd = polarToCartesian(center, center, innerRadius, startAngle);
      return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    } else {
      return [
        "M", center, center,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    }
  };

  return (
    <div className="pie-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Fatia de presentes */}
        <path
          d={getArcPath(0, presentAngle, 40)}
          fill="#00ff00"
          stroke="#ffffff"
          strokeWidth="2"
        />
        
        {/* Fatia de ausentes */}
        <path
          d={getArcPath(presentAngle, 360, 40)}
          fill="#ff0000"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Texto central */}
        <text x={center} y={center - 10} textAnchor="middle" fill="#00ffff" fontSize="14" fontWeight="bold">
          {Math.round((present / total) * 100)}%
        </text>
        <text x={center} y={center + 10} textAnchor="middle" fill="#00ffff" fontSize="10">
          MATCH
        </text>
      </svg>
      
      {/* Legenda */}
      <div className="pie-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00ff00' }}></div>
          <span>Presentes ({present})</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff0000' }}></div>
          <span>Ausentes ({absent})</span>
        </div>
      </div>
    </div>
  );
};

export default PieChart;