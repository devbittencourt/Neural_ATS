import React from "react";
import type { ComparativeBarChartData } from "../utils/barChartUtils";

interface ComparativeBarChartProps {
  data: ComparativeBarChartData[];
}

const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({ data }) => {
  const chartWidth = 700;
  const chartHeight = 450;
  const margin = { top: 20, right: 30, bottom: 100, left: 80 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  
  const barGroupWidth = innerWidth / data.length;
  const barWidth = Math.min(barGroupWidth * 0.35, 30); // Largura de cada barra individual
  const barSpacing = barGroupWidth * 0.1;

  return (
    <div className="comparative-bar-chart">
      <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Fundo do gráfico */}
        <rect
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="rgba(0, 255, 255, 0.05)"
          stroke="#00ffff"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Linhas de grade horizontais */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = margin.top + (innerHeight / 5) * i;
          const value = Math.round((100 / 5) * (5 - i));
          return (
            <g key={i}>
              <line
                x1={margin.left}
                y1={y}
                x2={margin.left + innerWidth}
                y2={y}
                stroke="#00ffff"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="#00ffff"
                fontSize="10"
                opacity="0.8"
              >
                {Math.round(value)}%
              </text>
            </g>
          );
        })}

        {/* Grupos de barras */}
        {data.map((item, index) => {
          const groupX = margin.left + (index * barGroupWidth) + barSpacing;
          
          // Barra da Vaga (Job)
          const jobBarHeight = (item.jobValue / 100) * innerHeight;
          const jobBarX = groupX;
          const jobBarY = margin.top + innerHeight - jobBarHeight;

          // Barra do Currículo (Resume)
          const resumeBarHeight = (item.resumeValue / 100) * innerHeight;
          const resumeBarX = groupX + barWidth + 5;
          const resumeBarY = margin.top + innerHeight - resumeBarHeight;

          return (
            <g key={index}>
              {/* Barra da Vaga */}
              <rect
                x={jobBarX}
                y={jobBarY}
                width={barWidth}
                height={jobBarHeight}
                fill="#00ffff"
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.8"
              />
              
              {/* Efeito de brilho - Vaga */}
              <rect
                x={jobBarX}
                y={jobBarY}
                width={barWidth}
                height={Math.min(jobBarHeight, 15)}
                fill="url(#jobGradient)"
                opacity="0.6"
              />

              {/* Valor no topo da barra - Vaga */}
              {item.jobValue > 0 && (
                <text
                  x={jobBarX + barWidth / 2}
                  y={jobBarY - 5}
                  textAnchor="middle"
                  fill="#00ffff"
                  fontSize="9"
                  fontWeight="bold"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {Math.round(item.jobValue)}%
                </text>
              )}

              {/* Barra do Currículo */}
              <rect
                x={resumeBarX}
                y={resumeBarY}
                width={barWidth}
                height={resumeBarHeight}
                fill="#008888"
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.8"
              />
              
              {/* Efeito de brilho - Currículo */}
              <rect
                x={resumeBarX}
                y={resumeBarY}
                width={barWidth}
                height={Math.min(resumeBarHeight, 15)}
                fill="url(#resumeGradient)"
                opacity="0.6"
              />

              {/* Valor no topo da barra - Currículo */}
              {item.resumeValue > 0 && (
                <text
                  x={resumeBarX + barWidth / 2}
                  y={resumeBarY - 5}
                  textAnchor="middle"
                  fill="#008888"
                  fontSize="9"
                  fontWeight="bold"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {Math.round(item.resumeValue)}%
                </text>
              )}

              {/* Label da keyword (rotacionado) */}
              <text
                x={groupX + barWidth + 2.5}
                y={margin.top + innerHeight + 20}
                textAnchor="start"
                fill="#00ffff"
                fontSize="10"
                fontWeight="bold"
                transform={`rotate(45, ${groupX + barWidth + 2.5}, ${margin.top + innerHeight + 20})`}
              >
                {item.keyword.toUpperCase()}
              </text>

              {/* Frequências (pequeno texto abaixo) */}
              <text
                x={groupX + barWidth + 2.5}
                y={margin.top + innerHeight + 45}
                textAnchor="middle"
                fill="#00ffff"
                fontSize="8"
                opacity="0.7"
              >
                V:{item.jobFrequency} CV:{item.resumeFrequency}
              </text>

              {/* Indicador de match */}
              <text
                x={groupX + barWidth + 2.5}
                y={margin.top + innerHeight + 60}
                textAnchor="middle"
                fill="#00ff00"
                fontSize="12"
                fontWeight="bold"
              >
                ✓
              </text>
            </g>
          );
        })}

        {/* Gradientes para efeitos de brilho */}
        <defs>
          <linearGradient id="jobGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="resumeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
          </linearGradient>
        </defs>

        {/* Título do eixo Y */}
        <text
          x={25}
          y={margin.top + innerHeight / 2}
          textAnchor="middle"
          fill="#00ffff"
          fontSize="12"
          fontWeight="bold"
          transform={`rotate(-90, 25, ${margin.top + innerHeight / 2})`}
        >
          FREQUÊNCIA (%)
        </text>

        {/* Título do eixo X */}
        <text
          x={margin.left + innerWidth / 2}
          y={chartHeight - 10}
          textAnchor="middle"
          fill="#00ffff"
          fontSize="12"
          fontWeight="bold"
        >
          PALAVRAS-CHAVE ANALISADAS
        </text>

        {/* Legenda */}
        <g transform={`translate(${margin.left + innerWidth - 150}, ${margin.top + 10})`}>
          <rect
            x="0"
            y="0"
            width="140"
            height="50"
            fill="rgba(0, 0, 0, 0.7)"
            stroke="#00ffff"
            strokeWidth="1"
            strokeOpacity="0.5"
            rx="5"
          />
          
          {/* Legenda Vaga */}
          <rect x="10" y="10" width="15" height="10" fill="#00ffff" opacity="0.8"/>
          <text x="30" y="19" fill="#00ffff" fontSize="10">VAGA</text>
          
          {/* Legenda Currículo */}
          <rect x="10" y="25" width="15" height="10" fill="#008888" opacity="0.8"/>
          <text x="30" y="34" fill="#00ffff" fontSize="10">CURRÍCULO</text>
        </g>
      </svg>
    </div>
  );
};

export default ComparativeBarChart;