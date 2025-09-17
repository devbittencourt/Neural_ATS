import React from "react";

interface KeywordBarChartProps {
  data: { 
    skill: string; 
    value: number; 
    maxValue: number; 
    color: string; 
    jobFrequency: number; 
    resumeFrequency: number; 
  }[];
}

const KeywordBarChart: React.FC<KeywordBarChartProps> = ({ data }) => {
  const chartWidth = 600;
  const chartHeight = 400;
  const margin = { top: 20, right: 30, bottom: 80, left: 60 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = innerWidth / data.length * 0.8;
  const barSpacing = innerWidth / data.length * 0.2;

  return (
    <div className="keyword-bar-chart">
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
                {value}%
              </text>
            </g>
          );
        })}

        {/* Barras */}
        {data.map((item, index) => {
          const barHeight = (item.value / 100) * innerHeight;
          const x = margin.left + (index * (barWidth + barSpacing)) + barSpacing / 2;
          const y = margin.top + innerHeight - barHeight;

          return (
            <g key={index}>
              {/* Barra principal */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.8"
              />
              
              {/* Efeito de brilho */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.min(barHeight, 20)}
                fill="url(#barGradient)"
                opacity="0.6"
              />

              {/* Valor no topo da barra */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                {item.value}%
              </text>

              {/* Label da keyword (rotacionado) */}
              <text
                x={x + barWidth / 2}
                y={margin.top + innerHeight + 15}
                textAnchor="start"
                fill={item.color}
                fontSize="10"
                fontWeight="bold"
                transform={`rotate(45, ${x + barWidth / 2}, ${margin.top + innerHeight + 15})`}
              >
                {item.skill.toUpperCase()}
              </text>

              {/* Frequências (pequeno texto abaixo) */}
              <text
                x={x + barWidth / 2}
                y={margin.top + innerHeight + 35}
                textAnchor="middle"
                fill="#00ffff"
                fontSize="8"
                opacity="0.7"
              >
                V:{item.jobFrequency} CV:{item.resumeFrequency}
              </text>
            </g>
          );
        })}

        {/* Gradiente para efeito de brilho */}
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
          </linearGradient>
        </defs>

        {/* Título do eixo Y */}
        <text
          x={20}
          y={margin.top + innerHeight / 2}
          textAnchor="middle"
          fill="#00ffff"
          fontSize="12"
          fontWeight="bold"
          transform={`rotate(-90, 20, ${margin.top + innerHeight / 2})`}
        >
          COMPETÊNCIA (%)
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
          KEYWORDS DA VAGA
        </text>
      </svg>
    </div>
  );
};

export default KeywordBarChart;