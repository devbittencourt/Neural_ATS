import React from "react";

interface HeatmapProps {
  data: { category: string; percentage: number; color: string }[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const getHeatmapColor = (percentage: number) => {
    if (percentage > 70) return `rgba(0, 255, 0, ${percentage / 100})`;
    if (percentage > 40) return `rgba(255, 255, 0, ${percentage / 100})`;
    return `rgba(255, 0, 0, ${percentage / 100})`;
  };

  return (
    <div className="heatmap-grid">
      {data.map((skill, index) => (
        <div 
          key={index}
          className="heatmap-cell"
          style={{
            backgroundColor: getHeatmapColor(skill.percentage),
            border: '1px solid #00ffff',
            padding: '10px',
            margin: '2px',
            borderRadius: '4px',
            minWidth: '120px',
            textAlign: 'center'
          }}
        >
          <div className="heatmap-label" style={{ color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }}>
            {skill.category.toUpperCase()}
          </div>
          <div className="heatmap-value" style={{ color: '#ffffff', fontSize: '14px', marginTop: '5px' }}>
            {skill.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default Heatmap;