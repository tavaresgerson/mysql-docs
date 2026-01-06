## 8.2 Otimização de instruções SQL

8.2.1 Otimização de instruções SELECT

8.2.2 Otimização de subconsultas, tabelas derivadas e referências de visualizações

8.2.3 Otimizando consultas do INFORMATION\_SCHEMA

8.2.4 Otimização das declarações de alteração de dados

8.2.5 Otimização dos privilégios do banco de dados

8.2.6 Outras dicas de otimização

A lógica central de uma aplicação de banco de dados é realizada por meio de instruções SQL, seja emitidas diretamente por um interpretador ou enviadas nos bastidores por meio de uma API. As diretrizes de ajuste nesta seção ajudam a acelerar todos os tipos de aplicações MySQL. As diretrizes cobrem operações SQL que leem e escrevem dados, o overhead nos bastidores para operações SQL em geral e operações usadas em cenários específicos, como monitoramento de banco de dados.
