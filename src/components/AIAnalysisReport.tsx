import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  Warning, 
  CheckCircle, 
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore,
  ExpandLess,
  Lightbulb
} from '@mui/icons-material';
import { DashboardMetrics } from '../types/facebook';

// Tipos para os itens do relatório
interface ReportItem {
  type: 'emergency' | 'improvement' | 'insight';
  title: string;
  description: string;
  metric?: string;
  value?: string | number;
  action?: string;
}

interface AIAnalysisReportProps {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  productValue: number;
  analysisLevel: 'account' | 'campaign' | 'adset' | 'ad';
  selectedName?: string;
}

const AIAnalysisReport: React.FC<AIAnalysisReportProps> = ({
  metrics,
  isLoading,
  productValue,
  analysisLevel,
  selectedName
}) => {
  const [expanded, setExpanded] = useState(true);
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar itens por tipo
  const emergencyItems = reportItems.filter(item => item.type === 'emergency');
  const improvementItems = reportItems.filter(item => item.type === 'improvement');
  const insightItems = reportItems.filter(item => item.type === 'insight');

  // Função para obter o ícone apropriado para cada tipo de item
  const getItemIcon = (item: ReportItem) => {
    if (item.type === 'emergency') {
      return <ErrorIcon color="error" />;
    } else if (item.type === 'improvement') {
      return <Warning color="warning" />;
    } else {
      return <CheckCircle color="success" />;
    }
  };

  // Função para analisar os dados e gerar insights
  const analyzeData = () => {
    if (!metrics) {
      setError('Não há dados para analisar');
      return;
    }

    setLoading(true);
    setError(null);

    // Análise local dos dados (sem depender da API OpenAI)
    const items: ReportItem[] = [];

    // Informações básicas sobre o que está sendo analisado
    const entityType = analysisLevel === 'account' ? 'conta' : 
                      analysisLevel === 'campaign' ? 'campanha' : 
                      analysisLevel === 'adset' ? 'conjunto de anúncios' : 'anúncio';
    
    const entityName = selectedName || `${entityType} selecionado`;

    // Análise de CTR
    if (metrics.ctr < 1) {
      items.push({
        type: 'emergency',
        title: 'CTR muito baixo',
        description: `O CTR de ${metrics.ctr.toFixed(2)}% para ${entityName} está abaixo do recomendado (1%). Considere revisar os criativos e segmentação.`,
        metric: 'CTR',
        value: `${metrics.ctr.toFixed(2)}%`,
        action: 'Revisar criativos e segmentação'
      });
    } else if (metrics.ctr >= 1 && metrics.ctr < 2) {
      items.push({
        type: 'improvement',
        title: 'CTR médio',
        description: `O CTR de ${metrics.ctr.toFixed(2)}% para ${entityName} está na média. Há espaço para melhorias nos criativos.`,
        metric: 'CTR',
        value: `${metrics.ctr.toFixed(2)}%`
      });
    } else {
      items.push({
        type: 'insight',
        title: 'CTR excelente',
        description: `O CTR de ${metrics.ctr.toFixed(2)}% para ${entityName} está acima da média. Continue com essa estratégia de criativos.`,
        metric: 'CTR',
        value: `${metrics.ctr.toFixed(2)}%`
      });
    }

    // Análise de CPC
    if (metrics.cpc > 2) {
      items.push({
        type: 'emergency',
        title: 'CPC muito alto',
        description: `O CPC de R$${metrics.cpc.toFixed(2)} para ${entityName} está muito alto. Revise a segmentação e os lances.`,
        metric: 'CPC',
        value: `R$${metrics.cpc.toFixed(2)}`,
        action: 'Reduzir lances ou melhorar relevância'
      });
    } else if (metrics.cpc > 1 && metrics.cpc <= 2) {
      items.push({
        type: 'improvement',
        title: 'CPC médio',
        description: `O CPC de R$${metrics.cpc.toFixed(2)} para ${entityName} está na média. Busque otimizar para reduzir ainda mais.`,
        metric: 'CPC',
        value: `R$${metrics.cpc.toFixed(2)}`
      });
    } else {
      items.push({
        type: 'insight',
        title: 'CPC excelente',
        description: `O CPC de R$${metrics.cpc.toFixed(2)} para ${entityName} está ótimo. Continue com essa estratégia de lances.`,
        metric: 'CPC',
        value: `R$${metrics.cpc.toFixed(2)}`
      });
    }

    // Análise de CPM
    if (metrics.cpm > 30) {
      items.push({
        type: 'emergency',
        title: 'CPM muito alto',
        description: `O CPM de R$${metrics.cpm.toFixed(2)} para ${entityName} está muito alto. Revise o público-alvo.`,
        metric: 'CPM',
        value: `R$${metrics.cpm.toFixed(2)}`,
        action: 'Ampliar público ou revisar segmentação'
      });
    }

    // Análise de ROAS (se houver valor do produto)
    if (productValue > 0) {
      // Estimar ROAS com base nos dados disponíveis
      const estimatedConversions = metrics.clicks * 0.005; // Taxa de conversão estimada de 0.5%
      const estimatedRevenue = estimatedConversions * productValue;
      const roas = metrics.spend > 0 ? estimatedRevenue / metrics.spend : 0;

      if (roas < 1) {
        items.push({
          type: 'emergency',
          title: 'ROAS negativo',
          description: `O ROAS estimado para ${entityName} está abaixo de 1 (${roas.toFixed(2)}x), indicando prejuízo. Revise urgentemente a estratégia.`,
          metric: 'ROAS',
          value: `${roas.toFixed(2)}x`,
          action: 'Pausar campanha ou revisar completamente'
        });
      } else if (roas >= 1 && roas < 3) {
        items.push({
          type: 'improvement',
          title: 'ROAS baixo',
          description: `O ROAS estimado para ${entityName} é de ${roas.toFixed(2)}x. Há espaço para melhorias na conversão.`,
          metric: 'ROAS',
          value: `${roas.toFixed(2)}x`
        });
      } else {
        items.push({
          type: 'insight',
          title: 'ROAS excelente',
          description: `O ROAS estimado para ${entityName} é de ${roas.toFixed(2)}x, o que é muito bom. Continue com essa estratégia.`,
          metric: 'ROAS',
          value: `${roas.toFixed(2)}x`
        });
      }
    }

    // Análise de conversões de pixel (se disponível)
    if (metrics.pixelPurchases && metrics.pixelPurchases > 0) {
      const conversionRate = (metrics.pixelPurchases / metrics.clicks) * 100;
      items.push({
        type: 'insight',
        title: 'Conversões do Pixel',
        description: `${entityName} registrou ${metrics.pixelPurchases} compras pelo pixel, com taxa de conversão de ${conversionRate.toFixed(2)}%.`,
        metric: 'Conversões',
        value: metrics.pixelPurchases
      });
    }

    // Análise de mensagens (se disponível)
    if (metrics.messengerReplies && metrics.messengerReplies > 0) {
      const messageRate = (metrics.messengerReplies / metrics.clicks) * 100;
      items.push({
        type: 'insight',
        title: 'Conversões por Mensagem',
        description: `${entityName} gerou ${metrics.messengerReplies} conversões por mensagem, com taxa de ${messageRate.toFixed(2)}%.`,
        metric: 'Mensagens',
        value: metrics.messengerReplies
      });
    }

    // Definir os itens do relatório
    setReportItems(items);
    setLoading(false);
  };

  // Atualizar a análise quando os dados mudarem
  useEffect(() => {
    if (!isLoading && metrics) {
      analyzeData();
    }
  }, [metrics, isLoading, analysisLevel, selectedName, productValue]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Lightbulb color="primary" sx={{ mr: 1 }} />
          Análise de Desempenho em Tempo Real
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={analyzeData}
            disabled={loading || !metrics}
          >
            {loading ? 'Analisando...' : 'Atualizar'}
          </Button>
          
          <IconButton onClick={toggleExpanded} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Collapse in={expanded}>
        <Box sx={{ mb: 2 }}>
          {/* Seção de emergências */}
          {emergencyItems.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="error" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ErrorIcon fontSize="small" sx={{ mr: 1 }} />
                Ações Urgentes ({emergencyItems.length})
              </Typography>
              
              <List dense sx={{ bgcolor: 'error.light', borderRadius: 1, p: 1 }}>
                {emergencyItems.map((item, index) => (
                  <ListItem key={`emergency-${index}`} sx={{ borderBottom: index < emergencyItems.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getItemIcon(item)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="bold">{item.title}</Typography>
                          {item.metric && (
                            <Chip
                              label={`${item.metric}: ${item.value}`}
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Seção de melhorias */}
          {improvementItems.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="warning.dark" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning fontSize="small" sx={{ mr: 1 }} />
                Oportunidades de Melhoria ({improvementItems.length})
              </Typography>
              
              <List dense sx={{ bgcolor: 'warning.light', borderRadius: 1, p: 1 }}>
                {improvementItems.map((item, index) => (
                  <ListItem key={`improvement-${index}`} sx={{ borderBottom: index < improvementItems.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getItemIcon(item)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="bold">{item.title}</Typography>
                          {item.metric && (
                            <Chip
                              label={`${item.metric}: ${item.value}`}
                              size="small"
                              color="warning"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Seção de insights */}
          {insightItems.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="success.dark" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                Insights Positivos ({insightItems.length})
              </Typography>
              
              <List dense sx={{ bgcolor: 'success.light', borderRadius: 1, p: 1 }}>
                {insightItems.map((item, index) => (
                  <ListItem key={`insight-${index}`} sx={{ borderBottom: index < insightItems.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getItemIcon(item)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="bold">{item.title}</Typography>
                          {item.metric && (
                            <Chip
                              label={`${item.metric}: ${item.value}`}
                              size="small"
                              color="success"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {reportItems.length === 0 && !loading && (
            <Alert severity="info">
              Não há insights disponíveis para os dados atuais. Tente selecionar outro período ou nível de análise.
            </Alert>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AIAnalysisReport;