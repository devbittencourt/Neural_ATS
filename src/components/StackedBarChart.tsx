import React from "react";

interface StackedBarChartProps {
  data: { category: string; percentage: number; color: string }[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  return (
    <div className="stacked-bar-chart">
      <svg width="100%" height="300" viewBox="0 0 600 300">
        {/* Eixos */}
        <line x1="50" y1="250" x2="550" y2="250" stroke="#00ffff" strokeWidth="1" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#00ffff" strokeWidth="1" />
        
        {/* Barras */}
        {data.map((item, index) => {
          const x = 70 + index * 80;
          const vagaHeight = 15 + (index * 3) + 50; // Valor determinístico baseado no índice
          const curriculoHeight = (item.percentage / 100) * 150;
          
          return (
            <g key={index}>
              {/* Barra da vaga */}
              <rect
                x={x}
                y={250 - vagaHeight}
                width="30"
                height={vagaHeight}
                fill="#ff0080"
                stroke="#ffffff"
                strokeWidth="1"
              />
              
              {/* Barra do currículo */}
              <rect
                x={x + 35}
                y={250 - curriculoHeight}
                width="30"
                height={curriculoHeight}
                fill="#00ff00"
                stroke="#ffffff"
                strokeWidth="1"
              />
              
              {/* Label da categoria */}
              <text
                x={x + 32}
                y={270}
                textAnchor="middle"
                fill="#00ffff"
                fontSize="10"
                transform={`rotate(-45, ${x + 32}, 270)`}
              >
                {item.category.toUpperCase()}
              </text>
            </g>
          );
        })}
        
        {/* Legenda */}
        <g>
          <rect x="400" y="60" width="15" height="15" fill="#ff0080" />
          <text x="420" y="72" fill="#00ffff" fontSize="12">Vaga</text>
          
          <rect x="400" y="80" width="15" height="15" fill="#00ff00" />
          <text x="420" y="92" fill="#00ffff" fontSize="12">Currículo</text>
        </g>
      </svg>
    </div>
  );
};

export default StackedBarChart;