## 8.15 Rastreamento do otimizador

8.15.1 Uso típico

8.15.2 Variáveis do sistema que controlam o rastreamento

8.15.3 Declarações rastreáveis

8.15.4 Limpeza de registros de ajuste

8.15.5 Rastreamento do uso da memória

8.15.6 Verificação de privilégios

8.15.7 Interação com a opção --debug

8.15.8 A variável de sistema optimizer_trace

8.15.9 A variável de sistema end_markers_in_json

8.15.10 Selecionando recursos do otimizador para rastrear

8.15.11 Rastrear a Estrutura Geral

8.15.12 Exemplo

8.15.13 Exibir rastros em outras aplicações

8.15.14 Prevenção do uso do Rastreamento do Optimizer

8.15.15 Teste do Optimizer Trace

8.15.16 Implementação do Rastreamento do Otimizador

O otimizador do MySQL inclui a capacidade de realizar o rastreamento; a interface é fornecida por um conjunto de variáveis de sistema `optimizer_trace_xxx` e a tabela `INFORMATION_SCHEMA.OPTIMIZER_TRACE`.
