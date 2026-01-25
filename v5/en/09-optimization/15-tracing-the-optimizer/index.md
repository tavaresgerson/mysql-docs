## 8.15 Rastreando o Optimizer

8.15.1 Uso Típico

8.15.2 System Variables Controlando o Tracing

8.15.3 Statements Rastreáveis

8.15.4 Otimizando a Purga de Trace

8.15.5 Tracing do Uso de Memória

8.15.6 Verificação de Privilégios

8.15.7 Interação com a Opção --debug

8.15.8 A System Variable optimizer_trace

8.15.9 A System Variable end_markers_in_json

8.15.10 Selecionando Recursos do Optimizer para Trace

8.15.11 Estrutura Geral do Trace

8.15.12 Exemplo

8.15.13 Exibindo Traces em Outras Aplicações

8.15.14 Impedindo o Uso de Optimizer Trace

8.15.15 Testando o Optimizer Trace

8.15.16 Implementação do Optimizer Trace

O optimizer do MySQL inclui a capacidade de realizar tracing; a interface é fornecida por um conjunto de system variables `optimizer_trace_xxx` e pela tabela `INFORMATION_SCHEMA.OPTIMIZER_TRACE`.