import React from "react";

interface WordCloudProps {
  keywords: { keyword: string; jobCount: number; resumeCount: number; match: boolean }[];
}

const WordCloud: React.FC<WordCloudProps> = ({ keywords }) => {
  return (
    <div className="word-cloud">
      {keywords.map((item, index) => {
        const totalCount = item.jobCount + item.resumeCount;
        const baseFontSize = Math.max(12, Math.min(28, totalCount * 3 + 12));
        const fontSize = baseFontSize * 0.6; // Reduzindo de 0.75 para 0.6 (20% menor)
        
        return (
          <span 
            key={index}
            className={`word-cloud-item ${item.match ? 'matched' : 'unmatched'}`}
            style={{
              fontSize: `${fontSize}px`,
              opacity: item.match ? 1 : 0.6,
              color: item.match ? '#00ff00' : '#ff0080',
              margin: '2px 4px',
              display: 'inline-block',
              textShadow: '0 0 5px currentColor'
            }}
          >
            {item.keyword.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

export default WordCloud;