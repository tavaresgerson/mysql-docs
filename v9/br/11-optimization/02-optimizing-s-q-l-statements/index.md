## 10.2 Otimização de Instruções SQL

10.2.1 Otimização de Instruções SELECT

10.2.2 Otimização de Subconsultas, Tabelas Derivadas, Referências de Visualizações e Expressões de Tabela Comum

10.2.3 Otimização de Consultas do INFORMATION_SCHEMA

10.2.4 Otimização de Consultas do Performance Schema

10.2.5 Otimização de Declarações de Alterações de Dados

10.2.6 Otimização de Privilegios de Banco de Dados

10.2.7 Outras Dicas de Otimização

A lógica central de uma aplicação de banco de dados é realizada através de instruções SQL, seja emitidas diretamente por um interpretador ou submetidas nos bastidores por meio de uma API. As diretrizes de ajuste nesta seção ajudam a acelerar todos os tipos de aplicações MySQL. As diretrizes cobrem operações SQL que leem e escrevem dados, o overhead nos bastidores para operações SQL em geral e operações usadas em cenários específicos, como monitoramento de banco de dados.