// Interface para dados de análise
export interface AnalysisData {
  keywordMatches: { keyword: string; jobCount: number; resumeCount: number; match: boolean }[];
  missingKeywords: string[];
  overallStats: { jobWords: number; resumeWords: number; matchedWords: number };
  jobKeywords: { keyword: string; frequency: number }[];
}

// Lista de stopwords em português e inglês
const STOPWORDS = new Set([
  // Português
  'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'com', 'para', 'por', 'pela', 'pelo', 'pelas', 'pelos',
  'um', 'uma', 'uns', 'umas', 'o', 'a', 'os', 'as', 'que', 'se', 'é', 'são', 'foi', 'foram', 'ser', 'estar', 'ter', 'haver',
  'mais', 'muito', 'bem', 'como', 'quando', 'onde', 'porque', 'mas', 'ou', 'também', 'já', 'ainda', 'só', 'até', 'sobre',
  'entre', 'sem', 'após', 'antes', 'durante', 'desde', 'através', 'dentro', 'fora', 'acima', 'abaixo', 'ao', 'aos', 'à', 'às',
  'sua', 'seu', 'suas', 'seus', 'nossa', 'nosso', 'nossas', 'nossos', 'minha', 'meu', 'minhas', 'meus', 'esta', 'este', 'estas', 'estes',
  'essa', 'esse', 'essas', 'esses', 'aquela', 'aquele', 'aquelas', 'aqueles', 'isso', 'isto', 'aquilo', 'ela', 'ele', 'elas', 'eles',
  'nós', 'vocês', 'você', 'eu', 'me', 'mim', 'te', 'ti', 'lhe', 'lhes', 'nos', 'vos', 'se', 'si', 'consigo', 'conosco', 'convosco',
  'será', 'seria', 'sendo', 'sido', 'tendo', 'tido', 'fazendo', 'feito', 'fazem', 'faz', 'fazer', 'pode', 'podem', 'podendo',
  'deve', 'devem', 'devendo', 'quer', 'querem', 'querendo', 'vai', 'vão', 'indo', 'vem', 'vêm', 'vindo', 'diz', 'dizem', 'dizendo',
  'disse', 'disseram', 'dito', 'vê', 'veem', 'vendo', 'viu', 'viram', 'visto', 'dá', 'dão', 'dando', 'deu', 'deram', 'dado',
  'fica', 'ficam', 'ficando', 'ficou', 'ficaram', 'ficado', 'fica', 'ficam', 'ficando', 'ficou', 'ficaram', 'ficado',
  // Inglês
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
  'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 's', 't', 'just', 'don', 'now', 'get', 'go', 'come', 'see', 'know', 'take', 'give', 'make', 'work', 'use', 'find',
  'tell', 'ask', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other',
  'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same'
]);

// Categorização de palavras-chave por tipo
/**
 * Gerencia palavras-chave indesejáveis usando localStorage
 */
export const getUnwantedKeywords = (): string[] => {
  const stored = localStorage.getItem('unwantedKeywords');
  return stored ? JSON.parse(stored) : [];
};

export const addUnwantedKeyword = (keyword: string): void => {
  const current = getUnwantedKeywords();
  const normalized = keyword.toLowerCase().trim();
  if (normalized && !current.includes(normalized)) {
    current.push(normalized);
    localStorage.setItem('unwantedKeywords', JSON.stringify(current));
  }
};

export const removeUnwantedKeyword = (keyword: string): void => {
  const current = getUnwantedKeywords();
  const normalized = keyword.toLowerCase().trim();
  const filtered = current.filter(k => k !== normalized);
  localStorage.setItem('unwantedKeywords', JSON.stringify(filtered));
};

/**
 * Extrai palavras-chave de um texto de vaga, removendo stopwords e palavras indesejáveis
 */
export const extractKeywordsFromJob = (jobText: string): string[] => {
  // Obter lista de palavras indesejáveis
  const unwantedKeywords = getUnwantedKeywords();
  
  // Limpar e dividir o texto em palavras
  const words = jobText
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\-\.]/gu, ' ') // Remove pontuação exceto hífens e pontos, preservando acentos
    .split(/\s+/)
    .map(word => word.replace(/^\.+|\.+$/g, '')) // Remove pontos apenas do início e fim
    .filter(word => 
      word.length >= 2 && // Pelo menos 2 letras para capturar mais keywords
      !STOPWORDS.has(word) && // Não é stopword
      !unwantedKeywords.includes(word) && // Não é palavra indesejável
      !/^\d+$/.test(word) && // Não é apenas números
      word.trim() !== '' // Não é string vazia
    );

  // Contar frequência das palavras
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    const cleanWord = word.trim();
    if (cleanWord) {
      wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
    }
  });

  // Ordenar por frequência e pegar as top 100
  const sortedWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([word]) => word);

  return sortedWords;
};

/**
 * Extrai as top 10 keywords da vaga com suas frequências
 */
export const getTop10JobKeywords = (jobText: string, removedKeywords: string[] = []): { keyword: string; frequency: number }[] => {
  // Limpar e dividir o texto em palavras
  const words = jobText
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\-\.]/gu, ' ') // Remove pontuação exceto hífens e pontos, preservando acentos
    .split(/\s+/)
    .map(word => word.replace(/^\.+|\.+$/g, '')) // Remove pontos apenas do início e fim
    .filter(word => 
      word.length >= 2 && // Pelo menos 2 letras
      !STOPWORDS.has(word) && // Não é stopword
      !/^\d+$/.test(word) && // Não é apenas números
      word.trim() !== '' && // Não é string vazia
      !removedKeywords.includes(word) // Não está na lista de keywords removidas
    );

  // Contar frequência das palavras
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Ordenar por frequência e pegar as top 10
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, frequency]) => ({ keyword, frequency }));
};



/**
 * Analisa o texto da vaga e do currículo, retornando dados de compatibilidade
 */
export const analyzeText = (jobText: string, resumeText: string): AnalysisData => {
  // Extrair keywords reais do texto da vaga (não usar lista pré-definida)
  const jobKeywords = extractKeywordsFromJob(jobText);
  const jobKeywordsWithFreq = getTop10JobKeywords(jobText);
  
  // Processamento mais cuidadoso para preservar keywords completas
  const processText = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s\-\.]/gu, ' ') // Remove pontuação exceto hífens e pontos, preservando acentos
      .split(/\s+/)
      .map(word => word.replace(/^\.+|\.+$/g, '')) // Remove pontos apenas do início e fim
      .filter(word => 
        word.length >= 2 && 
        !STOPWORDS.has(word) && 
        !/^\d+$/.test(word) &&
        word.trim() !== ''
      );
  };

  const jobWords = processText(jobText);
  const resumeWords = processText(resumeText);

  // Análise baseada nas keywords REAIS extraídas do texto da vaga
  const keywordMatches = jobKeywords.map(keyword => {
    const keywordLower = keyword.toLowerCase();
    
    let jobCount = 0;
    let resumeCount = 0;
    
    if (keyword.includes(' ')) {
      // Para keywords compostas, buscar no texto original
      const jobTextLower = jobText.toLowerCase();
      const resumeTextLower = resumeText.toLowerCase();
      
      // Contar ocorrências no texto da vaga
      let index = 0;
      while ((index = jobTextLower.indexOf(keywordLower, index)) !== -1) {
        jobCount++;
        index += keywordLower.length;
      }
      
      // Contar ocorrências no texto do currículo
      index = 0;
      while ((index = resumeTextLower.indexOf(keywordLower, index)) !== -1) {
        resumeCount++;
        index += keywordLower.length;
      }
    } else {
      // Para keywords simples, usar matching exato nas palavras processadas
      jobCount = jobWords.filter(word => word === keywordLower).length;
      resumeCount = resumeWords.filter(word => word === keywordLower).length;
    }
    
    return {
      keyword,
      jobCount,
      resumeCount,
      match: jobCount > 0 && resumeCount > 0
    };
  });

  // Palavras que não dão match
  const missingKeywords = keywordMatches
    .filter(item => item.jobCount > 0 && item.resumeCount === 0)
    .map(item => item.keyword);

  const overallStats = {
    jobWords: jobWords.length,
    resumeWords: resumeWords.length,
    matchedWords: keywordMatches.filter(item => item.match).length
  };

  return {
    keywordMatches,
    missingKeywords,
    overallStats,
    jobKeywords: jobKeywordsWithFreq
  };
};