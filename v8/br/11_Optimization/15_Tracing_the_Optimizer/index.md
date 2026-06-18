## 10.15 Rastreamento do otimizador

10.15.1 Uso típico

10.15.2 Variáveis do sistema que controlam o rastreamento

10.15.3 Declarações rastreáveis

10.15.4 Limpeza de registros de ajuste

10.15.5 Rastreamento do uso da memória

10.15.6 Verificação de privilégios

10.15.7 Interação com a opção --debug

10.15.8 A variável de sistema optimizer\_trace

10.15.9 A variável de sistema end\_markers\_in\_json

10.15.10 Selecionando recursos do otimizador para rastreamento

10.15.11 Estrutura Geral de Rastreamento

10.15.12 Exemplo

10.15.13 Exibir rastros em outras aplicações

10.15.14 Prevenção do uso do Rastreamento do Optimizer

10.15.15 Testar o otimizador de rastreamento

10.15.16 Implementação do Rastreador de Otimizador

O otimizador do MySQL inclui a capacidade de realizar o rastreamento; a interface é fornecida por um conjunto de variáveis de sistema `optimizer_trace_xxx` e a tabela `INFORMATION_SCHEMA.OPTIMIZER_TRACE`.
