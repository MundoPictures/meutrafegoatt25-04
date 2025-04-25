# Meu Tráfego - Dashboard de Análise de Campanhas

Dashboard para análise de métricas de campanhas do Facebook Ads com recursos de IA para análise de desempenho em tempo real.

## Funcionalidades

- Conexão com a API do Facebook para obter dados reais de campanhas
- Visualização de métricas importantes como CTR, CPC, CPM
- Análise de conversões do pixel e mensagens
- Relatório de análise de desempenho em tempo real
- Suporte para diferentes níveis de análise (conta, campanha, conjunto de anúncios, anúncio)
- Métricas personalizadas e renomeadas conforme necessidade do usuário

## Tecnologias

- React
- TypeScript
- Material UI
- Recharts para visualização de dados
- Facebook Marketing API
- Vite
- Axios

## Configuração

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Inicie o servidor de desenvolvimento com `npm run dev`
4. Insira seu token de acesso do Facebook no campo de configuração no topo do dashboard

## Obtendo um Token de Acesso do Facebook

Para usar o dashboard com dados reais, você precisa:

1. Acesse [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecione seu aplicativo no menu suspenso
3. Solicite as seguintes permissões:
   - `ads_read`
   - `ads_management`
   - `business_management`
4. Clique em "Gerar Token de Acesso"
5. Copie o token gerado e cole no campo de configuração do dashboard

## Atualizado em 25/04/2025

Este projeto foi atualizado com as seguintes melhorias:

- Integração com a API do Facebook para dados reais
- Análise de desempenho em tempo real baseada nos dados atuais
- Suporte para eventos de pixel e conversões por mensagem
- Interface aprimorada com métricas mais relevantes
- Personalização de nomes de métricas (CPM, CPC, CTR, Cliques no Link)
- Remoção de métricas não utilizadas (Receita Estimada)