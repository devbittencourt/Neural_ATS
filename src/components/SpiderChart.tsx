import React from "react";
import type { SpiderChartData } from "../utils/barChartUtils";

interface SpiderChartProps {
  data: SpiderChartData[];
}

const SpiderChart: React.FC<SpiderChartProps> = ({ data }) => {
  const size = 400;
  const center = size / 2;
  const maxRadius = 150;
  const levels = 5; // Número de níveis concêntricos (0%, 20%, 40%, 60%, 80%, 100%)

  // Calcular pontos para cada skill no círculo
  const getPointCoordinates = (value: number, index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Começar do topo
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, angle };
  };

  // Gerar pontos da grade (círculos concêntricos)
  const gridLevels = Array.from({ length: levels + 1 }, (_, i) => (i * 100) / levels);

  // Gerar linhas radiais para cada skill
  const skillLines = data.map((_, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const endX = center + maxRadius * Math.cos(angle);
    const endY = center + maxRadius * Math.sin(angle);
    return { startX: center, startY: center, endX, endY, angle };
  });

  // Gerar pontos para a área da vaga (job)
  const jobPoints = data.map((item, index) => 
    getPointCoordinates(item.jobValue, index, data.length)
  );

  // Gerar pontos para a área do currículo (resume)
  const resumePoints = data.map((item, index) => 
    getPointCoordinates(item.resumeValue, index, data.length)
  );

  // Converter pontos para string de path SVG
  const pointsToPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
    return pathData;
  };

  return (
    <div className="spider-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Fundo do gráfico */}
        <circle
          cx={center}
          cy={center}
          r={maxRadius}
          fill="rgba(0, 255, 255, 0.05)"
          stroke="#00ffff"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Círculos concêntricos (grade) */}
        {gridLevels.slice(1).map((level, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={(level / 100) * maxRadius}
            fill="none"
            stroke="#00ffff"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
        ))}

        {/* Linhas radiais */}
        {skillLines.map((line, index) => (
          <line
            key={index}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            stroke="#00ffff"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        ))}

        {/* Labels dos níveis de porcentagem */}
        {gridLevels.slice(1).map((level, index) => (
          <text
            key={index}
            x={center + 5}
            y={center - (level / 100) * maxRadius + 4}
            fill="#00ffff"
            fontSize="10"
            opacity="0.7"
          >
            {level}%
          </text>
        ))}

        {/* Área da vaga (job) */}
        <path
          d={pointsToPath(jobPoints)}
          fill="rgba(0, 255, 255, 0.3)"
          stroke="#00ffff"
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Área do currículo (resume) */}
        <path
          d={pointsToPath(resumePoints)}
          fill="rgba(0, 136, 136, 0.3)"
          stroke="#008888"
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Pontos da vaga */}
        {jobPoints.map((point, index) => (
          <circle
            key={`job-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#00ffff"
            stroke="#ffffff"
            strokeWidth="1"
          />
        ))}

        {/* Pontos do currículo */}
        {resumePoints.map((point, index) => (
          <circle
            key={`resume-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#008888"
            stroke="#ffffff"
            strokeWidth="1"
          />
        ))}

        {/* Labels das skills */}
        {data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const labelRadius = maxRadius + 25;
          const labelX = center + labelRadius * Math.cos(angle);
          const labelY = center + labelRadius * Math.sin(angle);
          
          return (
            <g key={index}>
              {/* Label da skill */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={item.isMatched ? "#00ff00" : "#ff0080"}
                fontSize="11"
                fontWeight="bold"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                {item.skill.toUpperCase()}
              </text>
              
              {/* Valores das frequências */}
              <text
                x={labelX}
                y={labelY + 15}
                textAnchor="middle"
                fill="#00ffff"
                fontSize="8"
                opacity="0.8"
              >
                V:{item.jobFrequency} CV:{item.resumeFrequency}
              </text>

              {/* Indicador de match */}
              <text
                x={labelX}
                y={labelY + 28}
                textAnchor="middle"
                fill={item.isMatched ? "#00ff00" : "#ff0080"}
                fontSize="12"
                fontWeight="bold"
              >
                {item.isMatched ? "✓" : "✗"}
              </text>
            </g>
          );
        })}

        {/* Gradientes para efeitos */}
        <defs>
          <radialGradient id="spiderGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.1"/>
          </radialGradient>
        </defs>

        {/* Título central */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fill="#00ffff"
          fontSize="12"
          fontWeight="bold"
          opacity="0.6"
        >
          RADAR
        </text>
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill="#00ffff"
          fontSize="10"
          opacity="0.6"
        >
          COMPARATIVO
        </text>
      </svg>
    </div>
  );
};

export default SpiderChart;