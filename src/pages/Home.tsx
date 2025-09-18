import React, { useState, useEffect } from "react";
import "./Home.css";
import PieChart from "../components/PieChart";
import WordCloud from "../components/WordCloud";
import ComparativeBarChart from "../components/ComparativeBarChart";
import SpiderChart from "../components/SpiderChart";
import { analyzeText } from "../utils/analysisUtils";
import type { AnalysisData } from "../utils/analysisUtils";
import {
  generateComparativeBarChartData,
  generateSpiderChartData,
} from "../utils/barChartUtils";

const Home: React.FC = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const [removedKeywords, setRemovedKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // Efeito para texto glitch cyberpunk
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
      let result = "";
      for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGlitchText(result);
    }, 500);

    return () => clearInterval(glitchInterval);
  }, []);

  // Inicializar keywords selecionadas quando analysisData muda
  useEffect(() => {
    if (analysisData && analysisData.keywordMatches) {
      // Por padrão, selecionar todas as keywords que aparecem no currículo e não foram removidas
      const keywordsWithResumeCount = analysisData.keywordMatches
        .filter(
          (item) =>
            item.resumeCount > 0 &&
            !removedKeywords.includes(item.keyword.toLowerCase())
        )
        .map((item) => item.keyword);
      setSelectedKeywords(keywordsWithResumeCount);
    }
  }, [analysisData, removedKeywords]);

  // Função para alternar seleção de keyword
  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((k) => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };

  // Função para selecionar/deselecionar todas as keywords
  const toggleAllKeywords = () => {
    if (!analysisData) return;

    // Considera todas as palavras visíveis (primeiras 50), igual à renderização
    const availableKeywords = analysisData.keywordMatches
      .filter(
        (keyword) => !removedKeywords.includes(keyword.keyword.toLowerCase())
      )
      .slice(0, 50)
      .map((item) => item.keyword);

    if (selectedKeywords.length === availableKeywords.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(availableKeywords);
    }
  };

  // Função para remover keyword da análise
  const handleRemoveKeyword = (keyword: string) => {
    const keywordLower = keyword.toLowerCase();
    if (!removedKeywords.includes(keywordLower)) {
      const newRemovedKeywords = [...removedKeywords, keywordLower];
      setRemovedKeywords(newRemovedKeywords);

      // Também remover da seleção de gráficos se estiver selecionada
      setSelectedKeywords((prev) =>
        prev.filter((k) => k.toLowerCase() !== keywordLower)
      );

      // Recalcular análise sem a keyword removida
      if (analysisData) {
        // Recalcular keywordMatches sem as keywords removidas
        const analysis = analyzeText(jobDescription, resume);
        const filteredMatches = analysis.keywordMatches.filter(
          (item) => !newRemovedKeywords.includes(item.keyword.toLowerCase())
        );

        // Filtrar jobKeywords também
        const updatedJobKeywords = analysis.jobKeywords.filter(
          (kw) => !newRemovedKeywords.includes(kw.keyword.toLowerCase())
        );

        const updatedAnalysisData = {
          ...analysisData,
          jobKeywords: updatedJobKeywords,
          keywordMatches: filteredMatches,
          missingKeywords: filteredMatches
            .filter((item) => item.jobCount > 0 && item.resumeCount === 0)
            .map((item) => item.keyword),
        };

        setAnalysisData(updatedAnalysisData);

        // Recalcular match score
        const matchedKeywords = filteredMatches.filter(
          (item) => item.match
        ).length;
        const totalKeywords = filteredMatches.length;
        const newMatchScore =
          totalKeywords > 0
            ? Math.round((matchedKeywords / totalKeywords) * 100)
            : 0;

        setMatchScore(newMatchScore);
      }
    }
  };

  const handleAnalyze = () => {
    if (!jobDescription || !resume) return;

    setIsAnalyzing(true);
    setMatchScore(null);
    setAnalysisData(null);
    setRemovedKeywords([]); // Reset keywords removidas ao fazer nova análise
    setSelectedKeywords([]); // Reset keywords selecionadas ao fazer nova análise

    // Simulação de análise ATS
    setTimeout(() => {
      const analysis = analyzeText(jobDescription, resume);

      // Cálculo real do matchScore baseado na proporção de palavras-chave
      const matchedKeywords = analysis.keywordMatches.filter(
        (item) => item.match
      ).length;
      const totalKeywords = analysis.keywordMatches.length;

      // Tratamento de divisão por zero
      const score =
        totalKeywords === 0
          ? 0
          : Math.round((matchedKeywords / totalKeywords) * 100);

      setMatchScore(score);
      setAnalysisData(analysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="home-container cyberpunk-bg">
      <div className="glitch-container">
        <h1 className="neon-title glitch-effect" data-text="NEURAL ATS">
          NEURAL ATS <span className="glitch-text">{glitchText}</span>
        </h1>
        <p className="cyberpunk-subtitle">
          SISTEMA DE ANÁLISE DE COMPATIBILIDADE V2.0
        </p>
      </div>

      <div className="home-inputs">
        <div className="home-card cyberpunk-card">
          <div className="card-header">
            <h2>DESCRIÇÃO DA VAGA</h2>
            <div className="cyber-line"></div>
          </div>
          <textarea
            placeholder="Cole a descrição da vaga aqui..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="cyberpunk-input"
          />
        </div>

        <div className="home-card cyberpunk-card">
          <div className="card-header">
            <h2>CURRÍCULO DO CANDIDATO</h2>
            <div className="cyber-line"></div>
          </div>
          <textarea
            placeholder="Cole o currículo do candidato aqui..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="cyberpunk-input"
          />
        </div>
      </div>

      <div className="home-actions">
        <button
          onClick={handleAnalyze}
          className={`neon-button ${isAnalyzing ? "analyzing" : "neon-pulse"}`}
          disabled={isAnalyzing || !jobDescription || !resume}
        >
          {isAnalyzing ? "ANALISANDO..." : "ANALISAR COMPATIBILIDADE"}
        </button>
      </div>

      {/* Seção de Keywords Extraídas */}
      {analysisData &&
        analysisData.keywordMatches &&
        analysisData.keywordMatches.length > 0 && (
          <div className="keywords-manager">
            <div className="keywords-header">
              <h3>PALAVRAS-CHAVE EXTRAÍDAS</h3>
              <p>Clique nas palavras para removê-las da análise</p>
            </div>

            {/* Controles de seleção para gráficos */}
            <div className="keywords-controls">
              <h4>Seleção para Gráficos:</h4>
              <button className="toggle-all-btn" onClick={toggleAllKeywords}>
                {selectedKeywords.length ===
                analysisData.keywordMatches.filter(
                  (item) =>
                    item.resumeCount > 0 &&
                    !removedKeywords.includes(item.keyword.toLowerCase())
                ).length
                  ? "Desmarcar Todas"
                  : "Selecionar Todas"}
              </button>
            </div>

            <div className="keywords-section">
              <div className="available-keywords">
                {analysisData.keywordMatches
                  .filter(
                    (keyword) =>
                      !removedKeywords.includes(keyword.keyword.toLowerCase())
                  )
                  .slice(0, 50)
                  .map((keyword, index) => (
                    <div
                      key={index}
                      className={`keyword-item available ${
                        selectedKeywords.includes(keyword.keyword)
                          ? "selected-for-chart"
                          : ""
                      }`}
                      title="Clique para remover esta palavra da análise"
                    >
                      {/* Checkbox para seleção nos gráficos */}
                      <input
                        type="checkbox"
                        checked={selectedKeywords.includes(keyword.keyword)}
                        onChange={() => toggleKeywordSelection(keyword.keyword)}
                        onClick={(e) => e.stopPropagation()}
                        title="Incluir/excluir dos gráficos"
                      />

                      {/* Palavra-chave clicável para remoção */}
                      <span
                        className="keyword-text"
                        onClick={() => handleRemoveKeyword(keyword.keyword)}
                      >
                        {keyword.keyword}
                      </span>

                      <span className="frequency">
                        (
                        {keyword.resumeCount > 0
                          ? `${keyword.resumeCount}/`
                          : ""}
                        {keyword.jobCount})
                      </span>
                    </div>
                  ))}
              </div>

              {/* Seção de keywords removidas */}
              {removedKeywords.length > 0 && (
                <div className="removed-keywords">
                  <h4>Palavras removidas da análise:</h4>
                  <div className="removed-keywords-list">
                    {removedKeywords.map((keyword, index) => (
                      <div key={index} className="keyword-item removed">
                        <span>{keyword}</span>
                        <button
                          className="restore-btn"
                          onClick={() => {
                            setRemovedKeywords((prev) =>
                              prev.filter((k) => k !== keyword)
                            );
                          }}
                          title="Restaurar palavra-chave"
                        >
                          ↶
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      <div className="home-results cyberpunk-results">
        {isAnalyzing && (
          <div className="loading-container">
            <div className="cyber-loading"></div>
            <p>Processando dados neurais...</p>
          </div>
        )}

        {matchScore !== null && (
          <div className="analysis-container">
            {/* Score Principal */}
            <div className="score-container">
              <div className="cyber-score-ring">
                <div className="score-value">{matchScore}%</div>
              </div>
              <div className="score-label">COMPATIBILIDADE</div>
              <div className="score-message">
                {matchScore >= 80 ? (
                  <span className="high-match">
                    ALTA COMPATIBILIDADE DETECTADA
                  </span>
                ) : matchScore >= 50 ? (
                  <span className="medium-match">COMPATIBILIDADE MODERADA</span>
                ) : (
                  <span className="low-match">
                    BAIXA COMPATIBILIDADE - OTIMIZAÇÃO RECOMENDADA
                  </span>
                )}
              </div>
            </div>

            {/* Análises Detalhadas */}
            {analysisData && (
              <div className="detailed-analysis">
                {/* Estatísticas Gerais */}
                <div className="analysis-section">
                  <h3 className="analysis-title">ESTATÍSTICAS GERAIS</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">
                        {analysisData.overallStats.matchedWords}
                      </div>
                      <div className="stat-label">Palavras Correspondentes</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {analysisData.overallStats.jobWords}
                      </div>
                      <div className="stat-label">Palavras na Vaga</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">
                        {analysisData.overallStats.resumeWords}
                      </div>
                      <div className="stat-label">Palavras no Currículo</div>
                    </div>
                  </div>
                </div>

                {/* Palavras-chave Encontradas */}
                <div className="analysis-section">
                  <h3 className="analysis-title">PALAVRAS-CHAVE ANALISADAS</h3>
                  <div className="keywords-grid">
                    {analysisData.keywordMatches.map((item, index) => (
                      <div
                        key={index}
                        className={`keyword-item ${
                          item.match ? "matched" : "unmatched"
                        }`}
                      >
                        <div className="keyword-name">
                          {item.keyword.toUpperCase()}
                        </div>
                        <div className="keyword-stats">
                          <span className="keyword-count vaga">
                            Vaga: {item.jobCount}
                          </span>
                          <span className="keyword-count resume">
                            CV: {item.resumeCount}
                          </span>
                        </div>
                        <div
                          className={`match-indicator ${
                            item.match ? "match" : "no-match"
                          }`}
                        >
                          {item.match ? "✓" : "✗"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Palavras que Não Dão Match */}
                {analysisData.missingKeywords.length > 0 && (
                  <div className="analysis-section">
                    <h3 className="analysis-title">PALAVRAS-CHAVE AUSENTES</h3>
                    <div className="missing-keywords">
                      <p className="missing-description">
                        Estas palavras-chave estão presentes na vaga mas
                        ausentes no currículo:
                      </p>
                      <div className="missing-tags">
                        {analysisData.missingKeywords.map((keyword, index) => (
                          <span key={index} className="missing-tag">
                            {keyword.toUpperCase()}
                          </span>
                        ))}
                      </div>
                      <div className="recommendation">
                        <strong>RECOMENDAÇÃO:</strong> Considere adicionar essas
                        competências ao currículo se aplicável.
                      </div>
                    </div>
                  </div>
                )}

                {/* Análise Comparativa */}
                <div className="analysis-section">
                  <h3 className="analysis-title">ANÁLISE COMPARATIVA</h3>
                  <div className="comparison-chart">
                    <div className="comparison-item">
                      <div className="comparison-label">
                        Taxa de Correspondência
                      </div>
                      <div className="comparison-bar">
                        <div
                          className="comparison-fill match-rate"
                          style={{ width: `${matchScore}%` }}
                        ></div>
                      </div>
                      <div className="comparison-value">{matchScore}%</div>
                    </div>
                    <div className="comparison-item">
                      <div className="comparison-label">
                        Cobertura de Requisitos
                      </div>
                      <div className="comparison-bar">
                        <div
                          className="comparison-fill coverage-rate"
                          style={{ width: `${matchScore}%` }}
                        ></div>
                      </div>
                      <div className="comparison-value">{matchScore}%</div>
                    </div>
                  </div>
                </div>

                {/* Gráfico de Pizza - Keywords Match */}
                <div className="analysis-section">
                  <h3 className="analysis-title">
                    DISTRIBUIÇÃO DE PALAVRAS-CHAVE
                  </h3>
                  <div className="chart-container">
                    <PieChart
                      present={
                        analysisData.keywordMatches.filter((k) => k.match)
                          .length
                      }
                      absent={analysisData.missingKeywords.length}
                    />
                  </div>
                </div>

                {/* Gráfico Comparativo de Keywords */}
                <div className="analysis-section">
                  <h3 className="analysis-title">
                    COMPARAÇÃO VAGA vs CURRÍCULO
                  </h3>
                  <div className="comparative-chart-container">
                    <ComparativeBarChart
                      data={generateComparativeBarChartData(
                        analysisData,
                        selectedKeywords
                      )}
                    />
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: "#00ffff" }}
                      ></span>
                      <span>Frequência na Vaga</span>
                    </div>
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: "#008888" }}
                      ></span>
                      <span>Frequência no Currículo</span>
                    </div>
                    <div className="legend-note">
                      ✓ = Match encontrado | ✗ = Palavra ausente no currículo
                    </div>
                  </div>
                </div>

                {/* Gráfico Spider/Radar Comparativo */}
                <div className="analysis-section">
                  <h3 className="analysis-title">RADAR COMPARATIVO - SKILLS</h3>
                  <div className="spider-chart-container">
                    <SpiderChart
                      data={generateSpiderChartData(
                        analysisData,
                        selectedKeywords
                      )}
                    />
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: "#00ffff" }}
                      ></span>
                      <span>Perfil da Vaga</span>
                    </div>
                    <div className="legend-item">
                      <span
                        className="legend-color"
                        style={{ backgroundColor: "#008888" }}
                      ></span>
                      <span>Perfil do Currículo</span>
                    </div>
                    <div className="legend-note">
                      Radar mostra a intensidade de cada skill | ✓ = Match | ✗ =
                      Gap
                    </div>
                  </div>
                </div>

                {/* Word Cloud */}
                <div className="analysis-section">
                  <h3 className="analysis-title">NUVEM DE PALAVRAS</h3>
                  <div className="word-cloud-container">
                    <WordCloud keywords={analysisData.keywordMatches} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isAnalyzing && matchScore === null && (
          <p className="cyber-instruction">
            Insira os dados e clique em ANALISAR para iniciar o processo
          </p>
        )}
      </div>

      <div className="cyber-footer">
        <div className="cyber-line"></div>
        <p>NEURAL ATS &copy; 2077 • TODOS OS DIREITOS RESERVADOS</p>
      </div>
    </div>
  );
};

export default Home;
