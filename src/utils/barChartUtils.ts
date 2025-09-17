import type { AnalysisData } from './analysisUtils';

// Interface para dados do gráfico de barras comparativo
export interface BarChartData {
  skill: string;
  jobValue: number;
  resumeValue: number;
  maxValue: number;
  jobColor: string;
  resumeColor: string;
  jobFrequency: number;
  resumeFrequency: number;
  isMatched: boolean;
}

// Interface para dados do gráfico de barras comparativo (nova versão)
export interface ComparativeBarChartData {
  keyword: string;
  resumeValue: number;
  jobValue: number;
  resumeFrequency: number;
  jobFrequency: number;
}

// Cores cyberpunk para as barras
const JOB_COLORS = [
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#ff6600', // Orange
  '#9900ff', // Purple
  '#ff0066', // Pink
  '#66ff00', // Lime
  '#0066ff', // Blue
  '#ff3300', // Red
];

const RESUME_COLORS = [
  '#008888', // Dark Cyan
  '#880088', // Dark Magenta
  '#888800', // Dark Yellow
  '#008800', // Dark Green
  '#884400', // Dark Orange
  '#660088', // Dark Purple
  '#880044', // Dark Pink
  '#448800', // Dark Lime
  '#004488', // Dark Blue
  '#882200', // Dark Red
];

/**
 * Gera dados para o gráfico de barras comparativo baseado nas palavras-chave analisadas
 */
export const generateComparativeBarChartData = (
  analysisData: AnalysisData,
  selectedKeywords: string[] = []
): ComparativeBarChartData[] => {
  if (!analysisData || !analysisData.keywordMatches) {
    return [];
  }

  // Filtrar apenas keywords selecionadas ou todas se nenhuma selecionada
  const keywordsToShow = selectedKeywords.length > 0 
    ? analysisData.keywordMatches.filter(item => selectedKeywords.includes(item.keyword))
    : analysisData.keywordMatches;

  return keywordsToShow
    .map(item => {
      // Calcular porcentagem baseada na frequência da vaga (vaga como referência)
      const resumePercentage = item.jobCount > 0 
        ? Math.min((item.resumeCount / item.jobCount) * 100, 100) // Limitar a 100%
        : 0;

      return {
        keyword: item.keyword,
        resumeValue: resumePercentage,
        jobValue: 0, // Não exibir barra da vaga
        resumeFrequency: item.resumeCount,
        jobFrequency: item.jobCount
      };
    })
    .sort((a, b) => b.resumeValue - a.resumeValue); // Ordenar por porcentagem decrescente
    // Removida limitação para mostrar todas as palavras selecionadas
};

// Interface para dados do gráfico spider
export interface SpiderChartData {
  skill: string;
  jobValue: number;
  resumeValue: number;
  isMatched: boolean;
  jobFrequency: number;
  resumeFrequency: number;
}

// Função para gerar dados do gráfico spider comparativo
export const generateSpiderChartData = (
  analysisData: AnalysisData,
  selectedKeywords: string[] = []
): SpiderChartData[] => {
  if (!analysisData || !analysisData.keywordMatches || !analysisData.missingKeywords) {
    return [];
  }

  // Filtrar apenas keywords selecionadas ou todas se nenhuma selecionada
  const keywordsToShow = selectedKeywords.length > 0 
    ? analysisData.keywordMatches.filter(item => selectedKeywords.includes(item.keyword))
    : analysisData.keywordMatches;

  // Processar palavras-chave usando a nova lógica
  const keywordArray = keywordsToShow
    .map(match => {
      // Nova lógica: usar vaga como referência para cálculo percentual
      let resumePercentage = 0;
      
      if (match.jobCount > 0) {
        // Se a vaga tem ocorrências, calcular porcentagem baseada na vaga
        resumePercentage = Math.round((match.resumeCount / match.jobCount) * 100);
        // Limitar a 100% se currículo ultrapassar a vaga
        resumePercentage = Math.min(resumePercentage, 100);
      } else if (match.resumeCount > 0) {
        // Se vaga não tem ocorrências mas currículo tem, currículo é 100%
        resumePercentage = 100;
      }

      return {
        skill: match.keyword,
        resumeValue: resumePercentage,
        isMatched: match.match,
        jobFrequency: match.jobCount,
        resumeFrequency: match.resumeCount
      };
    });

  // Ordenar por valor percentual - mostrar todas as palavras selecionadas
  const topKeywords = keywordArray
    .sort((a, b) => b.resumeValue - a.resumeValue);

  // Converter para dados do spider chart - apenas estatísticas do currículo
  return topKeywords.map(keyword => ({
    skill: keyword.skill,
    jobValue: 0, // Não exibir dados da vaga
    resumeValue: keyword.resumeValue,
    isMatched: keyword.isMatched,
    jobFrequency: keyword.jobFrequency, // Manter frequência da vaga para referência
    resumeFrequency: keyword.resumeFrequency
  }));
};

// Manter função original para compatibilidade (deprecated)
export const generateBarChartFromJobKeywords = (analysisData: AnalysisData): any[] => {
  return generateComparativeBarChartData(analysisData).map(item => ({
    skill: item.keyword,
    value: item.jobValue,
    maxValue: 100,
    color: '#00ffff',
    jobFrequency: item.jobFrequency,
    resumeFrequency: item.resumeFrequency
  }));
};